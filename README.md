# JsonDB

A simple and lightweight JSON file database

## Installtion

```sh
npm i @liting-yes/jsondb
```

## Hello JsonDB

```js
const JsonDB = require('@liting-yes/jsondb')
```

### Create Database

```js
/**
 * 
 * @param {string} pathDB the absolute path of the database
 */
const db = new JsonDB(pathDB)
```

### Create a jsondb file

```js
/**
 * 
 * @param {string} filePath the relative path of the new database file to the database
 * @param {any | undefined} data database file initialization data, default data is {}
 */
db.create(filePath, data)
```

### Delete a jsondb file

```js
/**
 * 
 * @param {string} filePath the relative path of the database file witch will be deleted to database
 */
db.delete(filePath)
```

### Update data

```js
/**
 * 
 * @param {any} data updated data
 * @param {array | undefined} nestedKey where the data is updated
 * @param {string | undefined} filePath the relative path of the updated data file to the database 
 */
db.update(data, nestedKey, filePath)
```

### Query data

```js
/**
 * 
 * @param {array | undefined} nestedKey where to query data
 * @param {string | undefined} filePath the relative path from the database file for data query to the database
 * @returns queried data
 */
db.query(nestedKey, filePath)
```

### Query keys

```js
/**
 * 
 * @param {array | undefined} nestedKey where to query the data keys
 * @param {string | undefined} filePath the relative path from the database file for keys query to the database
 * @returns queryed keys array
 */
db.queryKeys(nestedKey, filePath)
```

### Public property

- `db.pathDB`: the database absolute path
- `db.currentFilePath`: the absolute path of the current database file
- `db.relativePath`: the relative path of the current database file to the database (support setter)