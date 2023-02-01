const {prisma, method, throttle} = require('../../config')
const format = require('./FormattingService')

async function getIndividual(dunkinId) {
    return await prisma.individual.findUnique({
        where: {
            employee_id: dunkinId,
        }
    })
}

async function createIndividual(methodEntityId, dunkinId, branchId) {
    return await prisma.individual.create({
        data: {
            id: methodEntityId,
            employee_id: dunkinId,
            branch_id: branchId
        }
    })
}

async function fetchIndividualEntity(employee) {
    const employeeId = employee.DunkinId[0];
    let individualEntity = await getIndividual(employeeId);
    if (!individualEntity) {
        let methodEntity;
        await throttle(async () => {
            methodEntity = await method.entities.create({
                type: 'individual',
                individual: {
                    first_name: employee.FirstName[0],
                    last_name: employee.LastName[0],
                    phone: '15121231111', //hard-coded per instructions
                    dob: format.date(employee.DOB[0])
                }
            });
        });

        individualEntity = await createIndividual(methodEntity.id, employeeId, employee.DunkinBranch[0]);
    }

    return individualEntity;
}

module.exports = {fetchIndividualEntity}