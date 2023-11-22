import { dbMG } from './DatabaseMG';


class RecordsController {
    private gameMode: string;
    private username: string;
    private time: any;
    private date: string;
    private stageTus : string; 
    constructor(gameMode: string, username: string, time: any,stageTus : string) {
        const d = new Date();
        this.username = username;
        this.gameMode = gameMode;
        this.time = time;
        this.date = d.toLocaleDateString();
        this.stageTus = stageTus;
    }
}
export default RecordsController;