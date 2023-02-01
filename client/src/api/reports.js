import axios from "axios";

async function getPaymentsBySourceReport(payoutId) {
    const response = await axios.get(`http://localhost:5000/reports/${payoutId}/payments-by-source`, {
        responseType: 'blob'
    });
    initiateFileDownload(response.data, 'payments_by_source_report.csv');
}

async function getPaymentsByBranchReport(payoutId) {
    const response = await axios.get(`http://localhost:5000/reports/${payoutId}/payments-by-branch`, {
        responseType: 'blob'
    });
    initiateFileDownload(response.data, 'payments_by_branch_report.csv');
}

async function getPaymentsReport(payoutId) {
    const response = await axios.get(`http://localhost:5000/reports/${payoutId}/payments`, {
        responseType: 'blob'
    });
    initiateFileDownload(response.data, 'all_payments_report.csv');
}

function initiateFileDownload(file, name){
    const blob = new Blob([file], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
}

export default {getPaymentsBySourceReport, getPaymentsByBranchReport, getPaymentsReport};