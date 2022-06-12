const JsonDB = require('../lib')
const path = require('path')
const fs = require('fs')

if (fs.existsSync(path.resolve(__dirname, 'testDB'))) {
    fs.rmSync(path.resolve(__dirname, 'testDB'), { recursive: true })
}

const data = {
    a: 1,
    b: 'jsonDB',
    c: true,
    d: [1, 'jsonDB', false],
    e: {
        f: 2,
        g: 'jsonDBB',
        h: null
    }
}

const db = new JsonDB(path.resolve(__dirname, 'testDB'))

test('create database', () => {
    expect(fs.existsSync(db.pathDB)).toBe(true)
})

test ('verify pathDB', () => {
    expect(db.pathDB).toBe(path.resolve(__dirname, 'testDB'))
})


test('test JsonDB create default', () => {
    db.create('db.json')
    expect(fs.existsSync(path.resolve(db.pathDB, 'db.json'))).toBe(true)
    const fileDataJSON = fs.readFileSync(db.currentFilePath, 'utf-8')
    expect(JSON.parse(fileDataJSON)).toBe("{}")
})

test('verify currentFilePath', () => {
    expect(db.currentFilePath).toBe(path.resolve(db.pathDB, 'db.json'))
})

test('verify relativePath', () => {
    expect(db.relativePath).toBe('db.json')
})

test('test JsonDB create customize json', () => {
    expect(fs.existsSync(path.resolve(db.pathDB, 'dbb.json'))).toBe(false)
    db.create('dbb.json', data)
    expect(fs.existsSync(path.resolve(db.pathDB, 'dbb.json'))).toBe(true)
    const fileDataJSON = fs.readFileSync(db.currentFilePath, 'utf-8')
    expect(fileDataJSON).toBe(JSON.stringify(data))
})

test('verify set relativePath', () => {
    expect(db.relativePath).toBe('dbb.json')
    db.relativePath = 'db.json'
    expect(db.relativePath).toBe('db.json')
    db.relativePath = 'dbb.json'
})

test('test JsonDB delete', () => {
    expect(fs.existsSync(path.resolve(db.pathDB, 'db.json'))).toBe(true)
    db.delete(path.resolve(db.pathDB, 'db.json'))
    expect(fs.existsSync(path.resolve(db.pathDB, 'db.json'))).toBe(false)
})

test('test JsonDB query', () => {
    expect(db.query(['c'], 'dbb.json')).toBe(true)
    expect(db.query(['d', 0], 'dbb.json')).toBe(1)
})

test('test JsonDB queryKeys', () => {
    expect(JSON.stringify(db.queryKeys())).toBe(JSON.stringify(Object.keys(data)))
    expect(JSON.stringify(db.queryKeys(['e']))).toBe(JSON.stringify(Object.keys(data.e)))
})

test('test JsonDB update', () => {
    db.update(true, ['a'])
    expect(db.query(['a'])).toBe(true)

    db.update('JsonDB')
    expect(JSON.stringify(db.query())).toBe(JSON.stringify('JsonDB'))
})
