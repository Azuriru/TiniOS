import ui from 'dorui';
import App from '../client/App';

class ParaÉl extends App {
    constructor(OS) {
        super(OS, {
            name: 'Para Él',
            // icon: 'para-él.png'
        });
        this.ui = this.buildUI();
    }

    buildUI() {
        return ui.div({
            class: 'para-él-app'
        });
    }
}

export default ParaÉl;