const {prisma, method, throttle} = require('../../config');
const individualService = require('./IndividualService');
const merchantService = require('./MerchantService');

async function getPayeeAccount(holderId, merchantId, loanAccountNumber) {
    return await prisma.payeeAccount.findFirst({
        where: {
            holder_id: holderId,
            merchant_id: merchantId,
            loan_account_number: loanAccountNumber
        }
    })
}

async function createPayeeAccount(methodEntityId, holderId, merchantId, loanAccountNumber) {
    return await prisma.payeeAccount.create({
        data: {
            id: methodEntityId,
            holder_id: holderId,
            merchant_id: merchantId,
            loan_account_number: loanAccountNumber
        }
    })
}

async function fetchPayeeAccount(employee, payee) {
    const individualEntity = await individualService.fetchIndividualEntity(employee);
    const merchant = await merchantService.fetchMerchant(payee.PlaidId[0]);

    const loanAccountNumber = payee.LoanAccountNumber[0];
    let account = await getPayeeAccount(individualEntity.id, merchant.id, loanAccountNumber);

    if (!account) {
        let methodPayeeAccount
        await throttle(async () => {
            methodPayeeAccount = await method.accounts.create({
                holder_id: individualEntity.id,
                liability: {
                    mch_id: merchant.id,
                    account_number: loanAccountNumber
                }
            });
        });
        account = await createPayeeAccount(methodPayeeAccount.id, individualEntity.id, merchant.id, loanAccountNumber);
    }

    return account;
}

module.exports = {fetchPayeeAccount}