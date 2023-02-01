const {prisma, method, throttle} = require('../../config')

async function getMerchant(plaidId) {
    return await prisma.merchant.findFirst({
        where: {
            plaid_id: plaidId,
        }
    })
}

async function createMerchant(merchantId, plaidId) {
    return await prisma.merchant.create({
        data: {
            id: merchantId,
            plaid_id: plaidId,
        }
    })
}

async function fetchMerchant(plaidId) {
    let merchant = await getMerchant(plaidId);
    if (!merchant) {
        let methodMerchant;
        await throttle(async () => {
            methodMerchant = await method.merchants.list({
                "provider_id.plaid": plaidId
            });
        })

        merchant = await createMerchant(methodMerchant[0].mch_id, plaidId);
    }

    return merchant;
}

module.exports = {fetchMerchant}