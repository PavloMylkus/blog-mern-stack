# blog-mern-stack
# API - https://server-for-mern-app-shop-api.onrender.com

#Posts
GET all Posts - https://server-for-mern-app-shop-api.onrender.com/posts;

POST create post - https://server-for-mern-app-shop-api.onrender.com/posts;
	params: {
		title: string,
		text: string,
		imageUrl: string,
		tags: [string],
		user: {
			UserModel
		}
	}
GET Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id}
	params: {
		_id
	}
DELETE Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id}
	params: {
		_id
	}
PATCH update Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id}
	params: {
		_id
	}
GET image by name - https://server-for-mern-app-shop-api.onrender.com/uploads/grapes.png
	
POST upload image - https://server-for-mern-app-shop-api.onrender.com/upload
	params: {
		imageUrl
	}
#User 
GET user inform - https://server-for-mern-app-shop-api.onrender.com/auth/me
	params: {
		email: string,
		fullName: string,
		passwordHash: hash,
		avatarUrl: string,
	}
POST login user - https://server-for-mern-app-shop-api.onrender.com/auth/login

POST register user - https://server-for-mern-app-shop-api.onrender.com/auth/register

