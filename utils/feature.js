import mongoose from "mongoose"

export const connectDB = (uri)=>{
    mongoose.connect(
        uri, {
            dbName: "NP_SoftHub_Solution"
        }
    )
    .then((c)=> console.log(`Connected DB to ${c.connection.host}`))
    .catch((c)=> console.log(c));
};
