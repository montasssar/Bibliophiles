const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (err) => {
      console.error('❌ GraphQL Error:', err.message);
      return err;
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
