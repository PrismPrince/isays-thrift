/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2072777352")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    customers.id,\n    customers.name,\n    customers.location_id,\n    locations.name AS location_name,\n    locations.color AS location_color,\n    customers.landmark,\n    customers.contact,\n    customers.facebook,\n    customers.maps,\n    customers.created\nFROM customers\nLEFT JOIN locations\n    ON customers.location_id = locations.id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_SLzE")

  // remove field
  collection.fields.removeById("_clone_HNSe")

  // remove field
  collection.fields.removeById("_clone_JIKm")

  // remove field
  collection.fields.removeById("_clone_u877")

  // remove field
  collection.fields.removeById("_clone_H92L")

  // remove field
  collection.fields.removeById("_clone_vYmG")

  // remove field
  collection.fields.removeById("_clone_QDUo")

  // remove field
  collection.fields.removeById("_clone_ZKD7")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_QQad",
    "max": 0,
    "min": 0,
    "name": "name",
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
    "id": "_clone_HPuY",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_SX06",
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
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_bYvO",
    "max": 0,
    "min": 0,
    "name": "location_color",
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
    "id": "_clone_ahti",
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
    "id": "_clone_W1gF",
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
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "_clone_9Kpv",
    "name": "facebook",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_jfzc",
    "name": "maps",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_1bV1",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2072777352")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n    customers.id,\n    customers.name,\n    customers.location_id,\n    locations.name AS location_name,\n    customers.landmark,\n    customers.contact,\n    customers.facebook,\n    customers.maps,\n    customers.created\nFROM customers\nLEFT JOIN locations\n    ON customers.location_id = locations.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_SLzE",
    "max": 0,
    "min": 0,
    "name": "name",
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
    "id": "_clone_HNSe",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_JIKm",
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
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_u877",
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
    "id": "_clone_H92L",
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
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "_clone_vYmG",
    "name": "facebook",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_QDUo",
    "name": "maps",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_ZKD7",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_QQad")

  // remove field
  collection.fields.removeById("_clone_HPuY")

  // remove field
  collection.fields.removeById("_clone_SX06")

  // remove field
  collection.fields.removeById("_clone_bYvO")

  // remove field
  collection.fields.removeById("_clone_ahti")

  // remove field
  collection.fields.removeById("_clone_W1gF")

  // remove field
  collection.fields.removeById("_clone_9Kpv")

  // remove field
  collection.fields.removeById("_clone_jfzc")

  // remove field
  collection.fields.removeById("_clone_1bV1")

  return app.save(collection)
})
