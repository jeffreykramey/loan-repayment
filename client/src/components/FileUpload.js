import React from 'react';
import SummaryTable from './SummaryTable';
import payouts from '../api/payouts';

class FileUpload extends React.Component {
    state = {
        file: null,
        data: null,
        error: null,
    };
    handleChange = (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        this.setState({file: formData});
    };
    handleUpload = async (e) => {
        e.preventDefault();

        try {
            const response = await payouts.getPreview(this.state.file);
            this.setState({data: response});
        } catch (e) {
            this.setState({error: e})
        }
    };
    handleConfirm = async () => {
        try {
            await payouts.submit(this.state.file);
            window.location.reload();
        } catch (e) {
            this.setState({error: e})
        }
    };
    handleCancel = () => {
        this.setState({data: null});
    };

    render() {
        const {data, error, file} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (data) {
            return (
                <div>
                    <SummaryTable data={data}/>
                    <button onClick={this.handleConfirm}>
                        Confirm
                    </button>
                    {" "}
                    <button onClick={this.handleCancel}>
                        Cancel
                    </button>
                </div>
            )
        }

        return (
            <div>
                <form>
                    <input type="file" onChange={this.handleChange}/>
                    {file ? <button type="submit" onClick={this.handleUpload}>
                        Upload
                    </button> : "Please select a file to upload."}
                    {error && <div>{error.message}</div>}
                </form>
            </div>

        )
    };
}

export default FileUpload;
