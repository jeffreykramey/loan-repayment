import axios from "axios";

async function getPreview(file) {
    const response = await axios.put('http://localhost:5000/payouts', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    console.log('Payout preview generated successfully');
    return response.data;
}

async function submit(file) {
    const response = await axios.post('http://localhost:5000/payouts', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    console.log('File uploaded successfully');
    return response.data;
}

async function list() {
    const response = await axios.get('http://localhost:5000/payouts', {
        responseType: "json"
    });
    return response.data;
}

export default {getPreview, submit, list};