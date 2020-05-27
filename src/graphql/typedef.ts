import {gql} from 'apollo-server';

export const typeDefs = gql`

    type User {
        id: ID!
        email: String
        name: String
    }
    type Error {
        message: String!
    }
    type LoginToken {
        token: String!
    }

    input LoginCredentials {
        email: String!
        password: String!
    }
    input RegisterCredentials {
        email: String!
        password: String!
        name: String!
    }

    union RegistrationResult = User | Error
    union AuthenticationResult = LoginToken | Error
    union EventResult = Event | Error
    type Event {
        name: String!
        startDate: String!
        endDate: String!
        description: String
    }
    input EventInput {
        name: String!
        startDate: String!
        endDate: String!
        description: String
    }
    type Query {
        listEvents: [Event]!
    }
    type Mutation {
        login(loginCredentials: LoginCredentials): AuthenticationResult
        register(registerCredentials: RegisterCredentials): RegistrationResult
        createEvent(eventInput: EventInput): EventResult
    }
`