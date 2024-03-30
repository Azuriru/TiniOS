import ui from 'dorui';
import App from '../client/App';

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