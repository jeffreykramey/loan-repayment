const express = require('express');
const reportingService = require('../services/ReportingService');

const router = express.Router();

router.get('/:id/payments-by-source', async (req, res) => {
    console.log('Request for payments by source account report');

    reportingService.getPaymentsBySourceReport(parseInt(req.params.id))
        .then(report => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="payments_by_source_report.csv"');
            res.status(200).send(report);
        });
});

router.get(`/:id/payments-by-branch`, async (req, res) => {
    console.log('Request for payments by branch report');

    reportingService.getPaymentsByBranchReport(parseInt(req.params.id))
        .then(report => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="payments_by_branch_report.csv"');
            res.status(200).send(report);
        });
});

router.get('/:id/payments', async (req, res) => {
    console.log('Request for payments report');

    reportingService.getPaymentsReport(parseInt(req.params.id))
        .then(report => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="payments_report.csv"');
            res.status(200).send(report);
        });
});

module.exports = router;