import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fileUpload from 'express-fileupload';
import { eventRoutes } from './routes/eventRouter.js';
import mongoose from 'mongoose';
const app = express();
const Base_URL="/api/v3/app"

app.use(express.json({limit:"30mb",extended:true}))
app.use(express.urlencoded({limit:"30mb",extended:true}))
app.use(fileUpload({
        limits: {
            fileSize: 10000000,},
        abortOnLimit: true,}));

app.use(Base_URL,eventRoutes)  

const PORT=process.env.PORT || 3000
const CONNECTION_URL=process.env.MONGODB_URL
mongoose.set('strictQuery', false)
mongoose.connect(CONNECTION_URL).then((res)=>console.log("db connected")).catch((err)=>console.log("err in db connnect"))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});