const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');
const { db } = require('./config/database');

const app = express();

//allow cross-origin request
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

db.authenticate().then(() => {
    console.log("Database connected");
}).catch(err => {
    console.log(err);
})

app.listen(4000, () => {
    console.log("Server connected to 3000");
})