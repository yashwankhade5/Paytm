import express, { NextFunction } from "express";
import  {authMiddleware}  from "./middleware"
import { User } from "../db";
import zod from "zod";




const router = express.Router()
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/',authMiddleware,async (req,res)=>{
    const body  = req.body
    const pass = updateBody.safeParse(body)
    if (!(pass.success)) {
        res.json({
            message: "Error while updating information"
        })
        return
    }
    
    const userid = req.userId
    
const updateinfo = await User.findOneAndUpdate({_id:userid},body,{new:true})
console.log(updateinfo)
if (updateinfo) {
    res.status(200).json({
        message: "Updated successfully"
    })
    return
}

res.status(411).json({
	message: "Error while updating information"
})
return
})

router.get('/bulk',authMiddleware,async (req,res)=>{

    const query = req.query.filter
    console.log(query)
    const finduser = await User.find({$or:[{firstName:query},{lastName:query}]}) 

    if (finduser) {
            
        res.status(200).json({
            users: finduser.map(user=>({
                "username": user.username,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "_id": user._id
            }))
        } )
        
    }
}
)
export default router