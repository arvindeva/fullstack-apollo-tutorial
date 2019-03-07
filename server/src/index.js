const { ApolloServer } = require('apollo-server');
const isEmail = require('isEmail');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();

const typeDefs = require('./schema');

const server = new ApolloServer({
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    // If the email isn't formatted vaildly, return null for user
    if (!isEmail.validate(email)) return { user: null };
    // Find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
