import { ApolloServer } from "apollo-server";
import {resolvers} from "./graphql/resolver";
import {typeDefs} from "./graphql/typedef";
import {UserAPI, EventAPI} from './services/dataSources';

import {getUser} from "./utils/auth";

const server = new ApolloServer({
    dataSources: () => {
        return { 
            UserAPI: new UserAPI(),
            EventAPI: new EventAPI()
        };
    },
    context: ({req}) => {
        const token = req.headers.authorization || '';

        // try to retrieve a user with the token
        const user = getUser(token);
        
        // add the user to the context
        return user;
    },
    resolvers,
    typeDefs
});

server.listen({ port: 4000 }).then(({ url }) => {
    // tslint:disable-next-line:no-console
    console.log(`🚀  Server ready at ${url}`);
});