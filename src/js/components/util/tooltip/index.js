import ui from 'dorui';
import './index.css';

const tooltip = ({ text, child, ...rest }) => {
    const { classes } = rest;

    return ui.div({
        classes: ['tooltip-wrapper', ...classes || []],
        events: {
            mouseenter: e => {
                e.target.children[0].classList.add('visible');
            },
            mouseleave: e => {
                e.target.children[0].classList.remove('visible');
            }
        },
        children: [
            ui.span({
                class: 'tooltip',
                text
            }),
            child
        ]
    });
};

export default tooltip;