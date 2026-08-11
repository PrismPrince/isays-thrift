<template>
  <datalist id="names">
    <option v-for="customer in customers" :key="customer.id" :value="customer.name" />
  </datalist>

  <q-page class="full-width">
    <div class="dashboard">
      <q-card class="fields">
        <q-card-section>
          <input type="hidden" v-model="fieldsForm.customerId">
          <q-input
            color="amber-6"
            label="Name"
            type="text"
            list="names"
            hint="Press Ctrl + Enter to add."
            ref="nameInputEl"
            v-model.trim="fieldsForm.name"
            :rules="[val => !!val || 'Field cannot be empty.']"
            @keydown.ctrl.enter.prevent="handleFieldsKeydown"
            outlined
            dense 
          />
          <q-input
            color="amber-6"
            label="Payment"
            type="number"
            inputmode="numeric"
            min="0"
            hint="Press Ctrl + Enter to add."
            ref="paymentInputEl"
            v-model.trim="fieldsForm.payment"
            :rules="[val => !!val || 'Field cannot be empty.', val => val >= 0 || 'Payment must be a positive number.']"
            @keydown.ctrl.enter.prevent="handleFieldsKeydown"
            outlined
            dense 
          />
          <q-select
            color="amber-6"
            label="Category"
            ref="categoryInputEl"
            v-model="fieldsForm.category"
            :options="categories.map(({ id, name }) => ({ label: name, value: id }))"
            :rules="[val => !!val || 'Select category.']"
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
        <q-table class="sticky-header-column-table" flat bordered hide-bottom :rows="filteredSales" :columns="salesHeaders" :pagination="{ rowsPerPage: 0 }" row-key="name" />
        <!--q-markup-table class="table-header">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Payment</th>
            <th class="text-left">Pickup</th>
          </tr>
        </thead>
      </q-markup-table>
      <q-markup-table class="table-records">
        <tbody>
          <tr v-for="(sale, index) in sales" :key="index">
            <td>{{ sale.name }}</td>
            <td>{{ sale.payment }}</td>
            <td>{{ sale.pickup === 'PICKUP' ? 'PICKUP' : '' }}</td>
          </tr>
          <tr v-for="(item, index) in 50" :key="index">
            <td>Sample</td>
            <td>Sample</td>
            <td>Sample</td>
          </tr>
        </tbody>
      </q-markup-table-->
      </q-card>

      <q-card class="new-customers-list">
        <q-table class="sticky-header-column-table" flat bordered hide-bottom :rows="newCustomers" :columns="newCustomersHeaders" row-key="name" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, useTemplateRef, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()

const fieldsForm = ref({
  customerId: '',
  name: '',
  payment: '',
  category: null,
})

const nameInputEl = useTemplateRef('nameInputEl')
const paymentInputEl = useTemplateRef('paymentInputEl')
const categoryInputEl = useTemplateRef('categoryInputEl')

// records from customers, categories ,sales table in pocketbase
const customers = ref([])
const newCustomers = ref([])
const categories = ref([])
const salesWithDetails = ref([])

onMounted(async () => {
  customers.value = await pb.collection('customers').getFullList({
    sort: '-created',
  })

  newCustomers.value = customers.value.filter(({ created }) => new Date(created) > new Date(Date.now() - 24 * 60 * 60 * 1000))

  categories.value = await pb.collection('categories').getFullList({
    sort: '-created',
  })

  salesWithDetails.value = await pb.collection('sales_with_details').getFullList({
    sort: '-sale_date',
  })

  console.log('customers', customers.value)
  console.log('categories', categories.value)
  console.log('sales_with_details', salesWithDetails.value)
})

watch(
  () => fieldsForm.value.name,
  (newName) => {
    const customer = customers.value.find((customer) => customer.name === newName)
    if (customer) {
      fieldsForm.value.customerId = customer.id
    } else {
      fieldsForm.value.customerId = ''
    }
  }
)

// records from sales table in pocketbase
const filteredSales = computed(() => {
  if (salesCategoryTab.value === 'ALL') return salesWithDetails.value
  return salesWithDetails.value.filter(({ category_id }) => category_id === salesCategoryTab.value)
})

// table headers for sales table
const salesHeaders = [
  { name: 'customer_name', label: 'Name', field: 'customer_name', align: 'left' },
  { name: 'location', label: 'Location', field: 'location', align: 'left' },
  { name: 'landmark', label: 'Landmark', field: 'landmark', align: 'left' },
  { name: 'contact', label: 'Contact', field: 'contact', align: 'left' },
  { name: 'payment', label: 'Payment', field: 'payment', align: 'left' },
]
const newCustomersHeaders = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' }
]
const salesCategoryTab = ref('ALL')


const handleFieldsKeydown = () => {
  addToSales()
}

const handleFieldsButton = () => {
  addToSales()
}

const addToSales = async () => {
  if (fieldsForm.value.name && fieldsForm.value.payment && fieldsForm.value.category.value) {

    if (!fieldsForm.value.customerId) {
      // create new customer in pocketbase
      const newCustomer = await pb.collection('customers').create({
        name: fieldsForm.value.name,
      })
      fieldsForm.value.customerId = newCustomer.id
      customers.value.push(newCustomer)

      console.log(newCustomer)

      $q.notify({
        type: 'positive',
        message: 'New customer added successfully!',
      })
    }

    const customer = customers.value.find(({ id }) => id === fieldsForm.value.customerId)
    const category = categories.value.find(({ id }) => id === fieldsForm.value.category.value)

    // create new sale in pocketbase
    const newSale = await pb.collection('sales').create({
      customer_id: fieldsForm.value.customerId,
      category_id: fieldsForm.value.category.value,
      payment: parseFloat(fieldsForm.value.payment),
      delivered: false,
      paid: false,
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

    fieldsForm.value.customerId = ''
    fieldsForm.value.name = ''
    fieldsForm.value.payment = ''

    await nextTick()

    nameInputEl.value.resetValidation()
    paymentInputEl.value.resetValidation()  
    categoryInputEl.value.resetValidation()
  }
}
</script>

<style scoped>
.q-page {
  /* height: 1dvh;
  overflow: hidden;
  padding: 0.5rem; */
  display: flex;
  flex-direction: column;
}

.dashboard {
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
  /* height or max-height is important */
  height: 310px;

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  /* max-width: 600px; */

  td:first-child {
    /* bg color is important for td; just specify one */
    background-color: #00b4ff;
  }
  tr th {
    position: sticky;
    /* higher than z-index for td below */
    z-index: 2;
    /* bg color is important; just specify one */
    background: #00b4ff;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
    /* highest z-index */
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child {
    /* highest z-index */
    z-index: 3;
  }
  td:first-child {
    z-index: 1;
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>

<style>
/* Removes the dropdown arrow icon across Chrome, Edge, and Safari */
input[list]::-webkit-calendar-picker-indicator {
  display: none !important;
}

input[list]::-webkit-list-button {
  opacity: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
