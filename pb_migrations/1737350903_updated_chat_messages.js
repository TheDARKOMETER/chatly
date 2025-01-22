/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("25h3mg59k9owqdw")

  // remove
  collection.schema.removeField("e4qcv3wu")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("25h3mg59k9owqdw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e4qcv3wu",
    "name": "avatarUrl",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
})
