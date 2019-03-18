const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

//Dummy Data
/*
var books = [
    { name: "I too had a love story", genre: "Love story", id: "1", authorId: "1" },
    { name: "Can love happen twice??", genre: "Love story", id: "2", authorId: "2" }
];

var authors = [
    { name: "Rabindra Singh", age: "30", id: "1" },
    { name: "Chetan Bhagat", age: "40", id: "2" },
];*/

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //one book can have 1 author
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //return _.find(authors, { id: parent.authorId });
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        // 1 author can have many books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _.filter(books, { authorId: parent.id });
                return Book.findAll({ where: { authorId: parent.id } });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db                
                //return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.findAll({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors
                return Author.findAll({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Book.destroy({ where: { id: args.id } });
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                let b = Book.destroy({ where: { authorId: args.id } });
                let a = Author.destroy({ where: { id: args.id } });
                return a, b;
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                }
                Book.update(book, { where: { id: args.id } });
                return book;
            }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                let author = {
                    name: args.name,
                    age: args.age
                };
                Author.update(author, { where: { id: args.id } });
                return author;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});