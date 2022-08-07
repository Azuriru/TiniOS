import ui from 'dorui';
import Icon from './Icon';
import { toggle, get, set } from '../client/Database';
import '../../css/Inputs.css';

export const Button = ({ click, text }) => ui.div({
    class: 'button',
    text,
    events: {
        click: e => {
            e.stopPropagation();
            click && click();
        }
    }
});

export const Checkbox = (text, key, checked, toggler) => ui.div({
    class: 'checkbox',
    child: ui.label({
        children: [
            ui.input({
                type: 'checkbox',
                name: key,
                props: {
                    checked: checked ?? get(key)
                },
                events: {
                    input: () => {
                        toggler ? toggler(key) : toggle(key);
                    }
                }
            }),
            ui.span({
                text
            })
        ]
    })
});

const buildDropdownOption = (text, key, i, setter, selected) => {
    return ui.div({
        text,
        classes: {
            'dropdown-option': true,
            'selected': selected
        },
        events: {
            click: () => {
                setter ? setter(key, i) : set(key, i);
            }
        }
    });
}

export const Dropdown = (textOptions, key, defaultIndex, currentIndex, setter, mini) => {
    const index = currentIndex ?? get(key) ?? defaultIndex - 1;

    return ui.div({
        classes: ['dropdown', mini && 'mini'],
        children: [
            ui.div({
                class: 'dropdown-select',
                children: [
                    ui.div({
                        class: 'dropdown-text',
                        text: textOptions[index]
                    }),
                    ui.div({
                        class: 'dropdown-arrow'
                    })
                ]
            }),
            ui.div({
                class: 'dropdown-options',
                children: textOptions.map((text, i) => {
                    if (index === i) {
                        return buildDropdownOption(text, key, i, setter, true);
                    }

                    return buildDropdownOption(text, key, i, setter);
                })
            })
        ],
        events: {
            click: e => {
                const dropdown = e.currentTarget;

                for (const dd of document.body.querySelectorAll('.dropdown.open')) {
                    if (dd === dropdown) continue;
                    dd.classList.remove('open');
                }

                const options = e.currentTarget.querySelector('.dropdown-options');
                const selected = e.currentTarget.querySelector('.dropdown-option.selected');
                const option = e.target.closest('.dropdown-option');

                dropdown.classList.toggle('open');

                options.scrollTo({
                    top: [...options.children].indexOf(selected) * 40
                });

                if (option) {
                    if (option.classList.contains('selected')) return;

                    dropdown.querySelector('.dropdown-option.selected').classList.remove('selected');
                    dropdown.querySelector('.dropdown-text').textContent = option.textContent;
                    dropdown.classList.remove('open');
                    option.classList.add('selected');
                }
            }
        }
    });
}

const buildGridItem = (key, hex, setter, selected) => ui.div({
    classes: {
        'grid-item': true,
        selected
    },
    style: {
        backgroundColor: hex
    },
    events: {
        click: () => {
            setter ? setter(key, hex) : set(key, hex);
        }
    }
});

export const Grid = (key, defaultSelected, currentSelected, hexes, setter) => {
    const _hex = currentSelected ?? (get(key) || defaultSelected);

    return ui.div({
        class: 'grid',
        children: hexes.flat(1).map(hex => {
            if (hex === _hex) {
                return buildGridItem(key, hex, setter, true);
            }

            return buildGridItem(key, hex, setter);

        }),
        events: {
            click: e => {
                const gridItem = e.target.closest('.grid-item');
                if (!gridItem) return;

                e.currentTarget.querySelector('.selected') && e.currentTarget.querySelector('.selected').classList.remove('selected');

                gridItem.classList.add('selected');
            }
        }
    });
}

const buildRadioInput = (text, key, i, setter, checked) => ui.label({
    children: [
        ui.input({
            type: 'radio',
            name: key,
            props: {
                checked
            },
            events: {
                input: () => {
                    setter ? setter(key, i) : set(key, i);
                }
            }
        }),
        ui.span({
            text
        })
    ]
});

export const Radio = (textOptions, key, defaultIndex, currentValue, set) => {
    const index = currentValue ?? (get(key) ?? defaultIndex - 1);

    return ui.div({
        class: 'radio',
        children: textOptions.map((text, i) => {
            if (i === index) {
                return buildRadioInput(text, key, i, set, true);
            }

            return buildRadioInput(text, key, i, set);
        })
    });
}

export const Range = ({ icon, key, value, min = 0, max = 100, showValue, iconRange }, setter) => {
    const v = get(key) ?? value;
    const rangeIcon = Icon(iconRange ? iconRange(v) : icon, {
        type: 'outlined',
        className: 'icon'
    });
    const displayValue = ui.div({
        class: 'value',
        text: v
    });

    return ui.div({
        class: 'range',
        children: [
            icon && rangeIcon,
            ui.input({
                class: 'input',
                type: 'range',
                id: key,
                min,
                max,
                value: v,
                style: {
                    backgroundImage: `linear-gradient(to right, hsl(var(--color-hue, 180), var(--color-sat, 100%), var(--color-lig, 35%)) ${v}%, #fff ${v}%)`
                },
                events: {
                    input: e => {
                        e.stopPropagation();
                        const val = e.target.value;
                        const v = val / max * 100;

                        e.currentTarget.style.background = `linear-gradient(to right, hsl(var(--color-hue, 180), var(--color-sat, 100%), var(--color-lig, 35%)) ${v}%, #fff ${v}%)`;
                        displayValue.textContent = val;
                        if (iconRange) {
                            rangeIcon.textContent = iconRange(Number(val));

                        }
                        setter ? setter(key, Number(val)) : set(key, Number(val));
                    }
                }
            }),
            showValue && displayValue
        ]
    });
}

export const Toggle = ({ on, off }, key, checked, toggler) => {
    const label = ui.div({
        class: 'toggle-switch',
        text: checked ?? get(key) ? on : off
    });

    return ui.div({
        class: 'toggle',
        child: ui.label({
            class: 'toggle-label',
            children: [
                ui.input({
                    class: 'toggle-checkbox',
                    type: 'checkbox',
                    props: {
                        checked: checked ?? get(key)
                    },
                    events: {
                        input: e => {
                            e.stopPropagation();
                            toggler ? toggler(key) : toggle(key);
                            label.textContent = e.target.checked ? on : off;
                        }
                    }
                }),
                label
            ]
        })
    });
}