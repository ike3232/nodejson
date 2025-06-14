# Nodejs app with REST and GraphQL example

An example of GraphQL queries/mutations with Node and Express.js.

With GraphQL, clients can specify exactly what data they need, and the server responds with only that data, reducing the amount of data transferred over the network. go to

### REST API Endpoint:
- Get all users: `http://localhost:5000/rest/getAllUsers`

### GraphQL Endpoint:
- `http://localhost:5000/graphql`

### Example Queries:

#### 1. Get All Users
```graphql
query {
  getAllUsers {
    id
    email
  }
}

# test
