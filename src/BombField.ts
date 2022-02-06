export class BombField {

    constructor() {

    }

    static generate(amount: number, width: number, height: number): BombField {
        if (amount < 1 || amount > width * height)
            throw new Error("Недопустимое количество мин");

        /* TODO: Алгоритм генерации поля 
            Пока amount > 0 генерируем случайную пару координат в указанном диапазоне.
            Если на этом месте нет мины, добавляем его в bombs и уменьшаем amount на 
            один. Если есть, то пробуем дальше. */

        const result = new BombField();

        let bombCounter = amount;
        while (bombCounter > 0) {

            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            if (!result.exists([x,y])) {
                result.getBombs().push([x, y]);
                bombCounter--;
            }
        }
        /*    ВНИМАНИЕ: Есть теоретическая опасность уйти в бесконечный цикл, если random будет плохо работать.
            В принципе, можно в случае наличия мины на поле, пытаться ставить мину по соседству (если там 
            ничего нет). 
        */
       return result;
    }

    // private bombs: number[] = [];
    private bombs: [number, number][] = [];

    getBombs = () => this.bombs;

    exists(coordinates: [number, number]): boolean {
        return this.bombs.some(b => b[0] == coordinates[0] && b[1] == coordinates[1]);
    }

    calculateNeighbours(coordinates: [number, number]): number {
        throw new Error("Not implemented yet");
    }

}