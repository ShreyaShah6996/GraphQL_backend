const Sequelize = require('sequelize');
const { db } = require('../config/database');

const authorSchema = db.define('Author', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

authorSchema.sync({ force: false }).then((res) => {
    console.log("Author Table created");
}).catch((err) => {
    console.log("Error while creating Author table");
})

module.exports = authorSchema;