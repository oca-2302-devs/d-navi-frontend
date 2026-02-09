/**
 * GraphQL queries for Map Nodes
 */

export const listNodesQuery = `
  query ListNodes {
    listNodes {
      items {
        PK
        SK
        created_at
        updated_at
        data {
          type
          floor
          position {
            x
            y
          }
          size {
            width
            height
          }
          entry {
            x
            y
          }
        }
      }
    }
  }
`;
