import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Secret} from '../keys';

export const getUser = token => {
	if (!token || token === "") {
		return {
			isAuth: false,
			decodedToken: false
		};
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, Secret);
	} catch (err) {
		return {
			isAuth: false,
			decodedToken: false
		};
	}
	if (!decodedToken) {
		return {
			isAuth: false,
			decodedToken: false
		};
	}
	return {
		isAuth: true,
		userId: decodedToken.userId
	};
};

export const hashPassword = async (pass: string) => {
	return await bcrypt.hash(pass, 12);
}
export const generateToken = async (payload: any): Promise<string> => {
	return await jwt.sign({ ...payload }, Secret, {
		expiresIn: "24h"
	});
}