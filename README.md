# blog-mern-stack
# API - https://server-for-mern-app-shop-api.onrender.com

#Posts \n
GET all Posts - https://server-for-mern-app-shop-api.onrender.com/posts; \n
\n
POST create post - https://server-for-mern-app-shop-api.onrender.com/posts; \n
    \t params: { \n
		 \t \t title: string, \n
		 \t \t text: string, \n
		 \t \t imageUrl: string, \n
		 \t \t tags: [string], \n
		 \t \t user: { \n
		 \t \t \t \t	UserModel \n
		 \t \t} \n
	 \t \}\n\n
GET Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id} \n
	 \t params: { \n
	 \t \t 	_id \n
	 \t}\n\n
DELETE Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id} \n
	 \tparams: { \n
	 \t \t	_id \n
	 \t} \n \n
PATCH update Post by id - https://server-for-mern-app-shop-api.onrender.com/posts/${id} \n
	 \t params: { \n
	 \t \t	_id \n
	 \t} \n \n
GET image by name - https://server-for-mern-app-shop-api.onrender.com/uploads/grapes.png \n
\n	
POST upload image - https://server-for-mern-app-shop-api.onrender.com/upload \n
	 \t params: { \n
	 \t \t	imageUrl \n
	 \t} \n\n
#User \n
GET user inform - https://server-for-mern-app-shop-api.onrender.com/auth/me \n
	 \tparams: { \n
	 \t \t	email: string,\n 
	 \t \t	fullName: string, \n 
	 \t \t	passwordHash: hash, \n
	 \t \t	avatarUrl: string, \n
	 \t} \n\n
POST login user - https://server-for-mern-app-shop-api.onrender.com/auth/login \n
\n
POST register user - https://server-for-mern-app-shop-api.onrender.com/auth/register\n

