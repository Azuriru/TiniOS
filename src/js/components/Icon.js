import ui from 'dorui';

const Icon = (icon, { type, className, ...rest } = {}) => {
    return ui.div({
        classes: [`material-icons${type ? `-${type}` : ''}`, 'mi', className],
        text: icon,
        ...rest
    });
}

const appIcon = (icon) => ui.img({
    src: `./assets/app-icons/${icon}.png`
});

export default Icon;
export { appIcon };