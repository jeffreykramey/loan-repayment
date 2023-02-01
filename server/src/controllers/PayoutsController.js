const {parseString} = require('xml2js');
const payoutService = require('../services/PayoutService');
const express = require('express');
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('file');

router.put('/', upload, async (req, res) => {
    console.log('Summary request received');
    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).send('No file was uploaded.');
    }

    try {
        parseString(req.file.buffer.toString(), (err, result) => {
            if (err) {
                console.error('Unable to parse XML file');
                return res.status(500).send('Error while parsing XML file');
            }

            const summary = payoutService.generateSummary(result.root.row);
            console.log('Summary generated');

            res.status(200).send(summary);
        });
    } catch (e) {
        return res.status(500);
    }
});

router.post('/', upload, async (req, res) => {
    console.log('Payout processing request received');
    parseString(req.file.buffer.toString(), async (err, result) => {
        if (err) {
            console.error('Unable to parse XML file');
            return res.status(500).send('Error while parsing XML file');
        }

        try {
            payoutService.process(result.root.row)
            res.status(202).send('Payments processing!');
        } catch (e) {
            return res.status(500);
        }
    });
});

router.get('/', async (req, res) => {
    payoutService.getAllPayouts().then(payouts => res.status(200).send(payouts));
});

module.exports = router;


