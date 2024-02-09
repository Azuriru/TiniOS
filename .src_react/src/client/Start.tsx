import classNames from "classnames";
import { ReactEventHandler, ReactNode, useState } from "react";
import Icon from '../components/Icon';
import { useSelector } from "../redux";
import { selectAllApps } from "../redux/apps";

import './Start.css';

export function Start() {
    const [visible, setVisible] = useState(false);

    const onClick = () => setVisible(visible => !visible);

    return (
        <div class="start">
            <StartIcon onClick={onClick} />
            <StartContent visible={visible} />
            <div class="context" />
        </div>
    );
}

type StartIconProps = {
    onClick: ReactEventHandler;
};

export function StartIcon({ onClick }: StartIconProps) {
    return (
        <div class="start-icon" onClick={onClick}>
            <div class="buntini-icon"></div>
        </div>
    );
}

type StartContentProps = {
    visible: boolean;
};

function StartContent({ visible }: StartContentProps) {
    return (
        <div class={classNames('start-content', !visible && 'hidden')}>
            <Sidebar />
            <Main />
        </div>
    );
}

type SidebarIconProps = {
    icon?: ReactNode;
    children?: ReactNode;
    text: string;
    onClick?: ReactEventHandler;
    onMouseLeave?: ReactEventHandler;
};

export function SidebarIcon({ icon, children, text, onClick, onMouseLeave }: SidebarIconProps) {
    return (
        <div class="sidebar-item" onClick={onClick} onMouseLeave={onMouseLeave}>
            <div class="icon">{icon}</div>
            <div class="name">{text}</div>
            {children}
        </div>
    );
}

type PowerOptionProps = {
    icon: string;
    children: string;
    onClick?: ReactEventHandler
};

function PowerOption({ icon, children, onClick }: PowerOptionProps) {
    return (
        <div class="power-option" onClick={onClick}>
            <Icon type="outlined">{icon}</Icon>
            <div>{children}</div>
        </div>
    );
}

export function Sidebar() {
    const [ visible, setVisible ] = useState(false);
    const [ powerVisible, setPowerVisible ] = useState(false);
    const [ appendedPower, setAppendedPower ] = useState(false);

    const togglePowerVisible = () => {
        setAppendedPower(true);
        setPowerVisible(visible => !visible);
    };

    const onPowerTransitionEnd = () => {
        setAppendedPower(powerVisible);
        console.log('transition end', powerVisible);
    };

    const onMouseLeave = () => {
        setPowerVisible(false);
    };

    const onSidebarEnter = () => {
        setVisible(true);
    };

    const onSidebarLeave = () => {
        setVisible(false);
    };

    return (
        <div class="sidebar">
            <div class={classNames('sidebar-content', visible && 'active')} onMouseEnter={onSidebarEnter} onMouseLeave={onSidebarLeave}>
                <SidebarIcon icon={<Icon>menu</Icon>} text="Menu" />
                <SidebarIcon icon={<Icon type="outlined">account_circle</Icon>} text="Account" />
                <SidebarIcon icon={<Icon type="outlined">settings</Icon>} text="Settings" />
                <SidebarIcon icon={<Icon>power_settings_new</Icon>} text="Power" onClick={togglePowerVisible} onMouseLeave={onMouseLeave}>
                    {
                        <div class={classNames("power-options", powerVisible && 'visible', appendedPower && 'appended')} onTransitionEnd={onPowerTransitionEnd}>
                            <PowerOption icon="dark_mode">Sleep</PowerOption>
                            <PowerOption icon="power_settings_new">Shut Down</PowerOption>
                            <PowerOption icon="refresh">Restart</PowerOption>
                        </div>
                    }
                </SidebarIcon>
            </div>
        </div>
    );
}

type StartItemProps = {
    children: string;
    icon: ReactNode;
    classes: any;
    onClick: ReactEventHandler;
    contextmenu?: ContextMenuItemProps[];
    closeStart?: boolean;
    props?: object;
};

export function StartItem({ icon, children, classes, onClick, contextmenu: contextMenuItems, ...props }: StartItemProps) {
    const onContextMenu = () => {
        // TODO
    };

    return (
        <div class={classNames('start-item', classes)} onClick={onClick} onContextMenu={onContextMenu} {...props}>
            <div class="app-icon">
                {icon}
            </div>
            <div class="app-name">
                {children}
            </div>
        </div>
    );
}

function Divider() {
    return (
        <div class="divider"/>
    );
}

type MenuProps = {
    pinnedItems?: ReactNode;
    recentItems?: ReactNode;
};

function Menu({ pinnedItems, recentItems }: MenuProps) {
    return (
        <div class="menu">
            <div class="pinned">
                {pinnedItems}
            </div>
            <Divider/>
            <div class="recent">
                {recentItems}
            </div>
        </div>
    );
}

function Main() {
    const [ allProgramsVisible, setAllProgramsVisible ] = useState(false);

    const onClick = () => {
        setAllProgramsVisible(visible => !visible);
    };

    return (
        <div class="main">
            <div class="main-content">
                {
                    allProgramsVisible
                        ? <AllPrograms />
                        : <Menu />
                }
                <Divider />
                <StartItem
                    classes={{
                        'all-programs-button': true,
                        'back': allProgramsVisible
                    }}
                    icon={<Icon>arrow_forward</Icon>}
                    onClick={onClick}
                >{!allProgramsVisible ? 'All Programs' : 'Back'}
                </StartItem>
            </div>
            <Divider />
            <div class="start-search">
                <div class="search-icon"><Icon>search</Icon></div>
                <input
                    class="search-input"
                    placeholder="Type here to search"
                />
            </div>
        </div>
    );
}

function AllPrograms() {
    const apps = useSelector(selectAllApps);

    return (
        <div class="all-programs">
            {apps.map(app => <div key={app.name}>{app.name}</div>)}
        </div>
    );
}

type ContextMenuItemProps = {
    className: string;
    text: string;
    onClick?: ReactEventHandler;
    showContext: boolean;
};

export function ContextMenuItem({ className, text, onClick, showContext }: ContextMenuItemProps) {
    return (
        <div className={`context-item ${className}`} onClick={onClick}>{text}</div>
    );
}

export function Checkbox() {
    const [checked, setChecked] = useState(false);

    return (
        <input type='checkbox' checked={checked} onClick={() => setChecked(!checked)} />
    );
}

type CheckboxButItTakesCheckedAsAPropProps = {
    checked: boolean;
    onClick: ReactEventHandler;
};

export function CheckboxButItTakesCheckedAsAProp({ checked, onClick }: CheckboxButItTakesCheckedAsAPropProps) {
    return (
        <input type='checkbox' checked={checked} onClick={onClick} />
    );
}
