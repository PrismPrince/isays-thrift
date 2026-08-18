<template>
  <q-page class="dashboard">
    <!-- Customer Form -->
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

          <q-select
            v-model="fieldsForm.location_id"
            color="amber-6"
            label="Location"
            :options="locationOptions"
            emit-value
            map-options
            outlined
            dense
            clearable
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section side>
                  <q-badge
                    rounded
                    :color="scope.opt.color || 'grey'"
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
                  :color="scope.opt.color || 'grey'"
                  class="q-mr-sm"
                />
                {{ scope.opt.label }}
              </div>
            </template>
          </q-select>

          <q-input
            v-model.trim="fieldsForm.landmark"
            color="amber-6"
            label="Landmark"
            type="text"
            outlined
            dense
          />

          <q-input
            v-model.trim="fieldsForm.contact"
            color="amber-6"
            label="Contact"
            type="tel"
            inputmode="tel"
            mask="+63 ### ### ####"
            hint="+63 9xx xxx xxxx"
            unmasked-value
            :rules="[rules.phone]"
            outlined
            dense
          />
        </div>

        <div class="row items-start">
          <q-input
            v-model.trim="fieldsForm.facebook"
            color="amber-6"
            label="Facebook"
            type="url"
            placeholder="https://facebook.com/..."
            :rules="[rules.facebook]"
            outlined
            dense
          />

          <q-input
            v-model.number="fieldsForm.maps.lat"
            class="no-input-controls"
            color="amber-6"
            label="Latitude"
            type="number"
            step="any"
            :rules="[rules.latitude]"
            outlined
            dense
          />

          <q-input
            v-model.number="fieldsForm.maps.lon"
            class="no-input-controls"
            color="amber-6"
            label="Longitude"
            type="number"
            step="any"
            :rules="[rules.longitude]"
            outlined
            dense
          />

          <q-btn
            v-if="fieldsForm.type === 'create'"
            label="Add"
            color="amber-6"
            icon="person_add"
            @click="addCustomer"
          />

          <q-btn
            v-else
            label="Update"
            color="secondary"
            icon="edit"
            @click="updateCustomer"
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

    <!-- Customer Table -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          Customers
        </div>

        <q-btn
          color="primary"
          icon="refresh"
          size="sm"
          label="Refresh"
          :loading="loading"
          @click="loadCustomers"
        />
      </q-card-section>

      <q-separator />

      <q-table
        class="sticky-header-column-table"
        flat
        bordered
        hide-bottom
        :rows="customersWithLocations"
        :columns="customersHeaders"
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
              key="location_name"
              :props="props"
            >
              <q-badge
                v-if="props.row.location_id"
                :color="props.row.location_color || 'grey'"
              >
                {{ props.row.location_name }}
              </q-badge>
            </q-td>

            <q-td
              key="landmark"
              :props="props"
            >
              {{ props.row.landmark }}
            </q-td>

            <q-td
              key="contact"
              :props="props"
            >
              <q-btn
                v-if="props.row.contact"
                size="sm"
                :href="`tel:${props.row.contact}`"
              >
                <span class="row items-center no-wrap">
                  <q-icon
                    name="phone"
                    left
                  />
                  {{ formatPhone(props.row.contact) }}
                </span>
              </q-btn>
            </q-td>

            <q-td
              key="facebook"
              :props="props"
            >
              <q-btn
                v-if="props.row.facebook"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                :href="props.row.facebook"
              >
                <span class="row items-center no-wrap">
                  <q-icon
                    name="facebook"
                    left
                  />
                  Facebook
                </span>
              </q-btn>
            </q-td>

            <q-td
              key="maps"
              :props="props"
            >
              <q-btn
                v-if="hasMaps(props.row)"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                :href="getMapsUrl(props.row)"
              >
                <span class="row items-center no-wrap">
                  <q-icon
                    name="location_on"
                    left
                  />
                  Google Maps
                </span>
              </q-btn>
            </q-td>

            <q-td
              key="actions"
              :props="props"
            >
              <div class="actions">
                <q-btn
                  color="positive"
                  size="sm"
                  icon="edit"
                  label="Edit"
                  @click="editCustomer(props.row)"
                >
                  <span class="row items-center no-wrap">
                    <q-icon name="edit" left></q-icon>
                    Edit
                  </span>
                </q-btn>

                <q-btn
                  color="negative"
                  size="sm"
                  icon="delete"
                  label="Delete"
                  @click="deleteCustomer(props.row)"
                >
                  <span class="row items-center no-wrap">
                    <q-icon name="delete" left></q-icon>
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
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
} from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()
const nameInputEl = useTemplateRef('nameInputEl')

const loading = ref(false)

const fieldsForm = ref({
  type: 'create',
  id: '',
  name: '',
  location_id: '',
  landmark: '',
  contact: '',
  facebook: '',
  maps: {
    lat: '',
    lon: '',
  },
})

const locations = ref([])
const customersWithLocations = ref([])

const customersHeaders = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'location_name',
    label: 'Location',
    field: 'location_name',
    align: 'left',
  },
  {
    name: 'landmark',
    label: 'Landmark',
    field: 'landmark',
    align: 'left',
  },
  {
    name: 'contact',
    label: 'Contact',
    field: 'contact',
    align: 'left',
  },
  {
    name: 'facebook',
    label: 'Facebook',
    field: 'facebook',
    align: 'left',
  },
  {
    name: 'maps',
    label: 'Google Maps',
    field: 'maps',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'left',
  },
]

