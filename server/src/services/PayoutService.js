const {prisma} = require('../../config')
const format = require('./FormattingService');
const payorService = require('./PayorAccountService');
const payeeService = require('./PayeeAccountService');
const {createPayment} = require("./PaymentService");

async function getAllPayouts() {
    return await prisma.payout.findMany();
}

async function createPayout() {
    return await prisma.payout.create({
        data: {
            status: 'pending',
        }
    })
}

async function updatePayoutStatus(id, status, totalAmount) {
    const payout = await prisma.payout.findUnique(
        {
            where: {
                id: id
            }
        }
    );
    if (!payout) {
        throw new Error(`Payout with ID ${id} not found`);
    }

    const update = {
        status: status || payout.status.status,
        total_amount: totalAmount || payout.total_amount
    }

    return await prisma.payout.update({
        where: {
            id
        },
        data: update
    });
}

function generateSummary(data) {
    let summary = {}
    for (let row of data) {
        const dunkinId = row.Payor[0].DunkinId[0]
        const paymentAmount = format.parseDollarStr(row.Amount[0]);
        if (!summary.hasOwnProperty(dunkinId)) {
            summary[dunkinId] = {'totalPaymentAmount': paymentAmount, 'numPayments': 1}
        } else {
            summary[dunkinId].totalPaymentAmount += paymentAmount;
            summary[dunkinId].numPayments++;
        }
    }

    //convert back to string representation
    for (let value of Object.values(summary)) {
        value.totalPaymentAmount = format.toDollarStr(value.totalPaymentAmount);
    }
    return summary;
}

async function process(paymentsJson) {
    const payout = await createPayout();
    console.log(`Preparing payments for payout ${payout.id}`);
    const payments = await consolidate(paymentsJson);
    console.log(`Processing payments for payout ${payout.id}`);
    await submit(payments, payout.id).then(_ => console.log(`Payout ${payout.id} submitted`));
}

async function consolidate(data) {
    let payments = {};
    let currRow = 1;
    let numRows = Object.keys(data).length;
    for (let row of Object.values(data)) {
        console.debug(`Preparing payment: ${currRow} of ${numRows}`);
        currRow++;

        try {
            const payor = row.Payor[0];
            const employee = row.Employee[0];
            const payee = row.Payee[0];
            const amount = format.parseDollarStr(row.Amount[0]);

            const sourceAccount = await payorService.fetchPayorAccount(payor);
            const destinationAccount = await payeeService.fetchPayeeAccount(employee, payee);
            const key = JSON.stringify({source: sourceAccount.id, destination: destinationAccount.id});
            if (!payments.hasOwnProperty(key)) {
                payments[key] = amount;
            } else {
                payments[key] += amount;
            }
        } catch (e) {
            // for now just catch an error and continue
            console.error(`error preparing payment - ${e}`)
        }
    }

    return payments;
}

async function submit(payments, payoutId) {
    await updatePayoutStatus(payoutId, 'processing', null);
    let totalPaymentAmount = 0;
    let numPayments = Object.keys(payments).length;
    let currPayment = 1;
    for (let payment in payments) {
        console.debug(`Submitting ${currPayment} of ${numPayments} payments.`)
        currPayment++;

        const paymentAmount = payments[payment];
        const paymentObject = JSON.parse(payment);
        await createPayment(paymentObject.source, paymentObject.destination, payoutId, paymentAmount)
        totalPaymentAmount += paymentAmount;
    }
    await updatePayoutStatus(payoutId, 'complete', totalPaymentAmount);
}

module.exports = {getAllPayouts, generateSummary, process}