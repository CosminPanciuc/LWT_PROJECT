import { ApolloServer } from 'apollo-server';
import typeDefs from './schema.js';
import { getUserFromToken } from './auth.js';
import { resolvers } from './index.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  },
  formatError: (err) => {
    console.error(err);
    return {
      message: err.message,
      code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
    };
  },
});

const PORT = process.env.PORT || 4000;

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});