const express = require('express');
const app = express();

const USERNAME = "admin";
const PASSWORD = "pass123"

const validateCredencials = (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password'];

    if(username === USERNAME && password === PASSWORD){
       next(); 
    }else{
        res.status(401).json({
            statusCode: 401,
            intMessage: 'Unauthoriced: Invalid Credentials',
            data: {
                status: false,
                message: 'The user or password are wrong'
            }
        });
    }
};

app.get('/api/data', validateCredencials, (req, res) => {
    res.status(200).json({
        statusCode: 200,
        intMessage: 'Operation Successful',
        data: {
            status: true,
            message: 'The user and password are correct'
        },
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server runing on http://localhost:${PORT}`)
})