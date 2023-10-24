class GameMode {
    private Mode: string;
    private bomb: number;

    constructor(Mode: string, bomb: number) {
        this.Mode = Mode;
        this.bomb = bomb;
    }
    getMode(): string {
        return this.Mode;
    }
    getBomb(): number {
        return this.bomb;
    }
}
export default GameMode;