/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMapData = /* GraphQL */ `
  query GetMapData($pk: String!) {
    getMapData(pk: $pk) {
      PK
      SK
      data
    }
  }
`;

export const getMapNodes = /* GraphQL */ `
  query GetMapNodes($pk: String!, $skPrefix: String!) {
    getMapNodes(pk: $pk, skPrefix: $skPrefix) {
      PK
      SK
      data
    }
  }
`;

export const getRoom = /* GraphQL */ `
  query GetRoom($roomId: ID!) {
    getRoom(roomId: $roomId) {
      roomId
      status
      meetupPoint {
        nodeID
      }
      createdAt
      updatedAt
      expiresAt
    }
  }
`;

export const getRequest = /* GraphQL */ `
  query GetRequest($roomId: ID!) {
    getRequest(roomId: $roomId)
  }
`;

export const listMaps = /* GraphQL */ `
  query ListMaps {
    listMaps {
      items {
        PK
        SK
        data
      }
    }
  }
`;
