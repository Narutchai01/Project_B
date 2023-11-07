import  GameMode  from "./GameMode";
import Intermidiate from "./Intermidiate";
import BeginnerMode from "./BeginnerMode";
import Expert from "./Expert";

class RecrodController extends GameMode implements Intermidiate, BeginnerMode, Expert {
    constructor(Mode: string, bomb: number,date:Date, time:number, username:string) {
        super(Mode, bomb);
    }  
}   

export default RecrodController;