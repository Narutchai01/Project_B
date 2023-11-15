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
<<<<<<< Updated upstream
    getClose(){
        this.client.close();
    }
=======
        
    
>>>>>>> Stashed changes
}



export const dbMG = new DatabaseMG();