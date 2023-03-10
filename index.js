import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import fs from 'fs';
import sharp from 'sharp'
import cors from 'cors';
import { registerValidator, loginValidator, postCreateValidator } from './validations/validations.js';
import { UserControler, PostControler } from './controlers/index.js'
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import crypto from 'crypto'
import { S3Client , PutObjectCommand,GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

dotenv.config()

const randomImageName = (bytes = 32)=> crypto.randomBytes(bytes).toString('hex')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
	credentials:{
		accessKeyId: accessKey,
		secretAccessKey:secretAccessKey
	},
	region:bucketRegion
})


const PORT = process.env.PORT || 3030;
const MONGODB_URL = 'mongodb+srv://pavlo:Ppavlo82@cluster0.rweko5y.mongodb.net/blog?retryWrites=true&w=majority';
//MongoDB conect
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL)
	.then(() => { console.log('MongoDB Conected') })
	.catch((err) => { console.log('DB eror: ', err) })

const app = express();

//todo new image storage 
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })



app.use(express.json());	//щоб app розумів параметри json з body
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

// upload image



// app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
// 	res.json({
// 		url: `/uploads/${req.file.originalname}`,
// 	});
// });

// CRUD
app.get('/posts', PostControler.getAll)
app.get('/posts/:id', PostControler.getOne)
app.post('/posts', checkAuth, postCreateValidator, handleValidationErrors, PostControler.create)
app.delete('/posts/:id', checkAuth, PostControler.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostControler.update)



app.post('/upload', upload.single('image'), async (req, res) => {
	
	const imageName = randomImageName()
	// resize image
	const buffer = await sharp(req.file.buffer).resize({height: 1920, width: 1080, fit: 'contain'}).toBuffer()

	const params = {
		Bucket: bucketName,
		Key: imageName,
		Body: buffer,
		ContentType: req.file.mimetype,
		ACL: 'public-read',
	}
	const getObjectParams = {
		Bucket: bucketName,
		Key:imageName,
	}

	const putCommand = new PutObjectCommand(params)
	const getCommand = new GetObjectCommand(getObjectParams);
	await s3.send(putCommand)
	// const url = await getSignedUrl(s3, getCommand);
	const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;
	res.send({
		imageUrl,
	});
  })

  app.get('/images', async (req, res)=>{

	
  })
app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server started on port ${PORT}`);

})