import { BombField } from "./BombField";

export enum GameMapCell {
   Closed = -1, Flagged, Opened0, Opened1, Opened2, Opened3, Opened4, Opened5, Opened6, Opened7, Opened8, Boom
}

export enum FlagResult { FlagAdded = -1, NoChanges = 0, FlagRemoved = 1 }

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

    setFlag(x: number, y: number): FlagResult {
        if (this.cells[y][x] == GameMapCell.Closed) {
            this.cells[y][x] = GameMapCell.Flagged;
            return FlagResult.FlagAdded;
        } else { 
            return FlagResult.NoChanges;
        }

    }

    removeFlag(x: number, y: number): FlagResult {
        this.cells[y][x] = GameMapCell.Closed;
        return FlagResult.FlagRemoved;
    }

    //removeFlag() { throw new Error("Not implemented"); }

    getCell(x: number, y: number): GameMapCell {
        if (y < 0 || y >= this.cells.length) {
            throw new Error(`Cell coordinates (${x}, ${y}) is out of game map boundaries.`);
        }

        if (x < 0 || this.cells.length == 0 || x >= this.cells[0].length) {
            throw new Error(`Cell coordinates (${x}, ${y}) is out of game map boundaries.`);
        }

        return this.cells[y][x];
    }

    openCell(x: number, y: number): GameMapCell {
        if (this.cells[y][x] != GameMapCell.Closed) {
            return this.cells[y][x];
        }
        if (this.bombField.exists([x,y])) {
            this.cells[y][x] = GameMapCell.Boom;
    
        } else {
            const neighboursCount = this.bombField.calculateNeighbours([x,y]);
            switch(neighboursCount) {
                case 0: 
                    this.cells[y][x] = GameMapCell.Opened0; 
                    break;
                case 1:
                    this.cells[y][x] = GameMapCell.Opened1; 
                    break;
                case 2:
                    this.cells[y][x] = GameMapCell.Opened2; 
                    break;
                case 3:
                    this.cells[y][x] = GameMapCell.Opened3; 
                    break;                       
                case 4:
                    this.cells[y][x] = GameMapCell.Opened4; 
                    break;                       
                case 5:
                    this.cells[y][x] = GameMapCell.Opened5; 
                    break;
                case 6:
                    this.cells[y][x] = GameMapCell.Opened6; 
                    break;                       
                case 7:
                    this.cells[y][x] = GameMapCell.Opened7; 
                    break;
                case 8:
                    this.cells[y][x] = GameMapCell.Opened8; 
                    break; 
                default:   
                    throw new Error("Неправильное количество соседей");
            }

        }

        return this.cells[y][x];
    }

    getCells = () => this.cells;
}

