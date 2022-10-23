import { gql } from "@apollo/client";

export const GET_PARTY = gql`
  query GetParty($partyName: String, $adminCode: String) {
    party(name: $partyName, adminCode: $adminCode) {
      name
      creator
      settings {
        dates {
          votingEnabled
          optionsEnabled
        }
        locations {
          votingEnabled
          optionsEnabled
        }
      }
      dates {
        id
        date
        votes {
          id
          username
        }
      }
      locations {
        id
        location
        votes {
          id
          username
        }
      }
      supplies {
        id
        name
        quantity
        assignee
        isUrgent
        emoji
      }
    }
  }
`;
