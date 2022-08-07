import ui from 'dorui';
import '../../css/Clock.css';

class Clock {
    constructor(format = 'default') {
        this.format = format;
        this.element = this.buildClock();
    }

    getMonthName(month) {
        switch (month) {
            case 0:
                return 'January';
            case 1:
                return 'Febuary';
            case 2:
                return 'March';
            case 3:
                return 'April';
            case 4:
                return 'May';
            case 5:
                return 'June';
            case 6:
                return 'July';
            case 7:
                return 'August';
            case 8:
                return 'September';
            case 9:
                return 'October';
            case 10:
                return 'November';
            case 11:
                return 'December';
        }
    }

    render() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        // const s = d.getSeconds(); // nah I don't need seconds tbh

        const date = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        const pad = num => num.toString().padStart(2, '0');

        this.time.textContent = `${pad(h)}:${pad(m)}`;

        if (this.format === 'flat') {
            this.date.textContent = `, ${pad(date)} ${this.getMonthName(month)} ${year}`;
        } else {
            this.date.textContent = `${pad(date)}/${pad(month + 1)}/${year}`;
        }
    }

    start() {
        this.render();
        this.timer = setInterval(() => this.render(), 1000);
        return this;
    }

    stop() {
        clearInterval(this.timer);
    }

    buildClock() {
        return ui.div({
            class: 'clock',
            children: [
                this.time = ui.div({
                    class: 'time'
                }),
                this.date = ui.div({
                    class: 'date'
                })
            ]
        });
    }
}

export default Clock;