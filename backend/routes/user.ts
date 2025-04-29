import  express from "express";
import { User } from "../db";
import jwt from "jsonwebtoken";
const router = express.Router()
import { z } from "zod";
import { JWT_SECERET } from "../config";
import updateRouter from "./update";

const zodSchema =  z.object({
    username:z.string().email(),
    firstName:z.string().min(2).max(50),
    lastName:z.string().min(2).max(50),
    password:z.string().min(2).max(20)
    
})
router.post('/signup',async (req,res)=>{
    
    const body=req.body
    const info = zodSchema.safeParse(body)
    if (!info.success) {
        res.json({message: "Email already taken / Incorrect inputs" })
                return
    } else if(info.success){
        try{
            const existinguser = await User.findOne({
                username:info.data.username
            })
            if (existinguser) {
                res.json({message: "Email already taken / Incorrect inputs" })
                return
            }

        const usercreated  = await  User.create({
            firstName:info.data.firstName,
            lastName:info.data.lastName,
            password:info.data.password,
            username:info.data.username
        })
       
        const userid=usercreated._id
        const token =jwt.sign({userid},JWT_SECERET)
        
        res.json({
                message: "User created successfully",
                token: token
         }) 
            return
        }catch(e){
            res.json({
                message: "something went wrong try again"+e
            })
            return
        }
        
    }
   

})

const signinbody = z.object({
    username: z.string().email(),
	password: z.string()
})

router.post('/signin',async (req,res)=>{
    const reqbody = signinbody.safeParse(req.body)
    if(!reqbody.success){
        res.json({
            "message":"incorrect input"
        })
        return
    }
    const userExist = await User.findOne({
        username:reqbody.data.username,
        password:reqbody.data.password
    }
    )
    const userid = userExist?._id
    const token = jwt.sign({userid},JWT_SECERET)
    if (userExist) {

        res.json({
            token: token
        })
    }else{
        res.json({
            "message":"user not found"
        })
    }


})

router.use('/',updateRouter)


export default  router