
import mongoose, { startSession } from "mongoose";
import { Account } from "../db";
export const transferFunds = async (fromAccountId:string, toAccountId:string, amount:Number) => {
    const session = await mongoose.startSession()
    // Decrement the balance of the fromAccount
    try{
     await session.startTransaction()
    
	  await Account.findByIdAndUpdate(fromAccountId, { $inc: { balance: -amount } },{session:session});

    // Increment the balance of the toAccount
    await Account.findByIdAndUpdate(toAccountId, { $inc: { balance: amount } },{session:session});

await session.commitTransaction();
    }catch(e){
await session.abortTransaction()

    }finally{
        await session.endSession()
    }
}

