const fetch = require('node-fetch');

const fetchGetFunction = async function (uri) {
    const result = await fetch(uri, {
        method: 'GET',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'}
        })
        .then(res => res.json())
        .then(data => {
               return data;  
        });
    return result
};

module.exports = fetchGetFunction; 