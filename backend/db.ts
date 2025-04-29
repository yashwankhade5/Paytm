import mongoose from "mongoose"
import { Schema } from "zod"


async function connect() {
    await mongoose.connect("mongodb://localhost:27017/?replicaSet=rs")
console.log("connected")
}
connect()


const UserSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    password:{type:String, required:true},

    username:{type:String,required:true, unique:true}
})
const AccountSchema = new mongoose.Schema({
    username:{type:mongoose.Schema.Types.ObjectId,required:true, ref:"User"},
    balance:{type:Number,required:true}
})
export const Account= mongoose.model("Account",AccountSchema)

export const User = mongoose.model("User",UserSchema)