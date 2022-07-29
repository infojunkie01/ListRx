import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
}
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_RX = gql`
 mutation saveRX($rx: RxInput!) {
  saveRx(rx: $rx) {
    username
    email
    savedRx {
      rxId
      brandName
      dosageForm
      route
    }
    rxCount
    _id
  }
}
`;

export const REMOVE_RX = gql`
  mutation removeRx($rxId: ID!) {
  removeRx(rxId: $rxId) {
    _id
    username
    email
    rxCount
    savedRx {
      rxId
      brandName
      dosageForm
      route
    }
  }
}
`;