/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3943907332")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    sales.id,\n\n    sales.customer_id,\n    customers.name AS customer_name,\n\tcustomers.location_id,\n    locations.name AS location_name,\n    customers.landmark,\n    customers.contact,\n\n    sales.category_id,\n    categories.name AS category_name,\n\n    sales.cost,\n    sales.created AS sale_date\n\nFROM sales\n\nLEFT JOIN customers\n    ON sales.customer_id = customers.id\n\nLEFT JOIN locations\n    ON customers.location_id = locations.id\n\nLEFT JOIN categories\n    ON sales.category_id = categories.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_d0up")

  // remove field
  collection.fields.removeById("_clone_4VcI")

  // remove field
  collection.fields.removeById("_clone_tVcu")

  // remove field
  collection.fields.removeById("_clone_YCZr")

  // remove field
  collection.fields.removeById("_clone_jiWf")

  // remove field
  collection.fields.removeById("_clone_72G9")

  // remove field
  collection.fields.removeById("_clone_nX1m")

  // remove field
  collection.fields.removeById("_clone_wZzC")

  // remove field
  collection.fields.removeById("_clone_Q78F")

  // remove field
  collection.fields.removeById("_clone_b6fB")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_TzKU",
    "max": 0,
    "min": 0,
    "name": "customer_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_nqrB",
    "max": 0,
    "min": 0,
    "name": "customer_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_R8mr",
    "max": 0,
    "min": 0,
    "name": "location_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_CMH4",
    "max": 0,
    "min": 0,
    "name": "location_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_QejH",
    "max": 0,
    "min": 0,
    "name": "landmark",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_JoZG",
    "max": 0,
    "min": 0,
    "name": "contact",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_SCCW",
    "max": 0,
    "min": 0,
    "name": "category_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_VfAz",
    "max": 0,
    "min": 0,
    "name": "category_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_DrAi",
    "max": null,
    "min": null,
    "name": "cost",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_AToT",
    "name": "sale_date",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3943907332")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    sales.id,\n\n    sales.customer_id,\n    customers.name AS customer_name,\n\tcustomers.location_id,\n    locations.name AS location_name,\n    customers.landmark,\n    customers.contact,\n\n    sales.category_id,\n    categories.name AS category_name,\n\n    sales.payment,\n    sales.created AS sale_date\n\nFROM sales\n\nLEFT JOIN customers\n    ON sales.customer_id = customers.id\n\nLEFT JOIN locations\n    ON customers.location_id = locations.id\n\nLEFT JOIN categories\n    ON sales.category_id = categories.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_d0up",
    "max": 0,
    "min": 0,
    "name": "customer_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_4VcI",
    "max": 0,
    "min": 0,
    "name": "customer_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_tVcu",
    "max": 0,
    "min": 0,
    "name": "location_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_YCZr",
    "max": 0,
    "min": 0,
    "name": "location_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_jiWf",
    "max": 0,
    "min": 0,
    "name": "landmark",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_72G9",
    "max": 0,
    "min": 0,
    "name": "contact",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_nX1m",
    "max": 0,
    "min": 0,
    "name": "category_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_wZzC",
    "max": 0,
    "min": 0,
    "name": "category_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_Q78F",
    "max": null,
    "min": null,
    "name": "payment",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_b6fB",
    "name": "sale_date",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_TzKU")

  // remove field
  collection.fields.removeById("_clone_nqrB")

  // remove field
  collection.fields.removeById("_clone_R8mr")

  // remove field
  collection.fields.removeById("_clone_CMH4")

  // remove field
  collection.fields.removeById("_clone_QejH")

  // remove field
  collection.fields.removeById("_clone_JoZG")

  // remove field
  collection.fields.removeById("_clone_SCCW")

  // remove field
  collection.fields.removeById("_clone_VfAz")

  // remove field
  collection.fields.removeById("_clone_DrAi")

  // remove field
  collection.fields.removeById("_clone_AToT")

  return app.save(collection)
})
