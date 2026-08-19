<template>
  <q-page class="dashboard">
    <!-- Location Form -->
    <q-card class="fields">
      <q-card-section>
        <div class="row">
          <q-input
            ref="nameInputEl"
            v-model.trim="fieldsForm.name"
            color="amber-6"
            label="Name"
            type="text"
            :rules="[rules.required('Name')]"
            outlined
            dense
          />

          <q-input
            v-model.trim="fieldsForm.municipality"
            color="amber-6"
            label="Municipality"
            type="text"
            outlined
            dense
          />

          <q-select
            v-model="fieldsForm.color"
            color="amber-6"
            label="Color"
            :options="colors"
            emit-value
            map-options
            outlined
            dense
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section side>
                  <q-badge
                    rounded
                    :color="scope.opt.value"
                    class="location-dot"
                  />
                </q-item-section>

                <q-item-section>
                  {{ scope.opt.label }}
                </q-item-section>
              </q-item>
            </template>

            <template #selected-item="scope">
              <div
                v-if="scope.opt"
                class="row items-center no-wrap"
              >
                <q-badge
                  rounded
                  :color="scope.opt.value"
                  class="q-mr-sm"
                />

                {{ scope.opt.label }}
              </div>
            </template>
          </q-select>
        </div>

        <div class="row items-start">
          <q-btn
            v-if="fieldsForm.type === 'create'"
            label="Add"
            color="amber-6"
            icon="add_location"
            @click="addLocation"
          />

          <q-btn
            v-else
            label="Update"
            color="secondary"
            icon="edit"
            @click="updateLocation"
          />

          <q-btn
            v-if="fieldsForm.type === 'edit'"
            label="Cancel"
            color="warning"
            icon="cancel"
            @click="resetFields"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Location Table -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          Locations
        </div>

        <q-btn
          color="primary"
          icon="refresh"
          size="sm"
          label="Refresh"
          :loading="loading"
          @click="loadLocations"
        />
      </q-card-section>

      <q-separator />

      <q-table
        class="sticky-header-column-table"
        flat
        bordered
        hide-bottom
        :rows="locations"
        :columns="locationsHeaders"
        :pagination="{ rowsPerPage: 0 }"
        row-key="id"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="bg-amber-3"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td
              key="name"
              :props="props"
              class="bg-amber-2"
            >
              {{ props.row.name }}
            </q-td>

            <q-td
              key="municipality"
              :props="props"
            >
              {{ props.row.municipality }}
            </q-td>

            <q-td
              key="color"
              :props="props"
            >
              <div class="row items-center no-wrap">
                <q-badge
                  v-if="props.row.color"
                  :color="props.row.color"
                >{{ getColorLabel(props.row.color) }}</q-badge>
              </div>
            </q-td>

            <q-td
              key="actions"
              :props="props"
            >
              <div class="actions">
                <q-btn
                  color="positive"
                  size="sm"
                  @click="editLocation(props.row)"
                >
                  <span class="row items-center no-wrap">
                    <q-icon
                      name="edit"
                      left
                    />
                    Edit
                  </span>
                </q-btn>

                <q-btn
                  color="negative"
                  size="sm"
                  @click="deleteLocation(props.row)"
                >
                  <span class="row items-center no-wrap">
                    <q-icon
                      name="delete"
                      left
                    />
                    Delete
                  </span>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import {
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
} from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'
import { colors, getColorLabel } from 'src/constants/colors'

const $q = useQuasar()
const nameInputEl = useTemplateRef('nameInputEl')

const loading = ref(false)

const fieldsForm = ref({
  type: 'create',
  id: '',
  name: '',
  municipality: '',
  color: '',
})

const locations = ref([])

const locationsHeaders = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'municipality',
    label: 'Municipality',
    field: 'municipality',
    align: 'left',
  },
  {
    name: 'color',
    label: 'Color',
    field: 'color',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'left',
  },
]

const rules = {
  required: field => value =>
    !!value || `${field} is required.`,
}

const normalizeText = value =>
  value?.replace(/\s+/g, ' ').trim() ?? ''

const getLocationPayload = () => ({
  name: normalizeText(fieldsForm.value.name),
  municipality: normalizeText(fieldsForm.value.municipality),
  color: fieldsForm.value.color || '',
})

const loadLocations = async () => {
  loading.value = true

  try {
    locations.value =
      await pb.collection('locations').getFullList({
        filter: 'deleted = ""',
        sort: '-created',
      })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to load locations.',
    })
  } finally {
    loading.value = false
  }
}

const addLocation = async () => {
  if (!fieldsForm.value.name) return

  const name = normalizeText(fieldsForm.value.name)

  try {
    const newLocation = await pb
      .collection('locations')
      .create(getLocationPayload())

    locations.value.unshift(newLocation)

    $q.notify({
      type: 'positive',
      message: `${name} added successfully!`,
    })

    resetFields()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to add new location.',
    })
  }
}

const editLocation = location => {
  fieldsForm.value = {
    type: 'edit',
    id: location.id,
    name: location.name,
    municipality: location.municipality ?? '',
    color: location.color ?? '',
  }
}

const updateLocation = async () => {
  if (!fieldsForm.value.name) return

  const name = normalizeText(fieldsForm.value.name)

  try {
    const updatedLocation = await pb
      .collection('locations')
      .update(
        fieldsForm.value.id,
        getLocationPayload()
      )

    const index = locations.value.findIndex(
      location => location.id === updatedLocation.id
    )

    if (index !== -1) {
      locations.value[index] = updatedLocation
    }

    $q.notify({
      type: 'positive',
      message: `${name} updated successfully!`,
    })

    resetFields()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to update ${name}.`,
    })
  }
}

const deleteLocation = async location => {
  try {
    const deletedLocation = await pb
      .collection('locations')
      .update(location.id, {
        deleted: new Date().toISOString(),
      })

    locations.value = locations.value.filter(
      item => item.id !== location.id
    )

    $q.notify({
      type: 'positive',
      message: `${location.name} deleted successfully!`,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () =>
            restoreLocation(deletedLocation),
        },
      ],
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to delete ${location.name}.`,
    })
  }
}

const restoreLocation = async location => {
  try {
    const restoredLocation = await pb
      .collection('locations')
      .update(location.id, {
        deleted: '',
      })

    locations.value.unshift(restoredLocation)

    $q.notify({
      type: 'positive',
      message: `${location.name} restored successfully!`,
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to restore ${location.name}.`,
    })
  }
}

const resetFields = async () => {
  fieldsForm.value = {
    type: 'create',
    id: '',
    name: '',
    municipality: '',
    color: '',
  }

  await nextTick()

  nameInputEl.value?.resetValidation()
}

onMounted(() => {
  loadLocations()
})
</script>

<style scoped>
@import 'src/css/d-table-sticky-header.css';

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.fields .q-card__section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.fields .row {
  width: 100%;
  gap: 0.5rem;
}

.fields .q-input,
.fields .q-select {
  flex: 1;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions .q-btn {
  white-space: nowrap;
}

.sticky-header-column-table {
  --height: unset;
  --max-with: unset;
}
</style>