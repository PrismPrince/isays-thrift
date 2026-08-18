<template>
  <q-page class="dashboard">
    <q-card class="fields">
      <q-card-section>
        <div class="row">
          <q-input
            ref="nameInputEl"
            color="amber-6"
            label="Name"
            type="text"
            v-model.trim="fieldsForm.name"
            :rules="[val => !!val || 'Name is required.']"
            outlined
            dense
          />
  
          <q-select
            color="amber-6"
            label="Location"
            v-model="fieldsForm.location_id"
            :options="locations.map(({ id, name, color }) => ({
              label: name,
              value: id,
              color
            }))"
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
                    style="width: 1rem; height: 1rem"
                  />
                </q-item-section>

                <q-item-section>
                  {{ scope.opt.label }}
                </q-item-section>
              </q-item>
            </template>

            <template #selected-item="scope">
              <div v-if="scope.opt" class="row items-center no-wrap">
                <q-badge
                  rounded
                  :color="scope.opt.color || 'grey'"
                />
                {{ scope.opt.label }}
              </div>
            </template>
          </q-select>
  
          <q-input
            color="amber-6"
            label="Landmark"
            type="text"
            v-model.trim="fieldsForm.landmark"
            outlined
            dense
          />

          <q-input
            color="amber-6"
            label="Contact"
            type="tel"
            inputmode="tel"
            v-model.trim="fieldsForm.contact"
            mask="+63 ### ### ####"
            hint="+63 9xx xxx xxxx"
            :rules="[val => !val || /^9\d{9}$/.test(val) || 'Invalid Philippine mobile number.']"
            unmasked-value
            outlined
            dense
          />
        </div>
        <div class="row items-start">
          <q-input
            color="amber-6"
            label="Facebook"
            type="url"
            v-model.trim="fieldsForm.facebook"
            placeholder="https://facebook.com/..."
            :rules="[val => !val || /^https?:\/\/(www\.)?facebook\.com\/.+$/i.test(val) || 'Invalid Facebook URL']"
            outlined
            dense
          />

          <q-input
            class="no-input-controls"
            color="amber-6"
            label="Latitude"
            type="number"
            step="any"
            v-model.number="fieldsForm.maps.lat"
            :rules="[val => !val || (val >= 11.03 && val <= 11.33) || 'Latitude must be within Bantayan Island area.']"
            outlined
            dense
          />

          <q-input
            class="no-input-controls"
            color="amber-6"
            label="Longitude"
            type="number"
            step="any"
            v-model.number="fieldsForm.maps.lon"
            :rules="[val => !val || (val >= 123.58 && val <= 123.90) || 'Longitude must be within Bantayan Island area.']"
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
            v-if="fieldsForm.type === 'edit'"
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

    <q-card>
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">
          Customers
        </div>

        <!-- :loading="loading" -->
        <q-btn
          color="primary"
          icon="refresh"
          size="sm"
          label="Refresh"
          @click="loadCustomers"
        />
      </q-card-section>

      <q-separator />
      
      <q-table class="sticky-header-column-table" flat bordered hide-bottom :rows="customersWithLocations" :columns="customersHeaders" :pagination="{ rowsPerPage: 0 }" row-key="name">
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
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class="bg-amber-2" key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="location_name" :props="props">
              <q-badge v-if="props.row.location_id !== ''" :color="props.row.location_color || 'grey'">
                {{ props.row.location_name }}
              </q-badge>
            </q-td>
            <q-td key="landmark" :props="props">{{ props.row.landmark }}</q-td>
            <q-td key="contact" :props="props">
              <q-btn
                v-if="props.row.contact"
                size="sm"
                :href="`tel:${props.row.contact}`"
              >
                <span class="row items-center no-wrap">
                  <q-icon name="phone" left></q-icon>
                  {{ props.row.contact.replace(/^(\+63)(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4') }}
                </span>
              </q-btn>
            </q-td>
            <q-td key="facebook" :props="props">
              <q-btn
                v-if="props.row.facebook"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                :href="props.row.facebook"
              >
                <span class="row items-center no-wrap">
                  <q-icon name="facebook" left></q-icon>
                  Facebook
                </span>
              </q-btn>
            </q-td>
            <q-td key="maps" :props="props">
              <q-btn
                v-if="props.row.maps.lat !== 0 && props.row.maps.lon !== 0"
                size="sm"
                target="_blank"
                rel="noopener noreferrer"
                :href="`https://www.google.com/maps/search/?api=1&query=${props.row.maps.lat},${props.row.maps.lon}`"
              >
                <span class="row items-center no-wrap">
                  <q-icon name="location_on" left></q-icon>
                  Google Maps
                </span>
              </q-btn>
            </q-td>
            <q-td key="actions" :props="props">
              <div class="actions">
                <q-btn color="positive" size="sm" @click="editCustomer(props.row)">
                  <span class="row items-center no-wrap">
                    <q-icon name="edit" left></q-icon>
                    Edit
                  </span>
                </q-btn>
                <q-btn color="negative" size="sm" @click="deleteCustomer(props.row)">
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
import { ref, onMounted, useTemplateRef, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { pb } from 'src/boot/pocketbase'

const $q = useQuasar()

const nameInputEl = useTemplateRef('nameInputEl')

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
    lon: ''
  }
})

// const customers = ref([])
const locations = ref([])
const customersWithLocations = ref([])

onMounted(async () => {
  locations.value = await pb.collection('locations').getFullList({
    sort: '-created',
  })

  loadCustomers()
})

const customersHeaders = ref([
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'location_name', label: 'Location', field: 'location_name', align: 'left' },
  { name: 'landmark', label: 'Landmark', field: 'landmark', align: 'left' },
  { name: 'contact', label: 'Contact', field: 'contact', align: 'left' },
  { name: 'facebook', label: 'Facebook', field: 'facebook', align: 'left' },
  { name: 'maps', label: 'Google Maps', field: 'maps', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
])

const loadCustomers = async () => {
  customersWithLocations.value = await pb.collection('customers_with_locations').getFullList({
    filter: 'deleted = ""',
    sort: '-created',
  })
}

const addCustomer = async () => {
  if (fieldsForm.value.name) {
    try {
      const newCustomer = await pb.collection('customers').create({
        name: fieldsForm.value.name.replace(/\s+/g, " "),
        location_id: fieldsForm.value.location_id,
        landmark: fieldsForm.value.landmark.replace(/\s+/g, " "),
        contact: fieldsForm.value.contact ? `+63${fieldsForm.value.contact}` : '',
        facebook: fieldsForm.value.facebook,
        maps: {
          lat: fieldsForm.value.maps.lat,
          lon: fieldsForm.value.maps.lon
        }
      })

      const location = locations.value.find(
        ({ id }) => fieldsForm.value.location_id === id
      )

      customersWithLocations.value.push({
        ...newCustomer,
        location_name: location?.name ?? '',
        location_color: location?.color ?? '',
      })

      $q.notify({
        type: 'positive',
        message: 'New customer added successfully!',
      })

      resetFields()
    } catch (e) {
      console.error(e)

      $q.notify({
        type: 'negative',
        message: 'Failed to add new customer.',
      })
    }
  }
}

const editCustomer = ({ id, name, location_id, landmark, contact, facebook, maps: { lat, lon} }) => {
  fieldsForm.value.type = 'edit'
  fieldsForm.value.id = id
  fieldsForm.value.name = name
  fieldsForm.value.location_id = location_id
  fieldsForm.value.landmark = landmark
  fieldsForm.value.contact = contact
  fieldsForm.value.facebook = facebook
  fieldsForm.value.maps.lat = lat
  fieldsForm.value.maps.lon = lon
}

const updateCustomer = async () => {
  if (fieldsForm.value.name) {
    try {
      await pb.collection('customers').update(fieldsForm.value.id, {
        name: fieldsForm.value.name.replace(/\s+/g, " "),
        location_id: fieldsForm.value.location_id,
        landmark: fieldsForm.value.landmark.replace(/\s+/g, " "),
        contact: fieldsForm.value.contact ? `+63${fieldsForm.value.contact}` : '',
        facebook: fieldsForm.value.facebook,
        maps: {
          lat: fieldsForm.value.maps.lat,
          lon: fieldsForm.value.maps.lon
        }
      })

      const index = customersWithLocations.value.findIndex(customer => customer.id === fieldsForm.value.id)
      const location = locations.value.find(({ id }) => id === fieldsForm.value.location_id)

      if (index !== -1) {
        customersWithLocations.value[index] = {
          id: fieldsForm.value.id,
          name: fieldsForm.value.name.replace(/\s+/g, " "),
          location_id: fieldsForm.value.location_id,
          landmark: fieldsForm.value.landmark.replace(/\s+/g, " "),
          contact: fieldsForm.value.contact ? `+63${fieldsForm.value.contact}` : '',
          facebook: fieldsForm.value.facebook,
          maps: {
            lat: fieldsForm.value.maps.lat,
            lon: fieldsForm.value.maps.lon
          },
          location_name: location.name,
          location_color: location.color,
        }
      }

      $q.notify({
        type: 'positive',
        message: `${fieldsForm.value.name} updated successfully!`,
      })

      resetFields()
    } catch (e) {
      console.error(e)

      $q.notify({
        type: 'negative',
        message: `Failed to update ${fieldsForm.value.name}.`,
      })
    }
  }
}

const resetFields = async () => {
  fieldsForm.value.type = 'create'
  fieldsForm.value.id = ''
  fieldsForm.value.name = ''
  fieldsForm.value.location_id = ''
  fieldsForm.value.landmark = ''
  fieldsForm.value.contact = ''
  fieldsForm.value.facebook = ''
  fieldsForm.value.maps.lat = ''
  fieldsForm.value.maps.lon = ''

  await nextTick()

  nameInputEl.value.resetValidation()
}

const deleteCustomer = async ({ id, name }) => {
  try {
    const customer = await pb.collection('customers').update(id, {
      deleted: new Date().toISOString()
    })
    console.log(customer)

    customersWithLocations.value = customersWithLocations.value.filter(customer => customer.id !== id)
  
    $q.notify({
      type: 'positive',
      message: `${name} deleted successfully!`,
      actions: [
        {
          label: 'Undo',
          color: 'white',
          handler: () => restoreCustomer(customer)
        }
      ]
    })
  } catch (e) {
    console.error(e)

    $q.notify({
      type: 'negative',
      message: `Failed to delete ${name}.`,
    })
  }
}

const restoreCustomer = async ({ id, name }) => {
  try {
    await pb.collection('customers').update(id, {
      deleted: ''
    })

    const customer = await pb.collection('customers_with_locations').getOne(id, {
      expand: 'locations'
    })

    customersWithLocations.value.push(customer)
    
    $q.notify({
      type: 'positive',
      message: `${name} restored successfully!`,
    })
  } catch (e) {
    console.error(e)

    $q.notify({
      type: 'negative',
      message: `Failed to restore ${name}.`,
    })
  }
}
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
  gap: 0.5rem;
  align-items: flex-start;

  .row {
    width: 100%;
    gap: 0.5rem;
  }

  .q-input,
  .q-select {
    flex: 1;
  }
}

.actions {
  display: flex;
  gap: 0.5rem;

  .q-btn {
    white-space: nowrap;
  }
}

.sticky-header-column-table {
  --height: unset;
  --max-with: unset;
}
</style>

<style>
@import 'src/css/d-input-no-controls.css';
</style>