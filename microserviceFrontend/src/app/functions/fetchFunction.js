const fetch = require('node-fetch');

const fetchFunction = async function (formData, uri) {
    const result = await fetch(uri, {
        method: 'post',
        body: JSON.stringify(formData),
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

module.exports = fetchFunction; 