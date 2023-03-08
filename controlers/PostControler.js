import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось знайти публікацію',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findByIdAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { viewsCount: 1 }
			},
			{
				returnDocument: 'after'
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					return res.status(500).json({
						message: 'Не вдалось повернути публікацію',
					})
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Стаття не знайдена'
					})
				}

				res.json(doc)
			}
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось знайти публікацію',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findByIdAndDelete({
			_id: postId
		}, (err, doc) => {
			if (err) {
				console.log(err)
				return res.status(500).json({
					message: 'Не вдалось видалити публікацію',
				})
			}
			if (!doc) {
				return res.status(404).json({
					message: 'Стаття не знайдена'
				})
			}

			res.json({
				success: true
			})
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось знайти публікацію',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
			price: req.price
		})
		const post = await doc.save();
		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось створити публікацію',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		await PostModel.updateOne({
			_id: postId
		}, {
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
			price: req.body.price
		})
		res.json({
			success: true
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Не вдалось редагувати публікацію',
		})
	}
}