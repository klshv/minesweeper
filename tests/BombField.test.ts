import { BombField } from "../src/BombField";

describe("Генератор минного поля", ()=>{

    it("должен требовать количество мин не менее 1", () => {
        
        const width = 100, height = 150;

        expect(()=>{
            const field = BombField.generate(1, width, height); 
        }).not.toThrow();

        expect(()=>{
            const field = BombField.generate(10, width, height); 
        }).not.toThrow();

        expect(()=>{
            const field = BombField.generate(0, width, height); 
        }).toThrow();

        expect(()=>{
            const field = BombField.generate(-10, width, height); 
        }).toThrow();        
    })

    it("должен требовать количество мин не больше ширины*высоту", () => {
        
        const width = 10, height = 15;
        const maxPossibleAmount = width*height;

        expect(()=>{
            const field = BombField.generate(30, width, height);
        }).not.toThrow();

        expect(()=>{
            const field = BombField.generate(maxPossibleAmount, width, height);
        }).not.toThrow();

        expect(()=>{
            const field = BombField.generate(maxPossibleAmount + 1, width, height);
        }).toThrow();
    })    

    it("должен сгенерировать количество мин столько, сколько мы заказали", ()=>{
        const amount = 5;
        const field = BombField.generate(amount, 100, 100);
        expect(field.getBombs().length).toBe(amount);
    })

    it("мины должны быть в указанном диапазоне", ()=>{
        const amount = 5;
        const width = 100, height = 50;
        const field = BombField.generate(amount, width, height);
        expect(field.getBombs().every(b => b[0] >= 0 && b[0] < width)).toBeTruthy(); 
        expect(field.getBombs().every(b => b[1] >= 0 && b[1] < height)).toBeTruthy(); 
    })

    it("сгенерировав поле дважды, мы получаем разный результат", ()=>{
        const amount = 50;
        const field1 = BombField.generate(amount, 100, 100);
        const field2 = BombField.generate(amount, 100, 100);

        expect(field1).not.toEqual(field2);
    })

})

describe("Методы минного поля", ()=>{

    it("метод проверки возвращает true если передать координаты существующей бомбы" , ()=>{
        const field = new BombField();

        const bomb1: [number, number] = [50, 30];
        const bomb2: [number, number] = [40, 70];

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);

        expect(field.exists(bomb1)).toBeTruthy();
        expect(field.exists(bomb2)).toBeTruthy();
    })

    it("метод проверки возвращает false если передать координаты отсутствующей бомбы" , () => {
        const field = new BombField();

        const bomb1: [number, number] = [50, 30];
        const bomb2: [number, number] = [40, 70];
        const nonExistingBomb: [number, number] = [42, 42];

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);

        expect(field.exists(nonExistingBomb)).toBeFalsy();
    })

    it("метод вычисления соседей возвращает 0 если рядом нет ни одной мины", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [10, 10];
        const bomb2: [number, number] = [10, 9];

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);

        expect(field.calculateNeighbours([1,1])).toBe(0);        
    })

    it("метод вычисления соседей возвращает 8 если клетка окружена минами", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [0, 0];
        const bomb2: [number, number] = [0, 1];
        const bomb3: [number, number] = [0, 2];
        const bomb4: [number, number] = [1, 0];
        const bomb5: [number, number] = [1, 2];
        const bomb6: [number, number] = [2, 0];
        const bomb7: [number, number] = [2, 1];
        const bomb8: [number, number] = [2, 2];

        /* 
           * * *
           * ? *   -> 8
           * * *
        */

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        field.getBombs().push(bomb3);
        field.getBombs().push(bomb4);
        field.getBombs().push(bomb5);
        field.getBombs().push(bomb6);
        field.getBombs().push(bomb7);
        field.getBombs().push(bomb8);

        expect(field.calculateNeighbours([1,1])).toBe(8);        
    })

    // Ещё пара случаев (соседи по диагонали, соседи слева/справа/сверху/снизу)

    it("метод вычисления соседей возвращает 4 если во всех диагональных направлениях есть мины", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [0, 0];
        const bomb2: [number, number] = [0, 2];
        const bomb3: [number, number] = [2, 0];
        const bomb4: [number, number] = [2, 2];

        /* 
           * - *
           - ? -   -> 4
           * - *
        */

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        field.getBombs().push(bomb3);
        field.getBombs().push(bomb4);
        
        expect(field.calculateNeighbours([1,1])).toBe(4);        
    })

    it("метод вычисления соседей возвращает 3 если справа во всех клетках бомбы", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [2, 0];
        const bomb2: [number, number] = [2, 1];
        const bomb3: [number, number] = [2, 2];

        /* 
           - - *
           - ? *   -> 3
           - - *
        */

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        field.getBombs().push(bomb3);
        
        expect(field.calculateNeighbours([1,1])).toBe(3);        
    })

    it("метод вычисления соседей возвращает 3 если снизу во всех клетках бомбы", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [0, 0];
        const bomb2: [number, number] = [1, 0];
        const bomb3: [number, number] = [2, 0];

        /* 
           - - -
           - ? -   -> 3
           * * *
        */

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        field.getBombs().push(bomb3);
        
        expect(field.calculateNeighbours([1,1])).toBe(3);        
    })

    // Тесты на сценарии, когда проверяем у края (как минимум у левого и верхнего, можно и право/низ)
        

    it("метод вычисления соседей возвращает 3 если вокруг клетки 3 мины (левый край и еще одна)", () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [1, 3];
        const bomb2: [number, number] = [1, 1];
        const bomb3: [number, number] = [2, 1];
        
        /* 
           * - -
           ? - -   -> 3
           * * -
        */ 

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        field.getBombs().push(bomb3);
        
        expect(field.calculateNeighbours([1,2])).toBe(3);        
    })

    it("метод вычисления соседей возвращает 2 если вокруг клетки 2 мины (нижний край)" , () => {
        
        const field = new BombField();

        const bomb1: [number, number] = [0, 0];
        const bomb2: [number, number] = [2, 0];
        
        /* 
           - - -
           - - -   -> 2
           * ? *
        */ 

        field.getBombs().push(bomb1);
        field.getBombs().push(bomb2);
        
        expect(field.calculateNeighbours([1,0])).toBe(2);        
    })

})