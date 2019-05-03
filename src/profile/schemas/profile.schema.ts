import * as mongoose from 'mongoose';

export const ProfileSchema = new mongoose.Schema({
    _id: String,
    first: String,
    last: String,
    email: String,
    phone: String,
    addressOne: String,
    addressTwo: String,
});
