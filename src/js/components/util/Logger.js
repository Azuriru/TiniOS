export const LOG_TYPES = [
    'ERROR',   // 0
    'WARNING', // 1
    'INFO',    // 2
    'DEBUG'    // 3
]

class Logger {
    constructor() {
        this.LOG_LEVEL = 1;
        this.log = [];
    }

    empty() {
        this.log = [];
    }

    log(count = 50) {
        for (const log of this.log.slice(-count)) {
            console.log(log);
        }
    }

    write(type, string) {
        const d = new Date();

        const _date = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();

        const pad = num => num.toString().padStart(2, '0');

        const time = `${pad(h)}:${pad(m)}:${pad(s)}`;
        const date = `${pad(_date)}/${pad(month)}/${year}`;

        const log = `[${time}] [${date}]  [${LOG_TYPES[type]}]  ${string}`;

        this.logs.push(log);

        if (type < this.LOG_LEVEL) {
            console.log(log);
        }
    }
}

export default new Logger();