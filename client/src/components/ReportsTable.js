import React, {useState} from 'react';
import reports from "../api/reports";

const BY_BRANCH_REPORT = 'branch';
const BY_SOURCE_REPORT = 'source';
const ALL_PAYMENTS_REPORT = 'all_payments';

const ReportsTable = (props) => {
    const [selectedReport, setSelectedReport] = useState({});
    const payouts = props.data;

    const handleReportDownload = async (id) => {
        switch (selectedReport[id]) {
            case BY_BRANCH_REPORT:
                await reports.getPaymentsByBranchReport(id);
                break;
            case BY_SOURCE_REPORT:
                await reports.getPaymentsBySourceReport(id);
                break;
            default:
                await reports.getPaymentsReport(id);
        }
        setSelectedReport('');
    };

    return (
        payouts.length > 0 && (
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Download</th>
                </tr>
                </thead>
                <tbody>
                {payouts?.map((payout) => (
                    <tr key={payout.id}>
                        <td>{payout.id}</td>
                        <td>{payout.created_at}</td>
                        <td>{payout.status}</td>
                        <td>
                            {payout.status === "complete" ? (
                                <div className="d-flex">
                                    <select
                                        value={selectedReport[payout.id] || ''}
                                        onChange={(e) => setSelectedReport({
                                            ...selectedReport,
                                            [payout.id]: e.target.value
                                        })}
                                        className="form-control mr-2"
                                    >
                                        <option value="">Select option</option>
                                        <option value={BY_BRANCH_REPORT}>By branch</option>
                                        <option value={BY_SOURCE_REPORT}>By source</option>
                                        <option value={ALL_PAYMENTS_REPORT}>All payments</option>
                                    </select>
                                    {selectedReport[payout.id] &&
                                        <button onClick={() => handleReportDownload(payout.id)}
                                                className="btn btn-primary">
                                            Download
                                        </button>}

                                </div>
                            ) : "Reports available once payout is complete"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    );

};

export default ReportsTable;