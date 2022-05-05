const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.REACT_APP_MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
	} catch (error) {
		console.log(`Error: ${error}`.red.bold);
		process.exit();
	}
};

module.exports = connectDB;
