import validator from '../utils/validation';
import { hashPassword } from '../utils/auth';

export const resolvers = {
    AuthenticationResult: {
        __resolveType(obj, context, info) {
            if (obj.token) {
                return 'LoginToken';
            }
            return 'Error'
        }
    },
    RegistrationResult: {
        __resolveType(obj, context, info) {
            if (obj.id) {
                return 'User';
            }
            return 'Error';
        }
    },
    EventResult: {
        __resolveType(obj, context, info) {
            if (obj.message) {
                return 'Error'
            }
            return 'Event'
        }
    },
    Query: {
        listEvents: async (parent, {}, {dataSources: {UserAPI,EventAPI}, userId}, info) => {
            try {
                if (!userId)    throw new Error('You must be logged in!');
                const {events} = await EventAPI.listEvents(userId);
                
                return events;
            } catch (e) {
                return {message: e.message};
            }
        }
    },
    Mutation: {
        register: async (parent, {registerCredentials}, {dataSources: {UserAPI}}, info) => {
            try {
                const {email, password, name} = registerCredentials;
                if (!validator.isEmail(email)) {
                    throw new Error('Invalid Email');
                }
                if (!validator.isMinLength(password, 8)) {
                    throw new Error('Password must be greater than length of 8 characters');
                }
                const newUser = await UserAPI.createUser({email, password, name});
                
                return newUser;
            
            } catch (e) {
                return {message: e.message};
            }
        },
        login: async (parent, {loginCredentials}, {dataSources: {UserAPI}}, info) => {
            try {
                const {password} = loginCredentials;
                
                const hashedPassword = await hashPassword(password);
                const {token} = await UserAPI.loginUser({...loginCredentials, password: hashedPassword});
                return {token}
            } catch (e) {
                return {message: e.message};
            }
        },
        createEvent: async (parent, {eventInput}, {dataSources: {EventAPI}, userId}, info) => {
            try {
                if (!userId) throw new Error('You must be logged in!');
                
                const startDate = Date.parse(eventInput.startDate);
                const endDate = Date.parse(eventInput.endDate);
                
                if (!startDate || !endDate) throw new Error('Invalid Event date format');
                if (startDate > endDate)    throw new Error ('Invalid Event date range');

                const {event} = await EventAPI.createEvent({name: eventInput.name, startDate, endDate}, userId);
                return event;
            } catch (e) {
                return {message: e.message}
            }
        }
    }
}