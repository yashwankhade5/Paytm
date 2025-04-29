import express from "express"
const router = express.Router()
import useRouter from "./user"


router.use('/user',useRouter)

export default router 

