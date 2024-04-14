"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) {
        return {
            message: "Error while sending"
        }
    }

    const sendUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!sendUser) {
        return {
            message: "User to send money not found"
        }
    }
    await prisma.$transaction(async (tx) => {
        // Putting lock using FOr update 
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(userId)} FOR UPDATE`;


        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(userId) },
          });

        //   console.log("Before Sleep")
        //   await new Promise(resolve => setTimeout(resolve,4000));
        //   console.log("After Sleep")
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
            // return { message: " You dont have enough balance"}
          }

          await tx.balance.update({
            where: { userId: Number(userId) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
            where: { userId: sendUser.id },
            data: { amount: { increment: amount } },
          });

          await tx.p2pTransfer.create({
            data: {
                amount,
                timestamp: new Date(),
                fromUserId: Number(userId), 
                toUserId: sendUser.id
               
            }
          })
    });
}