import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidator } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from "./models/User.js";

const app = express();
const PORT = 3000;
const MONGODB_URL = 'mongodb+srv://pavlo:Ppavlo82@cluster0.rweko5y.mongodb.net/?retryWrites=true&w=majority';
//MongoDB conect
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL)
	.then(() => { console.log('MongoDB Conected') })
	.catch((err) => { console.log('DB eror: ', err) })


app.use(express.json());	//щоб app розумів параметри json з body

app.get('/', (req, res) => {
	res.send('Hello Node')
})

app.post('/auth/register', registerValidator, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array())
	}

	const password = req.body.password;
	const salt = await bcrypt.genSalt(10)
	const passwordHash = await bcrypt.hash(password, salt)
	const doc = new UserModel({
		email: req.body.email,
		fullName: req.body.fullName,
		passwordHash,
		avatarUrl: req.body.avatarUrl,
	})

	const user = await doc.save();

	res.json(user)
})

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server started on port ${PORT}`);

})