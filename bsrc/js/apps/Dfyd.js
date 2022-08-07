import ui from 'dorui';
import App from '../client/App';

const date = new Date();

Array.isArray();
Number(1);
Boolean(0);

const arr = new Array(5);


class Dfyd extends App {
    constructor(OS) {
        super(OS, {
            name: 'Dfyd',
            // icon: 'dfyd.png',
            info: {
                date: 1563984000000
            },
            options: {
                docked: true,
                maxSessions: 1
            },
        });
        this.ui = this.buildUI();
    }

    buildUI() {
        return ui.div({
            class: 'dfyd-app'
        });
    }
}

export default Dfyd;
