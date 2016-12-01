function search(query, cb) {
    return fetch(`/api/post`, {
        accept: 'application/json',
        method: "POST",
    })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;
        console.log(error); 
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

const RestClient = { search };

export default RestClient;