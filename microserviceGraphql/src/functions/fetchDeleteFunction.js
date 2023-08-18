const fetch = require('node-fetch');

const fetchDeleteFunction = async function (uri) {
    const result = await fetch(uri, {
        method: 'DELETE',
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

module.exports = fetchDeleteFunction; 