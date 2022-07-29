import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
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
