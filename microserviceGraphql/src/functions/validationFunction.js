const fetchFunction=require('./fetchFunction');

const validationFunction = async function (cookie) { 
        let req=cookie;
        const token = req.replace('token=','');
        const authFormData={token};
        const authResponse = await fetchFunction(authFormData, process.env.AUTHORIZATION_MICROSERVICE+'validation');
        return authResponse
};

module.exports = validationFunction; 