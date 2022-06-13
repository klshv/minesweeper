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

    describe("Когда открываем незакрытую ячейку", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        const x = 0, y = 0;
    
        it("ячейка c флагом остаётся флагом", () => {
            const cellValue = GameMapCell.Flagged;             
            gameMap.getCells()[y][x] = cellValue;
    
            const result = gameMap.openCell(x, y);

            expect(result).toBe(cellValue);
            expect(gameMap.getCell(x, y)).toBe(cellValue);        
        })

        it("взорванная ячейка должна остаться взорванной", () => {
            const cellValue = GameMapCell.Boom;             
            gameMap.getCells()[y][x] = cellValue;
    
            const result = gameMap.openCell(x, y);

            expect(result).toBe(cellValue);
            expect(gameMap.getCell(x, y)).toBe(cellValue);        
        })

        it("открытая ячейка остаётся открытой и количество соседей не меняется", () => {
            const noChangesCellsValues: GameMapCell[] = [ 
                GameMapCell.Opened0, 
                GameMapCell.Opened1, 
                GameMapCell.Opened2,
                GameMapCell.Opened3, 
                GameMapCell.Opened4, 
                GameMapCell.Opened5, 
                GameMapCell.Opened6, 
                GameMapCell.Opened7, 
                GameMapCell.Opened8];

            noChangesCellsValues.forEach(cellValue => {
                gameMap.getCells()[y][x] = cellValue;
    
                const result = gameMap.openCell(x, y);
    
                expect(result).toBe(cellValue);
                expect(gameMap.getCell(x, y)).toBe(cellValue);            
            });
        })
    })

    describe("Когда открываем закрытую ячейку", () => {

        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        const x = 0, y = 0;

        let spy: jest.SpyInstance<any, any> | null = null;

        describe("Без мины и рядом одна мина", () => {
            gameMap.getCells()[y][x] = GameMapCell.Closed;    
            spy = jest.spyOn(bombField, 'calculateNeighbours').mockImplementation(_ => 1);

            const result = gameMap.openCell(x, y);

            it("в ячейку должно записаться 1", () =>{
                expect(result).toBe(GameMapCell.Opened1)
            })
        })

        describe("Без мины и рядом нет мин", () => {
            gameMap.getCells()[y][x] = GameMapCell.Closed;    
            spy = jest.spyOn(bombField, 'calculateNeighbours').mockImplementation(_ => 0);

            const result = gameMap.openCell(x, y);

            it("в ячейку должно записаться 0", () =>{
                expect(result).toBe(GameMapCell.Opened0)
            })
        })
        
        describe("С миной", () => {
            gameMap.getCells()[y][x] = GameMapCell.Closed;    
            spy = jest.spyOn(bombField, 'exists').mockImplementation(_ => true);

            const result = gameMap.openCell(x, y);
            
            it("ячейка должна пометиться взрывом", () =>{
                expect(result).toBe(GameMapCell.Boom)
            });
            spy?.mockRestore();
        })
    })    
})

describe("Установка флага", () => {

    describe("Когда флаг ставится на закрытую ячейку", () => {
        // Arrange
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 10, 13);
        const x = 0, y = 0;
        gameMap.getCells()[y][x] = GameMapCell.Closed;

        // Act
        const result = gameMap.setFlag(x, y);
 
        // Assert
        it("ячейка должна стать помеченной флагом", () => {
            expect(gameMap.getCell(x, y)).toBe(GameMapCell.Flagged);    
        })

        it("должно быть уведомление об добавлении флага", () => {
            expect(result).toBe(FlagResult.FlagAdded);
        })
    })

    describe("Когда происходит попытка поставить флаг на открытую ячейку", () => {
        // Arrange
        const bombField = new BombField();
        const x = 0, y = 0;

        describe.each([ 
            GameMapCell.Opened0, 
            GameMapCell.Opened1, 
            GameMapCell.Opened2,
            GameMapCell.Opened3, 
            GameMapCell.Opened4, 
            GameMapCell.Opened5, 
            GameMapCell.Opened6, 
            GameMapCell.Opened7, 
            GameMapCell.Opened8
        ])("Когда количество соседних мин равно %s", cellValue => {
            const gameMap = new GameMap(bombField, 5, 6);
            gameMap.getCells()[y][x] = cellValue;

            // Act
            let result = gameMap.setFlag(x, y);

            // Assert
            it(`состояние ячейки не должно измениться`, () => {
                expect(gameMap.getCell(x, y)).toBe(cellValue);
            })

            it("должно быть уведомление об отсутствии изменения количества флагов", () => {
                expect(result).toBe(FlagResult.NoChanges);
            })    
        })
})

    describe("Когда происходит попытка поставить флаг на уже помеченную флагом ячейку", () => {
        // Arrange
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        const x = 0, y = 0;
        gameMap.getCells()[y][x] = GameMapCell.Flagged;

        // Act
        const result = gameMap.setFlag(x, y);
 
        // Assert
        it("флаг должен быть снят", () => {
            expect(gameMap.getCell(x, y)).not.toBe(GameMapCell.Flagged);    
        })

        it("ячейка должна быть закрыта", () => {
            expect(gameMap.getCell(x, y)).toBe(GameMapCell.Closed);    
        })

        it("должно быть уведомление о снятии флага", () => {
            expect(result).toBe(FlagResult.FlagRemoved);
        })
    })

    describe("Когда происходит попытка поставить флаг на взорванную ячейку", () => {
        // Arrange
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        const x = 0, y = 0;
        gameMap.getCells()[y][x] = GameMapCell.Boom;

        // Act
        const result = gameMap.setFlag(x, y);
 
        // Assert
        it("ячейка остаётся взорванной", () => {
            expect(gameMap.getCell(x, y)).toBe(GameMapCell.Boom);    
        })

        it("должно быть уведомление об отсутствии изменения количества флагов", () => {
            expect(result).toBe(FlagResult.NoChanges);
        })

    })
})

describe("Снятие флага", () => {
    it("Мы успешно можем снять флаг с ячейки с флагом", () => {
        const bombField = new BombField();
        const gameMap = new GameMap(bombField, 5, 6);
        
        const x = 0, y = 0;
        gameMap.setFlag(x, y);

        const result = gameMap.removeFlag(x, y);

        expect(result).toBe(FlagResult.FlagRemoved);
        expect(gameMap.getCell(x, y)).toBe(GameMapCell.Closed);
    });
}) 