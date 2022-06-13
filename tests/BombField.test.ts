import { BombField } from "../src/BombField";

describe("Минное поле", ()=>{

    describe("Создание минного поля", () => {

        const width = 100, height = 150;

        describe("Когда мы указываем разное количество мин при генерации", () => {
            it("должно успешно создаться при запросе поля на количество мин меньшего, чем количество клеток", () => {
                expect(()=>{
                    BombField.generate(10, width, height); 
                }).not.toThrow();
            })
    
            it("должно успешно создаться при запросе поля на количество мин равное количеству ячеек", () => {
                expect(()=>{
                    BombField.generate(width*height, width, height); 
                }).not.toThrow();
            })
     
            it("должно успешно создаться при запросе поля на 1 мину", () => {
                expect(()=>{
                    BombField.generate(1, width, height); 
                }).not.toThrow();    
            })
    
            it("должно бросить ошибку при запросе поля на 0 мин", () => {
                expect(()=>{
                    BombField.generate(0, width, height); 
                }).toThrow();
            })
    
            it("должно бросить ошибку при запросе поля на отрицательное количество мин", () => {
                expect(()=>{
                    BombField.generate(-10, width, height); 
                }).toThrow();
            })
    
            it("должно бросить ошибку при количестве мин, превышающем кол-во ячеек", () => {
                expect(()=>{
                    BombField.generate(width*height + 1, width, height); 
                }).toThrow();
            })    
        })

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

    describe("Методы проверки", () => {
        it("возвращает true если передать координаты существующей бомбы" , ()=>{
            const field = new BombField();
    
            const bomb1: [number, number] = [50, 30];
            const bomb2: [number, number] = [40, 70];
    
            field.getBombs().push(bomb1);
            field.getBombs().push(bomb2);
    
            expect(field.exists(bomb1)).toBeTruthy();
            expect(field.exists(bomb2)).toBeTruthy();
        })

        it("возвращает false если передать координаты отсутствующей бомбы" , () => {
            const field = new BombField();
    
            const bomb1: [number, number] = [50, 30];
            const bomb2: [number, number] = [40, 70];
            const nonExistingBomb: [number, number] = [42, 42];
    
            field.getBombs().push(bomb1);
            field.getBombs().push(bomb2);
    
            expect(field.exists(nonExistingBomb)).toBeFalsy();
        })
    })

    describe("Методы вычисления", () => {

        it("возвращает 0 если рядом нет ни одной мины", () => {
            
            const field = new BombField();

            const bomb1: [number, number] = [10, 10];
            const bomb2: [number, number] = [10, 9];

            field.getBombs().push(bomb1);
            field.getBombs().push(bomb2);

            expect(field.calculateNeighbours([1,1])).toBe(0);        
        })

        it("возвращает 8 если клетка окружена минами", () => {
            
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

        it("возвращает 4 если во всех диагональных направлениях есть мины", () => {
            
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

        it("возвращает 3 если справа во всех клетках бомбы", () => {
            
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

        it("возвращает 3 если снизу во всех клетках бомбы", () => {
            
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
            

        it("возвращает 3 если вокруг клетки 3 мины (левый край и еще одна)", () => {
            
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

        it("возвращает 2 если вокруг клетки 2 мины (нижний край)" , () => {
            
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
})