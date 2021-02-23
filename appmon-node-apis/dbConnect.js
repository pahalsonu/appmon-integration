import mongoose from "mongoose";
import config from "./config.js";

const dbConnect = async () => {
    try {
        const connectDB = await mongoose.connect(
            `mongodb+srv://${config.mongoUser}:${config.mongoPassword}@appmoncluster.45b6r.mongodb.net/${config.mongoDB}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex : true,
                useFindAndModify : false
            }
        );
        const dbAttr = connectDB.connections[0].client.s.options;
        console.log(
            `${dbAttr.auth.username} connected To MongoDB : ${dbAttr.srvHost}: ${dbAttr.dbName} Successfully`
        );
    } catch (err) {
        console.error(`Couldn't Connect to MongoDB : ${config.mongoDB}`);
    }
};

export default dbConnect;
