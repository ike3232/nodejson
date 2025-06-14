const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const path = require("path");  // Added for serving HTML
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} = graphql;
const { graphqlHTTP } = require("express-graphql");

// --- GraphQL Schema Setup ---
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }  // 🛠️ Consider removing for production
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        return userData;
      }
    },
    findUserById: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData.find(u => u.id === args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const newId = userData.length
          ? Math.max(...userData.map(u => u.id)) + 1
          : 1;
        const newUser = { id: newId, ...args };
        userData.push(newUser);
        return newUser;
      }
    }
  }
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

// --- Middleware Routes ---
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.get("/rest/getAllUsers", (req, res) => {
  res.json(userData);
});

// Serve a landing page on `/`
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the API</h1>
    <p>Try <a href="/graphql">/graphql</a> (GraphiQL) or <a href="/rest/getAllUsers">/rest/getAllUsers</a>.</p>
  `);
});

// Catch-all for unmatched routes
app.get("*", (req, res) => {
  res.status(404).send("PAGE NOT FOUND");  // default route for 404s :contentReference[oaicite:1]{index=1}
});

// --- Start Server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
