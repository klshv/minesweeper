export class BombField {

    private bombs: [number, number][] = [];

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

    getBombs = () => this.bombs;

    exists(coordinates: [number, number]): boolean {
        return this.bombs.some(b => b[0] == coordinates[0] && b[1] == coordinates[1]);
    }

    calculateNeighbours(coordinates: [number, number]): number {
        const neighbours: [number, number][] = [];
        for (let i=-1;i<=1;i++) {
            for (let j=-1;j<=1;j++) {
                if (i == 0 && j == 0) continue;
                const x = coordinates[0] + i;
                const y = coordinates[1] + j;
                if (x >= 0 && y >= 0) {
                    neighbours.push([x, y]);
                }
            }
        }
        return neighbours.filter(x => this.exists(x)).length;
    }

}