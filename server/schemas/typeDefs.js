const { gql } = require('apollo-server-express');

const typeDefs = gql`

type User {
    _id: ID
    username: String!
    email: String!
    rxCount: Int
    savedRx: [Rx]
}

type Rx {
    rxId: ID!
    genericName: [String]
    brandName: String
    manufacturer: String
}

input RxInput {
    productId: String!
    genericName: [String]
    brandName: String
    manufacturer: String
}

type Auth {
    token: ID!
    user: User
}
type Query {
    me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveRx(rx: RxInput!): User
    removeRx(productId: ID!): User
}
`;

module.exports = typeDefs;