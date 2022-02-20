import { BombField } from "../src/BombField"
import { GameMap, GameMapCell } from "../src/GameMap";

describe("Игровое поле", () => {

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

    it("Новое игровое поле должно создаваться с закрытыми клетками", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 10, 13);
        const result = gameMap.getCells().flat().every(x => x == GameMapCell.Closed);
        expect(result).toBeTruthy();

    })


})