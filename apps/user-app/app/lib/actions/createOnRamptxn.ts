"use server";   // create at top of every action else it will call the prisma.client from Button itself but we want it to run on server
// Button Click ->Server -> DB 
import prisma from "@repo/db/client";
import { authOptions } from "../auth";
import { getServerSession } from "next-auth";


export async function createOnRamptxn(amount: number, provider: string){
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const token = Math.random().toString() // SHould come from Bank ideally
    if(!userId){
        return {
            message: "User not logged in",
        }
    }

    await prisma.OnRampTransaction.create({
        data: {
            userId: Number(userId), 
            amount: amount,
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token

        }
    })

    return {
        message: 'On Ramp Transaction Added',
    }
}

// USed  in AddMoneyCard.tsx