import express from "express";
const app = express();
const PORT = 3000


app.get('/', (req, res) => {
	res.send('Hello Node')
})



app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server started on port ${PORT}`);

})