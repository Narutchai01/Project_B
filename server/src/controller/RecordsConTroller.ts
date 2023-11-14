import { dbMG } from './DatabaseMG';


class RecordsController {
    private gameMode: string;
    private username: string;
    private time: number;
    private date: string;
    constructor(gameMode: string, username: string, time: number) {
        const d = new Date();
        this.username = username;
        this.gameMode = gameMode;
        this.time = time;
        this.date = d.toLocaleDateString();
    }
}
export default RecordsController;