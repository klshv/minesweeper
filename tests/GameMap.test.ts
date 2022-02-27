import { BombField } from "../src/BombField"
import { FlagResult, GameMap, GameMapCell } from "../src/GameMap";

describe("Создание игрового поля", () => {

    it("Количество ячеек совпадет с заказанным", () => {
        const width = 5, height = 8;

        const bombField = new BombField();
        const gameMap = new GameMap(bombField, width, height);

        const resultCells = gameMap.getCells();
        const numberOfRows = resultCells.length;
        const allWidthsCorrect = resultCells        
                .map(x => x.length)
                .every(x => x == width);

        expect(numberOfRows).toBe(height);
        expect(allWidthsCorrect).toBeTruthy();

    })

    it("Новое игровое поле должно создаваться с закрытыми ячейками", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 10, 13);
        const result = gameMap.getCells().flat().every(x => x == GameMapCell.Closed);
        expect(result).toBeTruthy();

    })
})

describe("Открытие ячейки игрового поля", () => {
    it("Если попытаться открыть уже открытую ячейку, ничего не происходит", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);

        const noChangesCellsValues: GameMapCell[] = [GameMapCell.Flagged, 
                                                    GameMapCell.Opened0, 
                                                    GameMapCell.Opened1, 
                                                    GameMapCell.Opened2,
                                                    GameMapCell.Opened3, 
                                                    GameMapCell.Opened4, 
                                                    GameMapCell.Opened5, 
                                                    GameMapCell.Opened6, 
                                                    GameMapCell.Opened7, 
                                                    GameMapCell.Opened8, 
                                                    GameMapCell.Boom];
        
        const x = 0, y = 0;
        noChangesCellsValues.forEach(cellValue => {
            gameMap.getCells()[y][x] = cellValue;

            const result = gameMap.openCell(x, y);

            expect(result).toBe(cellValue);
            expect(gameMap.getCell(x, y)).toBe(cellValue);
        });
    });
    
    it.todo("Если открыть ячейку, в котором нет мин и есть хоть одна мина по соседству, записать в ячейку кол-во соседей"); 
    it.todo("Если открыть ячейку, в котором нет мин и нет мин по соседству, открыть все такие ячейки вокруг"); 
    it.todo("Если открыть ячейку с миной, пометить её взрывом"); 
    it.todo("Если открыть ячейку с миной, метод возвращает соответствующее значение");     
})

describe("Работа с флагами", () => {
    it("Мы успешно ставим флаг на закрытую ячейку", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 10, 13);
        
        const x = 0, y = 0;
        const result = gameMap.setFlag(x, y);

        expect(result).toBe(FlagResult.FlagAdded);
        expect(gameMap.getCell(x, y)).toBe(GameMapCell.Flagged);
    });
    
    it("Мы успешно можем снять флаг с ячейки с флагом", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        
        const x = 0, y = 0;
        gameMap.setFlag(x, y);

        const result = gameMap.removeFlag(x, y);

        expect(result).toBe(FlagResult.FlagRemoved);
        expect(gameMap.getCell(x, y)).toBe(GameMapCell.Closed);
    });

    it("Если попыться поставить флаг на незакрытую ячейку, ничего не происходит", () => {

        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);

        const noChangesCellsValues: GameMapCell[] = [GameMapCell.Flagged, 
                                                    GameMapCell.Opened0, 
                                                    GameMapCell.Opened1, 
                                                    GameMapCell.Opened2,
                                                    GameMapCell.Opened3, 
                                                    GameMapCell.Opened4, 
                                                    GameMapCell.Opened5, 
                                                    GameMapCell.Opened6, 
                                                    GameMapCell.Opened7, 
                                                    GameMapCell.Opened8, 
                                                    GameMapCell.Boom];
        
        const x = 0, y = 0;
        noChangesCellsValues.forEach(cellValue => {
            gameMap.getCells()[y][x] = cellValue;

            const result = gameMap.setFlag(x, y);

            expect(result).toBe(FlagResult.NoChanges);
            expect(gameMap.getCell(x, y)).toBe(cellValue);
        })

    }); 

})