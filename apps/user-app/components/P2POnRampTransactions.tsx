import { Card } from "@repo/ui/card"


export const P2POnRampTransactions = ({p2p_transactions}: {
    p2p_transactions: {
        time: Date,
        amount: number,
        FromUserID: number,
        FromUserName: String,
        ToUserID: number,
        ToUserName: String
    }[]
}) => {
     if (!p2p_transactions.length) {
        return <Card title="Recent P2P Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent P2P transactions
            </div>
        </Card>
    }
    return <Card title="Recent P2P Transactions">
        <div className="pt-2">
            {p2p_transactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        SENT INR  FROM {t.FromUserName} TO {t.ToUserName}
                    </div>
                    <div className="text-xs text-pink-500">
                        Sender ID: {t.FromUserID} Receiver ID: {t.ToUserID} 
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}