const { ApolloServer } = require('apollo-server');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();

const typeDefs = require('./schema');

const server = new ApolloServer({ 
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
