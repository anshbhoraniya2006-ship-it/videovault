/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4tfejne7zd63t2f");

  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "abcd1234",
    "name": "liked",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }));

  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "efgh5678",
    "name": "notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4tfejne7zd63t2f");

  collection.schema.removeField("abcd1234");
  collection.schema.removeField("efgh5678");

  return dao.saveCollection(collection);
})
