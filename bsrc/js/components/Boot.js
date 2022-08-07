import ui from 'dorui';
import Icon from './Icon';

const splashScreen = ui.div({
    class: 'splash-screen',
    children: [
        ui.div({
            class: 'shrink'
        }),
        ui.div({
            class: 'burst'
        }),
        ui.div({
            class: 'buntini',
            children: [
                ui.div({
                    class: 'mask'
                }),
                ui.span({
                    class: 'name',
                    text: 'TiniOS'
                })
            ]
        })
    ]
});

const Boot = ui.div({
    class: 'boot',
    child: ui.div({
        class: 'power',
        children: [
            ui.div({
                class: 'power-button',
                child: Icon('power_settings_new'),
                events: {
                    click: e => {
                        const power = e.target.closest('.power');

                        power.classList.add('hidden');
                        setTimeout(() => {
                            power.replaceWith(splashScreen);
                            setTimeout(() => {
                                // splashScreen.classList.add('hidden');
                                Boot.classList.add('hidden');
                                setTimeout(() => {
                                    Boot.remove();
                                }, 600);
                            }, 6500);
                        }, 800);
                    }
                }
            })
        ]
    })
});

export default Boot;