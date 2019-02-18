const Document = /* GRAPHQL */ `
    type Document {
        _id: ID!
        doc_url: String!
        user: User!
        folder: ID!
        title: String!
        content: String
        createdAt: String!
        updatedAt: String!
    }
    input FindDocumentInput {
        id: ID!
    }
    extend type Query {
        documents: [Document]
    }
`;

module.exports = Document;
