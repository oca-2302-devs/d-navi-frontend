/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onJoinRequested = /* GraphQL */ `
  subscription OnJoinRequested($roomId: ID!) {
    onJoinRequested(roomId: $roomId) {
      ok
      status
    }
  }
`;

export const onJoinApproved = /* GraphQL */ `
  subscription OnJoinApproved($roomId: ID!) {
    onJoinApproved(roomId: $roomId)
  }
`;

export const onJoinRejected = /* GraphQL */ `
  subscription OnJoinRejected($roomId: ID!) {
    onJoinRejected(roomId: $roomId)
  }
`;
