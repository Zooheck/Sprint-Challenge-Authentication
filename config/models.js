const db = require('../database/dbConfig')

module.exports = {
    find, 
    findBy,
    findById,
    add
}

function find() {
    return db('users').select('id', 'username', 'password');
}

function findBy(parameter) {
    return db('users').where(parameter).first();
}

function findById(id) {
    return db('users')
        .where({ id })
        .first()
}

async function add(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
}