import { SendCard } from "../../../components/SendCard"
import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2POnRampTransactions } from "../../../components/P2POnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getp2pTransfer() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        },
        include: {
            fromUser: true,
            toUser: true
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        FromUserID: t.fromUser.id,
        FromUserName: t.fromUser.name,
        ToUserID: t.toUser.id,
        ToUserName: t.toUser.name
    }))
}

export default async function p2p() {
    const balance = await getBalance();
    const p2p_transactions = await getp2pTransfer();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard/>
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <P2POnRampTransactions p2p_transactions={p2p_transactions} />
                </div>
            </div>
        </div>
    </div>
}