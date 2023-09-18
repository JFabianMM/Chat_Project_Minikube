const fetch = require('node-fetch');

const fetchPatchFunction = async function (formData, uri) {
    const result = await fetch(uri, {
        method: 'PATCH',
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

module.exports = fetchPatchFunction; 