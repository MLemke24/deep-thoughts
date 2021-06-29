const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const{ typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in schemas
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

// integrate Apollo server with Express app as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({extended: false}));
app.use(express.json());

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`);
        // route to test GQL API's
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
});

// With the new ApolloServer() function, we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests. There are more parameters we could pass in, but these are the two we really need to get started.

//We then connect our Apollo server to our Express.js server. This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API. That's not all—the /graphql endpoint also has a built-in testing tool we can use. Let's check it out!