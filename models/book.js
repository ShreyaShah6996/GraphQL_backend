const Sequelize = require('sequelize');
const { db } = require('../config/database');

const bookSchema = db.define('Book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    authorId: {
        type: Sequelize.STRING,
        allowNull: false
    },

});

bookSchema.sync({ force: false }).then((res) => {
    console.log("bookSchema Table created");
}).catch((err) => {
    console.log("Error while creating bookSchema table");
})

module.exports = bookSchema;