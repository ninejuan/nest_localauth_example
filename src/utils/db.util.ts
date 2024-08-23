import mongo from "mongoose"
import { config } from "dotenv";
config();

export async function linkToDatabase() {
    let murl; let env = process.env;
    murl = `${env.DB_TYPE}://${env.DB_ID}:${env.DB_PW}@${env.DB_CLUSTER}.${env.DB_CODE}.mongodb.net/${env.DB_FOLDER}`
    console.log('murl', murl);
    mongo.connect(`${murl}`).then(() => { console.log('mongoDB Connected') }).catch((e) => {
        console.error(e);
    });
}