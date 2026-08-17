<template>
  <q-page class="full-width">
    <div class="grid">
      <q-card class="fields">
        <q-card-section>
          <q-select
            dense
            outlined
            label="Name"
            ref="nameInputEl"
            v-model.trim="customerInput"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="customersFiltered"
            :color="isNewCustomer ? 'positive' : 'amber-6'"
            :hint="isNewCustomer ? 'New customer!' : undefined"
            :hide-hint="!isNewCustomer"
            @filter="filterCustomers"
            @update:model-value="selectCustomer"
            @input-value="setCustomerInput"
            :rules="[val => !!val || 'Field cannot be empty.']"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            class="no-input-controls"
            color="amber-6"
            label="Cost"
            type="number"
            inputmode="numeric"
            min="0"
            hint="Press Ctrl + Enter to add."
            ref="costInputEl"
            v-model.trim="fieldsForm.cost"
            :rules="[val => !!val || 'Field cannot be empty.', val => val >= 0 || 'Cost must be a positive number.']"
            @keydown.ctrl.enter.prevent="handleFieldsKeydown"
            outlined
            dense 
          />

          <q-select
            color="amber-6"
            label="Category"
            ref="categoryInputEl"
            v-model="fieldsForm.category_id"
            :options="categories.map(({ id, name }) => ({ label: name, value: id }))"
            :rules="[val => !!val || 'Select category.']"
            emit-value
            map-options
            outlined
            dense
          />

          <q-btn label="Add" color="amber-6" icon="add" @click="handleFieldsButton" />
        </q-card-section>
      </q-card>

      <q-card class="sales-list">
        <q-tabs v-model="salesCategoryTab" align="left" dense active-color="brown" class="bg-amber text-white">
          <q-tab name="ALL" label="ALL" />
          <q-tab v-for="category in categories" :name="category.id" :label="category.name" :key="category.id" />
        </q-tabs>

        <q-table class="sticky-header-column-table" flat bordered hide-bottom :rows="filteredSales" :columns="salesHeaders" :pagination="{ rowsPerPage: 0 }" row-key="name">
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
              <q-td class="bg-amber-2" key="customer_name" :props="props">{{ props.row.customer_name }}</q-td>
              <q-td key="location_name" :props="props">
                <q-badge :color="props.row.location_color || 'grey'">
                  {{ props.row.location_name }}
                </q-badge>
              </q-td>
              <q-td key="landmark" :props="props">{{ props.row.landmark }}</q-td>
              <q-td key="contact" :props="props">{{ props.row.contact }}</q-td>
              <q-td key="cost" :props="props">{{ props.row.cost }}</q-td>
              <q-td key="actions" :props="props">
                <div class="actions">
                  <q-btn color="positive" size="sm">
                    <span class="row items-center no-wrap">
                      <q-icon name="edit" left></q-icon>
                      Edit
                    </span>
                  </q-btn>
                  <q-btn color="negative" size="sm">
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

      <q-card class="new-customers-list">
        <q-table class="sticky-header-column-table" flat bordered hide-bottom :rows="newCustomers" :columns="newCustomersHeaders" row-key="name" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, useTemplateRef, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()

const fieldsForm = ref({
  customer: {
    id: '',
    name: ''
  },
  cost: '',
  category_id: '',
})

// select UI state
const customerInput = ref('')

const isNewCustomer = computed(() => fieldsForm.value.customer.name && !fieldsForm.value.customer.id)

const customersFiltered = ref([])

const filterCustomers = (val, update) => {
  update(() => {
    const needle = val?.toLowerCase() || ''

    customersFiltered.value = customers.value
      .filter(({ name }) =>
        name.toLowerCase().includes(needle)
      )
      .map(({ id, name }) => ({
        label: name,
        value: id
      }))
  })
}

const selectCustomer = (option) => {
  fieldsForm.value.customer = {
    id: option.value,
    name: option.label
  }
}

const setCustomerInput = (value) => {
  customerInput.value = value

  fieldsForm.value.customer = {
    id: '',
    name: value.trim()
  }
}

const nameInputEl = useTemplateRef('nameInputEl')
const costInputEl = useTemplateRef('costInputEl')
const categoryInputEl = useTemplateRef('categoryInputEl')

// records from customers, categories ,sales table in pocketbase
const customers = ref([])
const newCustomers = ref([])
const categories = ref([])
const salesWithDetails = ref([])

