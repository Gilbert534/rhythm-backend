const bcrypt = require('bcrypt')
const express = require('express')
const users = require('../db/users.json')
const router = express.Router();
const fs = require('fs')
const SALT_ROUNDS = 10
const userRouter = express.Router()

userRouter.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const pwSalt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, pwSalt);

    const newUser = {
        id: users.length,
        username,
        password: hashedPassword,  
    }
    const updatedUsers = [...users, newUser]
    fs.writeFileSync('src/db/users.json', JSON.stringify(updatedUsers));
    return res.status(201).send({username: newUser.username, id: newUser.id})
})

userRouter.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => username === user.username)
    if (!user) return res.status(404).send()

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if(passwordsMatch) return res.status(200).send({ username: user.username, id: user.id })
})

module.exports = router;

