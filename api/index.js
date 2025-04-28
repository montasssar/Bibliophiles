// 📦 Import Dependencies
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
require('dotenv').config();

// 📚 Import GraphQL Schema and Resolvers
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// 🔧 Config
const PORT = process.env.PORT || 5000;

// 🛠️ Setup Apollo Server
const createApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (error) => {
      console.error('❌ GraphQL Error:', error.message);
      return error;
    },
  });
  await server.start();
  return server;
};

// 🚀 Start Express Server
const startServer = async () => {
  const app = express();
  const apolloServer = await createApolloServer();

  // 🌍 Apply Middlewares
  app.use(cors());
  app.use(express.json());

  // 🐞 Debugging Middleware
  app.use((req, res, next) => {
    console.log(`📬 [${req.method}] ${req.url}`);
    console.log('🧾 Headers:', req.headers);
    if (Object.keys(req.body || {}).length) console.log('📦 Body:', req.body);
    next();
  });

  // 🔗 Mount Apollo Server at /graphql
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        token: req.headers.authorization || null,
      }),
    })
  );

  // 🛡️ Global Error Handler Middleware (must be last before listen)
  app.use((err, req, res, next) => {
    console.error('❌ Global Server Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  // 🎯 Start Listening
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`✅ Running index.js from: ${__filename}`);
  });
};

startServer();
