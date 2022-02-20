import { BombField } from "./BombField";

export enum GameMapCell {
    Closed=-1, Flagged, Opened0, Opened1, Opened2, Opened3, Opened4, Opened5, Opened6, Opened7, Opened8, Boom
}

export class GameMap {
    private bombField: BombField;
    private cells: GameMapCell[][];

    constructor(bombField: BombField, width: number, height: number) {
        this.bombField = bombField;

        const row = new Array(width);
        row.fill(GameMapCell.Closed);
        
        this.cells = new Array(height);
        this.cells.fill(row);
    }

    getCells = () => this.cells;
}

