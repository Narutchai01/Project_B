import GameMode from "./GameMode";


class BeginnerMode extends GameMode{
    constructor(Mode: string, bomb: number){
        super(Mode, bomb);
    }
}

export default BeginnerMode;