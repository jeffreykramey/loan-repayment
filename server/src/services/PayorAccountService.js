const {prisma, method, throttle} = require('../../config');
const corporationService = require('./CorporationService');

async function getPayorAccount(holderId, routingNumber, accountNumber) {
    return await prisma.payorAccount.findFirst({
        where: {
            holder_id: holderId,
            routing_number: routingNumber,
            account_number: accountNumber
        }
    });
}

async function createPayorAccount(methodEntityId, holderId, routingNumber, accountNumber) {
    return await prisma.payorAccount.create({
        data: {
            id: methodEntityId,
            holder_id: holderId,
            routing_number: routingNumber,
            account_number: accountNumber
        }
    });
}

async function fetchPayorAccount(payor) {
    const corpEntity = await corporationService.fetchCorpEntity(payor);
    const routingNumber = payor.ABARouting[0];
    const accountNumber = payor.AccountNumber[0];

    let payorAccount = await getPayorAccount(corpEntity.id, routingNumber, accountNumber);
    if (!payorAccount) {
        let methodPayorAccount;
        await throttle(async () => {
            methodPayorAccount = await method.accounts.create({
                holder_id: corpEntity.id,
                ach: {
                    routing: routingNumber,
                    number: accountNumber,
                    type: 'checking',
                },
            });
        });

        payorAccount = createPayorAccount(methodPayorAccount.id, corpEntity.id, routingNumber, accountNumber);
    }

    return payorAccount;
}

module.exports = {fetchPayorAccount}