import { config } from 'dotenv';
import { dirname, resolve } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import userRouter from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '.env');
config({ path: envPath });

const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

mongoose.connect(process.env.MONGO_DB_CONNECT)
.then(() => app.listen(6000))
.then(() => console.log("Connected to database and listening at port 6000"))
.catch((err) => console.log(err));

app.listen(5000);