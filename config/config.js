const config = Object.freeze( {
	API :  process.env.API_URI,
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET

})

export default config
