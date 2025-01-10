import { config } from "dotenv";
config();

export let port = process.env.PORT;
export let database = process.env.DATABASE;
export let mongoURI = process.env.MONGO_URI;
export let secretKey = process.env.SECRET_KEY;
export let baseURL = process.env.REACT_APP_BASEURL;
