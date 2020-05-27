import * as admin from "firebase-admin";
import * as Keys from "../keys";
import {DataSource} from 'apollo-datasource'
import { generateToken } from "..//utils/auth";

admin.initializeApp({
    credential: admin.credential.cert(Keys.serviceAccountKey as admin.ServiceAccount),
    databaseURL: "https://calenderly.firebaseio.com"
});

const DB = {
    USERS: 'USERS',
    EVENTS: 'EVENTS'
}

const DATASOURCE_ERRORS = {
    USER_EXIST: {
        message: 'User already exist',
        code: 0
    },
    USER_NOT_EXIST: {
        message: 'User does not exist',
        code: 1
    },
    USER_PASSWORD_MISMATCH: {
        message: 'Email and password incorrect',
        code: 2
    }
}

export class UserAPI extends DataSource {
    async createUser (userData): Promise<{id: string} | Error> {
        const res = await admin.firestore().collection(DB.USERS).where('email', '==', userData.email).get()
        for (const doc of res.docs) {
            if (doc.data().email === userData.email) {
                return new Error(DATASOURCE_ERRORS.USER_EXIST.message);
            }
        }
        
        const newUser = await admin.firestore().collection(DB.USERS).add(userData);
        return newUser;
    }
    async loginUser (loginData): Promise<{token: string} | Error> {
        const users = await admin.firestore().collection(DB.USERS).where('email', '==', loginData.email).get();
        if (users.empty) {
            return Error(DATASOURCE_ERRORS.USER_PASSWORD_MISMATCH.message);
        }
        for (const user of users.docs) {
            if (!user.data().password === loginData.password) {
                return Error(DATASOURCE_ERRORS.USER_PASSWORD_MISMATCH.message);
            }
            const token = await generateToken({userId: user.id});
            return {token};
        }
    }
    async getUser(userData): Promise<{user: any} | Error> {
        const users = await admin.firestore().collection(DB.USERS).listDocuments();
        for (const user of users) {
            if (user.id === userData.id && (await user.get()).exists) {
                return {user: (await user.get()).data()}
            }
        }
        return Error(DATASOURCE_ERRORS.USER_NOT_EXIST.message);
    }
}

export class EventAPI extends DataSource {
    async createEvent (eventData, userId: string): Promise<{event: any} | Error> {
        const event = {...eventData, userId};
        const newUser = await (await admin.firestore().collection(DB.EVENTS).add(event)).get();
        
        return {event: {id: newUser.id, ...eventData}};
    }
    async listEvents (userId: string): Promise<{events: any[] | Error}> {
        const eventsRef = await admin.firestore().collection(DB.EVENTS).where('userId', '==', userId).get();
        const events = [];
        for (const event of eventsRef.docs) {
            events.push(await event.data());
        }
        return {events};
    }
}
