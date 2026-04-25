/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("j6mdypz8khrt025");

  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "playlik1",
    "name": "liked",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }));

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("j6mdypz8khrt025");

  collection.schema.removeField("playlik1");

  return dao.saveCollection(collection);
})