const locationOptions = computed(() =>
  locations.value.map(({ id, name, color }) => ({
    label: name,
    value: id,
    color,
  }))
)

const rules = {
  required: field => value =>
    !!value || `${field} is required.`,

  phone: value =>
    !value ||
    /^9\d{9}$/.test(value) ||
    'Invalid Philippine mobile number.',

  facebook: value =>
    !value ||
    /^https?:\/\/(www\.)?facebook\.com\/.+$/i.test(value) ||
    'Invalid Facebook URL.',

  latitude: value =>
    !value ||
    (value >= 11.03 && value <= 11.33) ||
    'Latitude must be within Bantayan Island area.',

  longitude: value =>
    !value ||
    (value >= 123.58 && value <= 123.90) ||
    'Longitude must be within Bantayan Island area.',
}

const getLocation = locationId =>
  locations.value.find(({ id }) => id === locationId)

const normalizeText = value =>
  value?.replace(/\s+/g, ' ').trim() ?? ''

const getCustomerPayload = () => ({
  name: normalizeText(fieldsForm.value.name),
  location_id: fieldsForm.value.location_id,
  landmark: normalizeText(fieldsForm.value.landmark),
  contact: fieldsForm.value.contact
    ? `+63${fieldsForm.value.contact}`
    : '',
  facebook: fieldsForm.value.facebook,
  maps: {
    lat: fieldsForm.value.maps.lat,
    lon: fieldsForm.value.maps.lon,
  },
})

const addLocationData = customer => {
  const location = getLocation(customer.location_id)

  return {
    ...customer,
    location_name: location?.name ?? '',
    location_color: location?.color ?? '',
  }
}

const loadCustomers = async () => {
  loading.value = true

  try {
    customersWithLocations.value =
      await pb.collection('customers_with_locations').getFullList({
        filter: 'deleted = ""',
        sort: '-created',
      })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to load customers.',
    })
  } finally {
    loading.value = false
  }
}

const addCustomer = async () => {
  if (!fieldsForm.value.name) return

  try {
    const newCustomer = await pb
      .collection('customers')
      .create(getCustomerPayload())

    customersWithLocations.value.push(
      addLocationData(newCustomer)
    )

    $q.notify({
      type: 'positive',
      message: 'New customer added successfully!',
    })

    resetFields()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to add new customer.',
    })
  }
}

const editCustomer = customer => {
  fieldsForm.value = {
    type: 'edit',
    id: customer.id,
    name: customer.name,
    location_id: customer.location_id,
    landmark: customer.landmark,
    contact: customer.contact,
    facebook: customer.facebook,
    maps: {
      lat: customer.maps?.lat ?? '',
      lon: customer.maps?.lon ?? '',
    },
  }
}

const updateCustomer = async () => {
  if (!fieldsForm.value.name) return

  const name = normalizeText(fieldsForm.value.name)

  try {
    const updatedCustomer = await pb
      .collection('customers')
      .update(
        fieldsForm.value.id,
        getCustomerPayload()
      )

    const index = customersWithLocations.value.findIndex(
      customer => customer.id === updatedCustomer.id
    )

    if (index !== -1) {
      customersWithLocations.value[index] =
        addLocationData(updatedCustomer)
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

const deleteCustomer = async customer => {
  try {
    const deletedCustomer = await pb
      .collection('customers')
      .update(customer.id, {
        deleted: new Date().toISOString(),
      })

    customersWithLocations.value =
      customersWithLocations.value.filter(
        item => item.id !== customer.id
      )

    $q.notify({
      type: 'positive',
      message: `${customer.name} deleted successfully!`,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () => restoreCustomer(deletedCustomer),
        },
      ],
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to delete ${customer.name}.`,
    })
  }
}

const restoreCustomer = async customer => {
  try {
    const restoredCustomer = await pb
      .collection('customers')
      .update(customer.id, {
        deleted: '',
      })

    customersWithLocations.value.push(
      addLocationData(restoredCustomer)
    )

    $q.notify({
      type: 'positive',
      message: `${customer.name} restored successfully!`,
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to restore ${customer.name}.`,
    })
  }
}

const resetFields = async () => {
  fieldsForm.value = {
    type: 'create',
    id: '',
    name: '',
    location_id: '',
    landmark: '',
    contact: '',
    facebook: '',
    maps: {
      lat: '',
      lon: '',
    },
  }

  await nextTick()

  nameInputEl.value?.resetValidation()
}

const formatPhone = phone =>
  phone.replace(
    /^(\+63)(\d{3})(\d{3})(\d{4})$/,
    '$1 $2 $3 $4'
  )

const hasMaps = customer =>
  customer.maps?.lat !== 0 &&
  customer.maps?.lon !== 0 &&
  customer.maps?.lat !== '' &&
  customer.maps?.lon !== ''

const getMapsUrl = customer =>
  `https://www.google.com/maps/search/?api=1&query=${customer.maps.lat},${customer.maps.lon}`

onMounted(async () => {
  try {
    locations.value =
      await pb.collection('locations').getFullList({
        sort: '-created',
      })

    await loadCustomers()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to initialize customer data.',
    })
  }
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

.location-dot {
  width: 1rem;
  height: 1rem;
}

.sticky-header-column-table {
  --height: unset;
  --max-with: unset;
}
</style>

<style>
@import 'src/css/d-input-no-controls.css';
</style>