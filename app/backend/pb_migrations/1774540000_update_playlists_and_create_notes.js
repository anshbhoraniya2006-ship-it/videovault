/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  // 1. Update existing playlists collection
  const playlistCollection = dao.findCollectionByNameOrId("j6mdypz8khrt025");
  playlistCollection.schema.addField(new SchemaField({
    "system": false,
    "id": "playurl1",
    "name": "playlist_url",
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
  dao.saveCollection(playlistCollection);

  // 2. Create new notes collection
  const notesCollection = new Collection({
    "id": "notexxxxxx12345",
    "created": new Date().toISOString(),
    "updated": new Date().toISOString(),
    "name": "notes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "notxjiiz",
        "name": "userId",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "notrbzbc",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "not8tk6s",
        "name": "content",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "userId = @request.auth.id",
    "viewRule": "userId = @request.auth.id",
    "createRule": "@request.auth.id != '' && userId = @request.auth.id",
    "updateRule": "userId = @request.auth.id",
    "deleteRule": "userId = @request.auth.id",
    "options": {}
  });

  return dao.saveCollection(notesCollection);

}, (db) => {
  const dao = new Dao(db);
  
  // Down migration
  const playlistCollection = dao.findCollectionByNameOrId("j6mdypz8khrt025");
  playlistCollection.schema.removeField("playurl1");
  dao.saveCollection(playlistCollection);

  const notesCollection = dao.findCollectionByNameOrId("notexxxxxx12345");
  if (notesCollection) {
    dao.deleteCollection(notesCollection);
  }
})
