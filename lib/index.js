const path = require('path')
const fs = require('fs')

class JsonDB {
    /**
     * database absolute path
     */
    pathDB

    /**
     * the absolute path of the current database file
     */
    currentFilePath

    /**
     * 
     * @param {string} pathDB the absolute path of the database
     * 
     * @description
     * create a database instance
     */
    constructor(pathDB) {
        if (!pathDB) {
            return new Error(`NewError: pathDB ${pathDB} must be a path string`)
        }

        this.pathDB = pathDB

        try {
            if (fs.existsSync(this.pathDB)) {
                console.warn(`CreateWran: the folder ${this.pathDB} already exists`)
            }   else {
                fs.mkdirSync(this.pathDB)
            }
        }   catch (err) {
            console.error(err)
        }
    }

    /**
     * 
     * @param {string} filePath the relative path of the new database file to the database
     * @param {any | undefined} data database file initialization data
     * 
     * @description
     * create a new database file 
     */
    create (filePath, data) {
        data ??= "{}"

        if (fs.existsSync(path.resolve(this.pathDB, filePath))) {
            return Error(`CreateError: the file ${path.resolve(this.pathDB, filePath)} already exists`)
        }   else {
            try {
                fs.writeFileSync(path.resolve(this.pathDB, filePath), JSON.stringify(data))
                this.currentFilePath = path.resolve(this.pathDB, filePath)
            }   catch (err) {
                console.error(err)
            }
        }
    }

    /**
     * 
     * @param {string} filePath the relative path of the database file witch will be deleted to database
     * 
     * @description
     * delete database file
     */
    delete (filePath) {
        try {
            fs.unlinkSync(path.resolve(this.pathDB, filePath))
        }   catch (err) {
            console.error(errr)
        }

        this.currentFilePath = this.pathDB
    }

