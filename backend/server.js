import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import ArtRouter from "./routes/ArtRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import artistRouter from "./routes/artistRouter.js"
import LoginRouter from "./routes/loginRouter.js"
import RegisterRouter from "./routes/RegisterRoute.js"
import authrouter from "./routes/authRoutes.js"
import profilerouter from './routes/profileroute.js'
import OwnerRouter from './routes/OwnerRoute.js'
import ownerOrder from "./routes/ownerOrder.js"
import ownerArtist from "./routes/ownerArtist.js"



const app=express()
const port=4000

//middleware
app.use(express.json())
app.use(cors())

//db connection

connectDB();

//API endpoints

app.use("/api/Art_data",ArtRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/artists", artistRouter)
app.use("/api/login",LoginRouter);
app.use("/api/register",RegisterRouter);
app.use("/api/auth",authrouter);
app.use("/api/artist",profilerouter);
app.use("/api/owner",OwnerRouter);
app.use("/api/ownerorder",ownerOrder);
app.use("/api/ownerartist",ownerArtist);
app.use("/api/product",ArtRouter);

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
