/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3943907332")

  // update collection data
  unmarshal({
    "name": "sales_with_details",
    "viewQuery": "SELECT\n    sales.id,\n\n    sales.customer_id,\n    customers.name AS customer_name,\n    customers.location,\n    customers.landmark,\n    customers.contact,\n\n    sales.category_id,\n    categories.name AS category_name,\n\n    sales.payment,\n    sales.created AS sale_date\n\nFROM sales\n\nLEFT JOIN customers\n    ON sales.customer_id = customers.id\n\nLEFT JOIN categories\n    ON sales.category_id = categories.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_eus1")

  // remove field
  collection.fields.removeById("_clone_VEYa")

  // remove field
  collection.fields.removeById("_clone_ctIi")

  // remove field
  collection.fields.removeById("_clone_7626")

  // remove field
  collection.fields.removeById("_clone_TYjw")

  // remove field
  collection.fields.removeById("_clone_PEN7")

  // remove field
  collection.fields.removeById("_clone_ILOC")

  // remove field
  collection.fields.removeById("_clone_AToT")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_zKOL",
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
    "id": "_clone_1fG1",
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
    "id": "_clone_z4mf",
    "max": 0,
    "min": 0,
    "name": "location",
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
    "id": "_clone_RhcM",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_7p7V",
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
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_TQKN",
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
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_D6PX",
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
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_ypAo",
    "max": null,
    "min": null,
    "name": "payment",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_NaUt",
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
    "name": "sales_with_customers",
    "viewQuery": "SELECT\n    sales.id,\n    sales.customer_id,\n    customers.name AS customer_name,\n    customers.location,\n    customers.landmark,\n    customers.contact,\n    sales.payment,\n    sales.category,\n    sales.created AS sale_date\nFROM sales\nLEFT JOIN customers\n    ON sales.customer_id = customers.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_eus1",
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
    "id": "_clone_VEYa",
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
    "id": "_clone_ctIi",
    "max": 0,
    "min": 0,
    "name": "location",
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
    "id": "_clone_7626",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_TYjw",
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
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_PEN7",
    "max": null,
    "min": null,
    "name": "payment",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_ILOC",
    "max": 0,
    "min": 0,
    "name": "category",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_AToT",
    "name": "sale_date",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_zKOL")

  // remove field
  collection.fields.removeById("_clone_1fG1")

  // remove field
  collection.fields.removeById("_clone_z4mf")

  // remove field
  collection.fields.removeById("_clone_RhcM")

  // remove field
  collection.fields.removeById("_clone_7p7V")

  // remove field
  collection.fields.removeById("_clone_TQKN")

  // remove field
  collection.fields.removeById("_clone_D6PX")

  // remove field
  collection.fields.removeById("_clone_ypAo")

  // remove field
  collection.fields.removeById("_clone_NaUt")

  return app.save(collection)
})
