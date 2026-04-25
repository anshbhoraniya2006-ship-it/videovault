/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  const playlistCollection = dao.findCollectionByNameOrId("j6mdypz8khrt025");
  playlistCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "playvcnt",
    "name": "external_video_count",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }));
  
  return dao.saveCollection(playlistCollection);
}, (db) => {
  const dao = new Dao(db);
  const playlistCollection = dao.findCollectionByNameOrId("j6mdypz8khrt025");
  playlistCollection.schema.removeField("playvcnt");
  return dao.saveCollection(playlistCollection);
})
