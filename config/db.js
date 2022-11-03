const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL
            //useNewUrlParser: true, //(From the mongoose.js Website) The MongoDB Node.js driver rewrote the tool it uses to parse MongoDB connection strings. Because this is such a big change, they put the new connection string parser behind a flag
            //useUnifiedTopology: true, //To opt in to using the new topology engine (In fact Mongoose 5.7 uses MongoDB driver 3.3.x, which introduced a significant refactor of how it handles monitoring all the servers in a replica set or sharded cluster)
            // useFindAndModify: false, //we use these 3 use... to fix all the deprecation warning //I GOT AN ERROR WHEN USING THIS FIND AND MODIFY ONE HAD TO COMMENT IT FOR MY DATABASE TO CONNECT
        )

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB