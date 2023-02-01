const payoutController = require('../controllers/PayoutsController')
const reportsController = require('../controllers/ReportsController')
const router = require('express').Router()

router.use('/payouts', payoutController);
router.use('/reports', reportsController);

module.exports = router;