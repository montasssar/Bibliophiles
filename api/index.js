const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();

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

  // ✅ Essential Middlewares
  app.use(cors());
  app.use(express.json()); // ⬅️ Needed to populate req.body

  // ✅ Debug Middleware
  app.use((req, res, next) => {
    console.log('📬 Request Received:');
    console.log('➡️ Method:', req.method);
    console.log('➡️ URL:', req.url);
    console.log('➡️ Headers:', req.headers);
    console.log('➡️ Body:', req.body);
    next();
  });

  // ✅ Apollo Middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    })
  );

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
