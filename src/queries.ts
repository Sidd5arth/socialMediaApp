// HOME PAGE //

export const getUser = `
{
  usersCollection {
    edges {
      node {
        user_id
        username
      }
    }
  }
}
`;
export const getPost = `
{
postsCollection(orderBy: [{ created_at: DescNullsFirst }]) {
  edges {
    node {
      user_id
      post_id
      created_at
      content
      image_url
    }
  }
}
}
`;
export const createPost = `
mutation InsertPost($userId: UUID!, $content: String!, $imageUrl: String!) {
  insertIntopostsCollection(objects: [{ user_id: $userId, content: $content, image_url: $imageUrl }]) {
    affectedCount
    records {
      post_id
      user_id
      content
      image_url
      created_at
    }
  }
}
`;