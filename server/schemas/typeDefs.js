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
    brandName: String
    dosageForm: String
    route: String
}

input RxInput {
    rxId: String!
    brandName: String
    dosageForm: String
    route: String
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
    removeRx(rxId: ID!): User
}
`;

module.exports = typeDefs;