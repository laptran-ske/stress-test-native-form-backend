const axios = require("axios");
const { token, newJobProductsTemp, savePayload, JobProducts, SAVE_API_URL, FETCH_API_URL, instanceFetchPayload } = require("./data");

const RUN_TIMES = 100;

const instanceFetchRequests = [];
const saveRequests = [];

const generateAFetch = () => {
    return axios.post(
        FETCH_API_URL,
        instanceFetchPayload,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
}

const generateAPost = (url, data) => {
    return axios.post(
        url,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
}

for (let i = 1; i <= RUN_TIMES; i++) {
    const currentTempId = "temp-id-" + i;
    const newJP = {...newJobProductsTemp}
    newJP.UID = currentTempId;

    const newSavePayload = savePayload;
    newSavePayload.newInstanceData = {
        JobProducts: [JobProducts, newJP]
    };

    saveRequests.push(generateAPost(SAVE_API_URL, newSavePayload)); 

    instanceFetchRequests.push(generateAFetch());
}

async function runMe() {
    Promise.all([...saveRequests, ...instanceFetchRequests]).then((responses) => {
        responses.forEach((response) => {
        console.info(response.data);
        })
    });
}

runMe();
