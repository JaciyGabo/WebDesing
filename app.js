const express = require('express');
const app = express();

app.use(express.json());

const users = [
    {
        username: "admin",
        password: "admin123",
        email: "admin@email.com",
        birth_date: "1990-01-01",
        full_name: "Admin User"
    },
    {
        username: "testuser",
        password: "test123",
        email: "test@email.com",
        birth_date: "1995-05-05",
        full_name: "Test User"
    }
];



const validateCredentials = (req, res, next) => {
    const { username, password } = req.headers;

    const user = users.find(u => u.username === username && u.password === password);

    if(user){
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

app.get('/api/data', validateCredentials, (req, res) => {
    res.status(200).json({
        statusCode: 200,
        intMessage: 'Operation Successful',
        data: {
            status: true,
            message: 'The user and password are correct'
        },
    });
});

app.post('/api/register', (req, res) => {
    const { username, password, email, birth_date, full_name } = req.body;

    if (!username || !password || !email || !birth_date || !full_name) {
        return res.status(400).json({
            statusCode: 400,
            intmessage: 'All fields are required',
            data: {
                status: false,
                message: 'Data is missing'
            }
        });
    }

    const userExists = users.some(u => u.username === username || u.email === email);
    if (userExists) {
        return res.status(409).json({
            statusCode: 409,
            message: 'User already exists'
        });
    }

    users.push({ username, password, email, birth_date, full_name });

    res.status(201).json({
        statusCode: 201,
        message: 'User registered successfully'
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})