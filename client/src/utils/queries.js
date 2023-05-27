import { gql } from "@apollo/client";

export const QUERY_ME = gql`
query getme{
user {
    _id
    username
    email
    bookCount
    savedBooks {
        bookId
        authors
        description
        image
        link
        title
    }
    }
}
`;
