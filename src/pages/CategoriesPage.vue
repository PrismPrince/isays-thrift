<template>
  <q-page class="dashboard">
    <!-- Category Form -->
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
            v-model.trim="fieldsForm.description"
            color="amber-6"
            label="Description"
            type="text"
            outlined
            dense
          />
        </div>

        <div class="row items-start">
          <q-btn
            v-if="fieldsForm.type === 'create'"
            label="Add"
            color="amber-6"
            icon="add"
            @click="addCategory"
          />

          <q-btn
            v-else
            label="Update"
            color="secondary"
            icon="edit"
            @click="updateCategory"
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

    <!-- Category Table -->
    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          Categories
        </div>

        <q-btn
          color="primary"
          icon="refresh"
          size="sm"
          label="Refresh"
          :loading="loading"
          @click="loadCategories"
        />
      </q-card-section>

      <q-separator />

      <q-table
        class="sticky-header-column-table"
        flat
        bordered
        hide-bottom
        :rows="categories"
        :columns="categoriesHeaders"
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
              key="description"
              :props="props"
            >
              {{ props.row.description }}
            </q-td>

            <q-td
              key="actions"
              :props="props"
            >
              <div class="actions">
                <q-btn
                  color="positive"
                  size="sm"
                  @click="editCategory(props.row)"
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
                  @click="deleteCategory(props.row)"
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

const $q = useQuasar()
const nameInputEl = useTemplateRef('nameInputEl')

const loading = ref(false)

const fieldsForm = ref({
  type: 'create',
  id: '',
  name: '',
  description: '',
})

const categories = ref([])

const categoriesHeaders = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
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

const getCategoryPayload = () => ({
  name: normalizeText(fieldsForm.value.name),
  description: normalizeText(fieldsForm.value.description),
})

const loadCategories = async () => {
  loading.value = true

  try {
    categories.value =
      await pb.collection('categories').getFullList({
        filter: 'deleted = ""',
        sort: '-created',
      })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to load categories.',
    })
  } finally {
    loading.value = false
  }
}

const addCategory = async () => {
  if (!fieldsForm.value.name) return

  const name = normalizeText(fieldsForm.value.name)

  try {
    const newCategory = await pb
      .collection('categories')
      .create(getCategoryPayload())

    categories.value.unshift(newCategory)

    $q.notify({
      type: 'positive',
      message: `${name} added successfully!`,
    })

    resetFields()
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Failed to add new category.',
    })
  }
}

const editCategory = category => {
  fieldsForm.value = {
    type: 'edit',
    id: category.id,
    name: category.name,
    description: category.description ?? '',
  }
}

const updateCategory = async () => {
  if (!fieldsForm.value.name) return

  const name = normalizeText(fieldsForm.value.name)

  try {
    const updatedCategory = await pb
      .collection('categories')
      .update(
        fieldsForm.value.id,
        getCategoryPayload()
      )

    const index = categories.value.findIndex(
      category => category.id === updatedCategory.id
    )

    if (index !== -1) {
      categories.value[index] = updatedCategory
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

const deleteCategory = async category => {
  try {
    const deletedCategory = await pb
      .collection('categories')
      .update(category.id, {
        deleted: new Date().toISOString(),
      })

    categories.value = categories.value.filter(
      item => item.id !== category.id
    )

    $q.notify({
      type: 'positive',
      message: `${category.name} deleted successfully!`,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () =>
            restoreCategory(deletedCategory),
        },
      ],
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to delete ${category.name}.`,
    })
  }
}

const restoreCategory = async category => {
  try {
    const restoredCategory = await pb
      .collection('categories')
      .update(category.id, {
        deleted: '',
      })

    categories.value.unshift(restoredCategory)

    $q.notify({
      type: 'positive',
      message: `${category.name} restored successfully!`,
    })
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: `Failed to restore ${category.name}.`,
    })
  }
}

const resetFields = async () => {
  fieldsForm.value = {
    type: 'create',
    id: '',
    name: '',
    description: '',
  }

  await nextTick()

  nameInputEl.value?.resetValidation()
}

onMounted(() => {
  loadCategories()
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

.fields .q-input {
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