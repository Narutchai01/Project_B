import { config } from "../config";
import { MongoClient } from "mongodb";

const DB_URL = config.DB_URL;


class DatabaseMG {
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(DB_URL);
    }

    async connectTODB() {
        try{
            await this.client.connect();
            console.log('connected to db');
        }
        catch(err){
            console.log(err);
        }
    }
    getClient(){
        return this.client;
    }
    getClose(){
        this.client.close();
    }
}



export const dbMG = new DatabaseMG();