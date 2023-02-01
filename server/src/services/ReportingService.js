const paymentService = require('../services/PaymentService');
const json2csv = require('json2csv').Parser;

async function getPaymentsBySourceReport(payoutId) {
    const payments = await paymentService.groupPaymentAmountsByPayor(payoutId);

    const options = {
        fields: [
            {label: "Account ID", value: "corp_id"},
            {label: "Total Payments", value: "sum"}
        ]
    };

    const parser = new json2csv(options);
    return parser.parse(payments);
}

async function getPaymentsByBranchReport(payoutId) {
    const payments = await paymentService.getPaymentsByBranch(payoutId);

    const options = {
        fields: [
            {label: "Branch ID", value: "branch_id"},
            {label: "Total Payments", value: "sum"}
        ]
    };

    const parser = new json2csv(options);
    return parser.parse(payments);
}

async function getPaymentsReport(payoutId) {
    const payments = await paymentService.getUpdatedPayments(payoutId);

    const options = {
        fields: [
            {label: "Payment ID", value: "id"},
            {label: "Payor", value: "payor_id"},
            {label: "Payee", value: "payee_id"},
            {label: "Payment Amount", value: "amount"},
            {label: "Status", value: "status"},
            {label: "Updated At", value: "updated_at"}
        ]
    };

    const parser = new json2csv(options);
    return parser.parse(payments);
}


module.exports = {getPaymentsBySourceReport, getPaymentsByBranchReport, getPaymentsReport}