import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from "./models/User.js";
import CheckAuth from "./utils/CheckAuth.js";

const app = express();
const PORT = 3000;
const MONGODB_URL = 'mongodb+srv://pavlo:Ppavlo82@cluster0.rweko5y.mongodb.net/blog?retryWrites=true&w=majority';
//MongoDB conect
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL)
	.then(() => { console.log('MongoDB Conected') })
	.catch((err) => { console.log('DB eror: ', err) })


app.use(express.json());	//щоб app розумів параметри json з body

app.get('/', (req, res) => {
	res.send('Hello Node')
})

//маршрут для логінації
app.post('/auth/login', async (req, res) => {
	try {
		//знаходимо користувача за email
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: "Користувача не знайдено"
			})
		}
		//перевірка чи сходяться паролі
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return res.status(401).json({
				message: 'Непрвильний логін або пароль'
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			})
		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось авторизуватися',
		})
	}
})

//маршрут для реєстрації
app.post('/auth/register', registerValidator, async (req, res) => {
	try {
		//перевірка на валідацію данних
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		//кодування паролю
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)
		//створення user
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		})
		//зберігаєм user в MongoDB
		const user = await doc.save();
		//створюєм токен реєстрації для usera
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d'
			})

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось зареєструватися',
		})
	}

})


app.get('/auth/me', CheckAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			return res.status(404).json({
				message: 'Користувача не знайдено'
			})
		}
		const { passwordHash, ...userData } = user._doc;

		res.json({ userData })
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось пройти автентифікацію',
		})
	}
})
app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server started on port ${PORT}`);

})