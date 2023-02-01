const {prisma, method, throttle} = require('../../config')

async function createPayment(payorId, payeeId, payoutId, paymentAmount) {
    try {
        let methodPayment;
        await throttle(async () => {
            methodPayment = await method.payments.create({
                source: payorId,
                destination: payeeId,
                amount: paymentAmount,
                description: 'DD pmnt'
            });
        });

        return await prisma.payment.create({
            data: {
                id: methodPayment.id,
                payor_id: payorId,
                payee_id: payeeId,
                payout_id: payoutId,
                amount: paymentAmount,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error(`Failed to process payment ${payorId} to ${payeeId} - ${error}`);
    }
}

async function groupPaymentAmountsByPayor(payoutId) {
    return await prisma.$queryRaw`SELECT "Corporation".corp_id, SUM(amount) FROM "Payment" 
        JOIN ("PayorAccount" JOIN "Corporation" ON "PayorAccount".holder_id = "Corporation".id)
        ON "Payment".payor_id = "PayorAccount".id WHERE payout_id = ${payoutId} GROUP BY "Corporation".corp_id`;
}

async function getPaymentsByBranch(payoutId) {
    return await prisma.$queryRaw`SELECT "Individual".branch_id, SUM(amount) FROM "Payment" 
        JOIN ("PayeeAccount" JOIN "Individual" ON "PayeeAccount".holder_id = "Individual".id)
        ON "Payment".payee_id = "PayeeAccount".id WHERE payout_id = ${payoutId} GROUP BY "Individual".branch_id`;
}

async function getAllPaymentsByPayoutId(payoutId) {
    return await prisma.payment.findMany({
        where: {
            payout_id: payoutId
        }
    });
}

async function getUpdatedPayments(payoutId) {
    const payments = await getAllPaymentsByPayoutId(payoutId);

    for (let payment of payments) {
        try {
            let methodPayment;
            await throttle(async () => {
                methodPayment = await method.payments.get(payment.id);
            });
            if (methodPayment.status !== payment.status) {
                await prisma.payment.update({
                    where: {
                        id: payment.id
                    },
                    data: {
                        status: methodPayment.status
                    }
                });
            }
        } catch (error) {
            console.error(`Unable to update payment ${payment.id}`);
        }
    }
    return getAllPaymentsByPayoutId(payoutId);
}


module.exports = {createPayment, groupPaymentAmountsByPayor, getPaymentsByBranch, getUpdatedPayments}