    /**
     * 
     * @param {any} data updated data
     * @param {array | undefined} nestedKey where the data is updated
     * @param {string | undefined} filePath the relative path of the updated data file to the database
     * 
     * @description
     * update database file data
     */
    update (data, nestedKey, filePath) {
        if (nestedKey && !Array.isArray(nestedKey)) {
            return new Error(`UpdateError: nestedKey ${nestedKey} must be an array`)
        }

        let isFileExist = false

        if (filePath) {
            try {
                isFileExist = fs.existsSync(path.resolve(this.pathDB, filePath))
            }   catch (err) {
                console.error(err)
            }
    
            if (isFileExist) {
                this.currentFilePath = path.resolve(this.pathDB, filePath)
            }   else {
                return Error(`UpdateError: the file ${path.resolve(this.pathDB, filePath)} does not exist`)
            }
        }

        try {
            const fileDataJSON = fs.readFileSync(this.currentFilePath, 'utf-8')
            const fileData = JSON.parse(fileDataJSON)
            const nestedDepth = nestedKey?.length || 0

            if (nestedDepth === 0) {
                fs.writeFileSync(this.currentFilePath, JSON.stringify(data))
            }   else {
                nestedKey.reduce((db, key, i) => {
                    if (i + 1 === nestedDepth) {
                        db[key] = data
                    }

                    if (Array.isArray(db)) {
                        if (db.length > key) {
                            return db[key]
                        }   else {
                            return new Error(`UpdateError: params[${i}] ${key} is an unexpected value`)
                        }
                    }   else if (Object.prototype.toString.call(db) === '[object Object]') {
                        if (db.hasOwnProperty(key)) {
                            return db[key]
                        }   else {
                            return new Error(`UpdateError: params[${i}] ${key} is an unexpected value`)
                        }
                    }
    
                    return new Error(`UpdateError: filedata ${db} or params[${i}] ${key} is an unexpected value`)
                }, fileData)

                fs.writeFileSync(this.currentFilePath, JSON.stringify(fileData))
            }
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * 
     * @param {array | undefined} nestedKey where to query data
     * @param {string | undefined} filePath the relative path from the database file for data query to the database
     * @returns queried data
     * 
     * @description
     * query database file data
     */
    query (nestedKey, filePath) {
        if (nestedKey && !Array.isArray(nestedKey)) {
            return new Error(`QueryError: nestedKey ${nestedKey} must be an array`)
        }

        let isFileExist = false

        if (filePath) {
            try {
                isFileExist = fs.existsSync(path.resolve(this.pathDB, filePath))
            }   catch (err) {
                console.error(err)
            }
    
            if (isFileExist) {
                this.currentFilePath = path.resolve(this.pathDB, filePath)
            }   else {
                return Error(`QueryError: the file ${path.resolve(this.pathDB, filePath)} does not exist`)
            }
        }
    
        try {
            const fileDataJSON = fs.readFileSync(this.currentFilePath, 'utf-8')
            const fileData = JSON.parse(fileDataJSON)
            const nestedDepth = nestedKey?.length || 0

            if (nestedDepth === 0) {
                return fileData
            }   else {
                const value = nestedKey.reduce((db, key, i) => {
                    if (Array.isArray(db)) {
                        if (db.length > key) {
                            return db[key]
                        }   else {
                            return new Error(`QueryError: params[${i}] ${key} is an unexpected value`)
                        }
                    }   else if (Object.prototype.toString.call(db) === '[object Object]') {
                        if (db.hasOwnProperty(key)) {
                            return db[key]
                        }   else {
                            return new Error(`QueryError: params[${i}] ${key} is an unexpected value`)
                        }
                    }
    
                    return new Error(`QueryError: filedata ${db} or params[${i}] ${key} is not as expected`)
                }, fileData)
    
                return value
            }
        }   catch (err) {
            console.error(err)
        }
    }

    /**
     * 
     * @param {array | undefined} nestedKey where to query the data keys
     * @param {string | undefined} filePath the relative path from the database file for keys query to the database
     * @returns queryed keys array
     */
    queryKeys (nestedKey, filePath) {
        if (nestedKey && !Array.isArray(nestedKey)) {
            return new Error(`QueryError: nestedKey ${nestedKey} must be an array`)
        }

        let isFileExist = false

        if (filePath) {
            try {
                isFileExist = fs.existsSync(path.resolve(this.pathDB, filePath))
            }   catch (err) {
                console.error(err)
            }
    
            if (isFileExist) {
                this.currentFilePath = path.resolve(this.pathDB, filePath)
            }   else {
                return Error(`QueryError: the file ${path.resolve(this.pathDB, filePath)} does not exist`)
            }
        }

        try {
            const fileDataJSON = fs.readFileSync(this.currentFilePath, 'utf-8')
            const fileData = JSON.parse(fileDataJSON)
            const nestedDepth = nestedKey?.length || 0
            let targetObject = {}

            if (nestedDepth === 0) {
                targetObject = fileData
            }   else {
                targetObject = nestedKey.reduce((db, key, i) => {
                    if (Array.isArray(db)) {
                        if (db.length > key) {
                            return db[key]
                        }   else {
                            return new Error(`QueryError: params[${i}] ${key} is an unexpected value`)
                        }
                    }   else if (Object.prototype.toString.call(db) === '[object Object]') {
                        if (db.hasOwnProperty(key)) {
                            return db[key]
                        }   else {
                            return new Error(`QueryError: params[${i}] ${key} is an unexpected value`)
                        }
                    }
    
                    return new Error(`QueryError: filedata ${db} or params[${i}] ${key} is not as expected`)
                }, fileData)
            }

            if (Object.prototype.toString.call(targetObject) === '[object Object]') {
                return Object.keys(targetObject)
            }   else {
                console.error(`nestedKey ${nestedKey} or filePath ${filePath} is an unexpected value`)
            }
        }   catch (err) {
            console.error(err)
        }
    }

    /**
     * 
     * @description
     * read the relative path of the current database file to the database
     */
    get relativePath () {
        if (this.currentFilePath) {
            return path.relative(this.pathDB, this.currentFilePath)  
        }   else {
            return path.relative(this.pathDB, this.pathDB)
        }
    }

    /**
     * @param {string} relativePath the relative path of the destination database file to the database
     * 
     * @description
     * set the current database file
     */
    set relativePath (relativePath) {
        try {
            if (fs.existsSync(path.resolve(this.pathDB, relativePath))) {
                this.currentFilePath = path.resolve(this.pathDB, relativePath)
            } else {
                console.error(`SetRelativePathError: the file ${path.resolve(this.pathDB, relativePath)} no exists`)
            }
        }   catch (err) {
            console.log(err)
        }
    }
}

module.exports = JsonDB
