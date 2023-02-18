import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import fs from 'fs';
import { registerValidator, loginValidator, postCreateValidator } from './validations/validations.js';
import { UserControler, PostControler } from './controlers/index.js'
import { handleValidationErrors, checkAuth } from "./utils/index.js";

const PORT = process.env.PORT || 3030;
const MONGODB_URL = 'mongodb+srv://pavlo:Ppavlo82@cluster0.rweko5y.mongodb.net/blog?retryWrites=true&w=majority';
//MongoDB conect
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL)
	.then(() => { console.log('MongoDB Conected') })
	.catch((err) => { console.log('DB eror: ', err) })

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage })

app.use(express.json());//щоб app розумів параметри json з body
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
	res.send('Hello Node')
})

//маршрут для логінації
app.post('/auth/login', loginValidator, handleValidationErrors, UserControler.login)
//маршрут для реєстрації
app.post('/auth/register', registerValidator, handleValidationErrors, UserControler.register)
//маршрут для получення своїх данних
app.get('/auth/me', checkAuth, UserControler.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

// CRUD
app.get('/posts', PostControler.getAll)
app.get('/posts/:id', PostControler.getOne)
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostControler.create)
app.delete('/posts/:id', checkAuth, PostControler.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostControler.update)

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server started on port ${PORT}`);

})
