import { Taskbar } from './Taskbar';
import { Desktop } from './Desktop';

import './OS.css';

export function OS() {
    return (
        <div id="OS">
            <Desktop />
            <Taskbar />
        </div>
    );
}
