import ui from 'dorui';
import App from '../client/App';
import Icon from '../components/Icon';

class VSC extends App {
    constructor(OS) {
        super(OS, {
            name: 'VSC',
            icon: Icon('code', {
                style: {
                    color: '#0ff'
                }
            }),
            info: {
                author: 'Microsoft Corporation'
            },
            options: {
                docked: true,
                pinned: true,
                maxSessions: 3
            },
        });
        this.ui = this.buildUI();
    }

    buildUI() {
        return ui.div({
            class: 'vsc-app'
        });
    }
}

export default VSC;