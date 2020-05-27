import validator from 'validator';

export default {
    isEmail: validator.isEmail,
    isMinLength: (str: string, minLen: number) => validator.isLength(str, {min: minLen}),
}