// Hex
// ['#fcb901', '#fb8b00', '#f7630c', '#ca5010', '#da3b02', '#ef6950', '#d13437', '#fa4343'],
// ['#e74856', '#e81122', '#ea0a5e', '#c30652', '#e3028c', '#bf0177', '#c239b3', '#9a0089'],
// ['#1678d7', '#1062b1', '#8e8cd8', '#6b69d6', '#8764b8', '#744da8', '#b146c2', '#871798'],
// ['#2199bc', '#2d7d99', '#2ab7c2', '#1b8386', '#29b293', '#1c8473', '#31cc69', '#1e893e'],
// ['#7a7474', '#5d5958', '#687689', '#515c6b', '#567b73', '#486760', '#498206', '#1a7c10'],
// ['#757575', '#4b4a47', '#69797e', '#4a5359', '#647c64', '#525d54', '#847545', '#7e735f']

export default [
    {
        name: 'system',
        icon: 'laptop',
        header: 'System',
        desc: 'Display, sound, notifications, power',
        options: [
            {
                title: 'display',
                icon: 'desktop_windows',
                sections: [
                    {
                        header: 'brightness-color',
                        groups: [
                            {
                                info: 'brightness',
                                content: {
                                    type: 'range',
                                    args: {
                                        key: 'brightness',
                                        value: 50,
                                        icon: 'brightness_auto',
                                        iconRange: value => {
                                            if (value === 0) {
                                                return 'brightness_1';
                                            }

                                            for (let i = 0; i < 7; i++) {
                                                // 16.5 = 99 / 6
                                                // value - 2 = otherwise it'd stop at 99
                                                if ((value - 2) < 16.5 * i) {
                                                    return `brightness_${i + 1}`;
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                info: 'contrast',
                                content: {
                                    type: 'range',
                                    args: {
                                        key: 'contrast',
                                        value: 50
                                    }
                                }
                            },
                            {
                                info: 'saturation',
                                content: {
                                    type: 'range',
                                    args: {
                                        key: 'saturate',
                                        value: 50
                                    }
                                }
                            }
                        ]
                    },
                    {
                        header: 'scale-layout',
                        groups: [
                            {
                                info: 'resolution',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'display-resolution',
                                        defaultIndex: 1
                                    }
                                }
                            },
                            {
                                info: 'orientation',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'display-orientation',
                                        defaultIndex: 1
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'sound',
                icon: 'volume_up',
                sections: [
                    {
                        groups: [
                            {
                                info: 'volume',
                                content: {
                                    type: 'range',
                                    args: {
                                        icon: 'volume_off',
                                        key: 'volume',
                                        value: 100,
                                        showValue: true,
                                        iconRange: value => {
                                            if (value == 0) {
                                                return 'volume_off';
                                            } else if (value < 33) {
                                                return 'volume_mute';
                                            } else if (value < 66) {
                                                return 'volume_down';
                                            } else {
                                                return 'volume_up';
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'power-sleep',
                icon: 'power_settings_new',
                sections: [
                    {
                        header: 'screen',
                        groups: [
                            {
                                info: 'screen-battery-power',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'power-battery-screen',
                                        defaultIndex: 3
                                    }
                                }
                            },
                            {
                                info: 'screen-charged-power',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'power-charged-screen',
                                        defaultIndex: 5
                                    }
                                }
                            }
                        ]
                    },
                    {
                        header: 'Sleep',
                        groups: [
                            {
                                info: 'screen-battery-sleep',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'power-battery-sleep',
                                        defaultIndex: 5
                                    }
                                }
                            },
                            {
                                info: 'screen-charged-sleep',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'power-charged-sleep',
                                        defaultIndex: 8
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'clipboard',
                icon: 'content_paste',
                sections: [
                    {
                        groups: [
                            {
                                info: 'clipboard-notice'
                            }
                        ]
                    },
                    {
                        header: 'clipboard-history',
                        groups: [
                            {
                                info: 'clipboard-history-notice',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'clipboard-history'
                                    }
                                }
                            }
                        ]
                    },
                    {
                        header: 'clipboard-clear',
                        groups: [
                            {
                                info: 'clipboard-clear-info',
                                content: {
                                    type: 'button',
                                    args: {
                                        key: 'clear'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'personalization',
        icon: ['desktop_windows', 'brush'],
        header: 'Personalization',
        desc: 'Background, colors',
        options: [
            {
                title: 'desktop',
                icon: 'photo_size_select_actual',
                sections: [
                    {
                        groups: [
                            {
                                info: 'background',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'background-type',
                                        defaultIndex: 1
                                    }
                                }
                            },
                            {
                                info: 'background-fit',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'background-fit',
                                        defaultIndex: 1
                                    }
                                }
                            },
                            {
                                info: 'background-position-x',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'background-position-x',
                                        defaultIndex: 2
                                    }
                                }
                            },
                            {
                                info: 'background-position-y',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'background-position-y',
                                        defaultIndex: 2
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'colors',
                icon: 'palette',
                sections: [
                    {
                        header: 'colors-choose',
                        groups: [
                            {
                                info: 'colors-tini',
                                content: {
                                    type: 'grid',
                                    args: {
                                        key: 'color',
                                        defaultIndex: 'rgb(0, 255, 255)',
                                        options: [
                                            [
                                                'rgb(252, 185, 1)',
                                                'rgb(251, 139, 0)',
                                                'rgb(247, 99, 12)',
                                                'rgb(202, 80, 16)',
                                                'rgb(218, 59, 2)',
                                                'rgb(239, 105, 80)'
                                            ],
                                            [
                                                'rgb(209, 52, 55)',
                                                'rgb(250, 67, 67)',
                                                'rgb(231, 72, 86)',
                                                'rgb(232, 17, 34)',
                                                'rgb(234, 10, 94)',
                                                'rgb(195, 6, 82)'
                                            ],
                                            [
                                                'rgb(227, 2, 140)',
                                                'rgb(191, 1, 119)',
                                                'rgb(194, 57, 179)',
                                                'rgb(154, 0, 137)',
                                                'rgb(22, 120, 215)',
                                                'rgb(16, 98, 177)'
                                            ],
                                            [
                                                'rgb(142, 140, 216)',
                                                'rgb(107, 105, 214)',
                                                'rgb(135, 100, 184)',
                                                'rgb(116, 77, 168)',
                                                'rgb(177, 70, 194)',
                                                'rgb(135, 23, 152)'
                                            ],
                                            [
                                                'rgb(33, 153, 188)',
                                                'rgb(45, 125, 153)',
                                                'rgb(42, 183, 194)',
                                                'rgb(27, 131, 134)',
                                                'rgb(41, 178, 147)',
                                                'rgb(28, 132, 115)'
                                            ],
                                            [
                                                'rgb(49, 204, 105)',
                                                'rgb(30, 137, 62)',
                                                'rgb(122, 116, 116)',
                                                'rgb(93, 89, 88)',
                                                'rgb(104, 118, 137)',
                                                'rgb(81, 92, 107)'
                                            ],
                                            [
                                                'rgb(86, 123, 115)',
                                                'rgb(72, 103, 96)',
                                                'rgb(73, 130, 6)',
                                                'rgb(26, 124, 16)',
                                                'rgb(117, 117, 117)',
                                                'rgb(75, 74, 71)'
                                            ],
                                            [
                                                'rgb(105, 121, 126)',
                                                'rgb(74, 83, 89)',
                                                'rgb(100, 124, 100)',
                                                'rgb(82, 93, 84)',
                                                'rgb(132, 117, 69)',
                                                'rgb(126, 115, 95)'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    {
                        header: 'colors-more',
                        groups: [
                            {
                                info: 'transparency-effects',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'transparency-effects'
                                    }
                                }
                            },
                            {
                                info: 'accent',
                                content: [
                                    {
                                        type: 'checkbox',
                                        args: {
                                            key: 'accent-start-taskbar'
                                        }
                                    },
                                    {
                                        type: 'checkbox',
                                        args: {
                                            key: 'accent-titlebar'
                                        }
                                    },
                                ]
                            },
                            {
                                info: 'theme',
                                content: {
                                    type: 'radio',
                                    args: {
                                        key: 'theme',
                                        defaultIndex: 1
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'start',
                icon: 'dashboard',
                sections: [
                    {
                        groups: [
                            {
                                info: 'start-all-programs',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'start-all-programs'
                                    }
                                }
                            },
                            {
                                info: 'start-recent-apps',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'start-recently-used'
                                    }
                                }
                            },
                            {
                                info: 'start-full-screen',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'start-full-screen'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'taskbar',
                icon: {
                    class: 'taskbar'
                },
                sections: [
                    {
                        groups: [
                            {
                                info: 'taskbar-lock',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'taskbar-lock'
                                    }
                                }
                            },
                            {
                                info: 'taskbar-hide',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'taskbar-hide'
                                    }
                                }
                            },
                            {
                                info: 'taskbar-buttons',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'taskbar-icon-small'
                                    }
                                }
                            },
                            {
                                info: 'taskbar-peek',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'taskbar-peek'
                                    }
                                }
                            },
                            {
                                info: 'taskbar-preview-hover',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'taskbar-preview-hover'
                                    }
                                }
                            },
                            {
                                info: 'taskbar-location',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'taskbar-position',
                                        defaultIndex: 4
                                    }
                                }
                            },
                            {
                                info: 'taskbar-buttons-combine',
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'taskbar-combine',
                                        defaultIndex: 1
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'apps',
        icon: 'app_registration',
        header: 'Apps',
        desc: 'Uninstall, defaults, optional features',
        options: [
            {
                title: 'apps-features',
                icon: 'apps',
                sections: [
                    {
                        header: 'apps-features',
                        groups: [
                            {
                                info: 'apps-notice',
                                content: {
                                    type: 'app-list',
                                    args: {
                                        key: 'general-apps-sort-by'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'startup',
                icon: 'apps',
                sections: [
                    {
                        header: 'startup-apps',
                        groups: [
                            {
                                info: 'startup-notice',
                                content: {
                                    type: 'app-list',
                                    args: {
                                        key: 'startup-apps-sort-by'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'time',
        icon: ['schedule', 'translate'],
        header: 'Time & Language',
        desc: 'Speech, region, date',
        options: [
            {
                title: 'date-time',
                icon: 'today',
                sections: [
                    {
                        header: 'date-time-current',
                        groups: [
                            {
                                content: {
                                    type: 'clock'
                                }
                            }
                        ]
                    },
                    {
                        groups: [
                            {
                                info: 'time-zone',
                                // I'm sorry please bear with me this was the only way LMAO
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'time-zone',
                                        defaultIndex: 36
                                    }
                                }
                            },
                            {
                                info: 'time-dst',
                                content: {
                                    type: 'toggle',
                                    args: {
                                        key: 'time-dst'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'language',
                icon: 'translate',
                sections: [
                    {
                        header: 'language-display',
                        groups: [
                            {
                                content: {
                                    type: 'dropdown',
                                    args: {
                                        key: 'language',
                                        defaultIndex: 1
                                    }
                                }
                            },
                            {
                                info: 'language-display-notice'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];