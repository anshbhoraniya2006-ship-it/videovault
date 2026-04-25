/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "j6mdypz8khrt025",
    "created": "2026-03-26 07:47:56.135Z",
    "updated": "2026-03-26 07:47:56.135Z",
    "name": "playlists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xjiizl1x",
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
        "id": "rbzbc1h4",
        "name": "playlist_name",
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
        "id": "8tk6s7wi",
        "name": "description",
        "type": "text",
        "required": false,
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
        "id": "eveiyqse",
        "name": "videos",
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

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("j6mdypz8khrt025");

  return dao.deleteCollection(collection);
})
