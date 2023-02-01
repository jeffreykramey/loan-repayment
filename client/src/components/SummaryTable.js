import React from "react";

const SummaryTable = (props) => {
    const data = props.data;

    return (
        <table className="table table-bordered">
            <thead>
            <tr>
                <th>ID</th>
                <th>Total Payment Amount</th>
                <th>Number of Payments</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(data).map((item, index) => (
                <tr
                    key={item[0]}
                    className={index % 2 === 0 ? "table-secondary" : ""}
                >
                    <td>{item[0]}</td>
                    <td>{item[1].totalPaymentAmount}</td>
                    <td>{item[1].numPayments}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default SummaryTable;