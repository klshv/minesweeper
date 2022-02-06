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

    // TODO: Тест на то, что все мины лежат в указанном диапазоне 

    it("мины должны быть в указанном диапазоне", ()=>{
        const amount = 5;
        const width = 100, height = 50;
        const field = BombField.generate(amount, width, height);
        expect(field.getBombs().every(b => b[0] >= 0 && b[0] < width)).toBeTruthy(); 
        expect(field.getBombs().every(b => b[1] >= 0 && b[1] < height)).toBeTruthy(); 
    })


    // TODO: Тест на то, сгенерировав поле дважды, мы получаем разный результат 
    it("сгенерировав поле дважды, мы получаем разный результат", ()=>{
        const amount = 50;
        const field1 = BombField.generate(amount, 100, 100);
        const field2 = BombField.generate(amount, 100, 100);

        expect(field1).not.toEqual(field2);
    })

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

})