const salesCategoryTab = ref('ALL')

onMounted(async () => {
  customers.value = await pb.collection('customers').getFullList({
    sort: '-created',
  })

  // sales table
  customersFiltered.value = customers.value.map(({ id, name }) => ({
    label: name,
    value: id
  }))

  // new customers table
  newCustomers.value = customers.value.filter(({ created }) => new Date(created) > new Date(Date.now() - 24 * 60 * 60 * 1000))

  categories.value = await pb.collection('categories').getFullList({
    sort: '-created',
  })

  salesWithDetails.value = await pb.collection('sales_with_details').getFullList({
    sort: '-sale_date',
  })

  // console.log('customers', customers.value)
  // console.log('categories', categories.value)
  // console.log('sales_with_details', salesWithDetails.value)
})

// filtered records from sales table
const filteredSales = computed(() => {
  if (salesCategoryTab.value === 'ALL') return salesWithDetails.value
  return salesWithDetails.value.filter(({ category_id }) => category_id === salesCategoryTab.value)
})

// table headers for sales table
const salesHeaders = [
  { name: 'customer_name', label: 'Name', field: 'customer_name', align: 'left' },
  { name: 'location_name', label: 'Location', field: 'location_name', align: 'left' },
  { name: 'landmark', label: 'Landmark', field: 'landmark', align: 'left' },
  { name: 'contact', label: 'Contact', field: 'contact', align: 'left' },
  { name: 'cost', label: 'Cost', field: 'cost', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]
const newCustomersHeaders = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' }
]

const handleFieldsKeydown = () => {
  addToSales()
}

const handleFieldsButton = () => {
  addToSales()
}

const addToSales = async () => {
  if (fieldsForm.value.customer.name && fieldsForm.value.cost && fieldsForm.value.category) {

    if (!fieldsForm.value.customer.id) {
      // create new customer in pocketbase
      const newCustomer = await pb.collection('customers').create({
        name: fieldsForm.value.customer.name,
      })
      fieldsForm.value.customer.id = newCustomer.id
      customers.value.push(newCustomer)

      $q.notify({
        type: 'positive',
        message: 'New customer added successfully!',
      })
    }

    const customer = customers.value.find(({ id }) => id === fieldsForm.value.customer.id)
    const category = categories.value.find(({ id }) => id === fieldsForm.value.category_id)

    // create new sale in pocketbase
    const newSale = await pb.collection('sales').create({
      customer_id: customer.id,
      category_id: category.id,
      cost: parseFloat(fieldsForm.value.cost),
    })

    console.log(newSale)

    // add the new sale to the list
    salesWithDetails.value.push({
      ...newSale,
      customer_name: customer.name,
      location: customer. location,
      landmark: customer.landmark,
      contact: customer.contact,
      category_name: category.name
    })

    $q.notify({
      type: 'positive',
      message: 'Sale added successfully!',
    })

    fieldsForm.value.customer.id = ''
    fieldsForm.value.customer.name = ''
    fieldsForm.value.cost = ''

    await nextTick()

    nameInputEl.value.resetValidation()
    costInputEl.value.resetValidation()  
    categoryInputEl.value.resetValidation()
  }
}
</script>

<style scoped>
@import 'src/css/d-table-sticky-header.css';

.q-page {
  display: flex;
  flex-direction: column;
}

.grid {
  flex: 1;
  height: 100%;
  padding: 0.5rem;

  display: grid;
  gap: 0.5rem;

  grid-template-columns: 1fr 30%;
  grid-template-rows: auto minmax(0, 1fr);

  grid-template-areas:
    'fields fields'
    'sales-list new-customers-list';

  overflow: hidden;
}

.fields {
  grid-area: fields;

  .q-card__section {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;

    .q-input,
    .q-select {
      flex: 1;
    }
  }
}

.sales-list {
  /* max-height: min-content;
  overflow-y: auto; */
  grid-area: sales-list;
}

.new-customers-list {
  grid-area: new-customers-list;
}

.sticky-header-column-table {
  --height: unset;
  --max-with: unset;
}

.actions {
  display: flex;
  gap: 0.5rem;

  .q-btn {
    white-space: nowrap;
  }
}
</style>

<style>
@import 'src/css/d-input-no-controls.css';
</style>
