/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($hostNodeID: Int!) {
    createRoom(hostNodeID: $hostNodeID) {
      room {
        roomId
        status
        meetupPoint {
          nodeID
        }
        createdAt
        updatedAt
        expiresAt
      }
      hostToken
    }
  }
`;

export const requestJoin = /* GraphQL */ `
  mutation RequestJoin($roomId: ID!, $guestNodeID: Int!) {
    requestJoin(roomId: $roomId, guestNodeID: $guestNodeID) {
      ok
      status
    }
  }
`;

export const approveJoin = /* GraphQL */ `
  mutation ApproveJoin($roomId: ID!, $hostToken: String!, $hostNodeID: Int!) {
    approveJoin(roomId: $roomId, hostToken: $hostToken, hostNodeID: $hostNodeID) {
      ok
      guestToken
      bedrock
    }
  }
`;

export const rejectJoin = /* GraphQL */ `
  mutation RejectJoin($roomId: ID!, $hostToken: String!) {
    rejectJoin(roomId: $roomId, hostToken: $hostToken) {
      ok
    }
  }
`;

export const addDummyData = /* GraphQL */ `
  mutation AddDummyData {
    addDummyData
  }
`;
