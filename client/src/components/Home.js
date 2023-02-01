import React from 'react';
import payouts from '../api/payouts';
import ReportsTable from "./ReportsTable";
import FileUpload from "./FileUpload";

class Home extends React.Component {
    state = {
        payoutList: null,
        error: null
    };

    async componentDidMount() {
        payouts.list()
            .then(list => this.setState({payoutList: list}))
            .catch(e => this.setState({error: e}));
    }

    render() {
        const {payoutList, error} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        return (
            <div className="d-flex flex-column align-items-center text-center">
                <h1 className="mt-3">Upload Payout XML File</h1>
                <FileUpload/>
                {payoutList && (
                    <div className="mt-3">
                        <ReportsTable data={payoutList}/>
                    </div>
                )}
            </div>
        )
    }
}

export default Home;