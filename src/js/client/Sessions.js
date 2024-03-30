const Sessions = [];
export let desktopSessions = [];
export const sessionIndexes = {};

export const addSession = session => {
    Sessions.push(session);
    bringToFront(session);
}

export const removeSession = session => {
    const i = Sessions.indexOf(session);
    Sessions.splice(i, 1);
}

export const bringToFront = session => {
    if (!session) return;

    const i = Sessions.indexOf(session);

    if (i !== -1) {
        Sessions.push(Sessions.splice(i, 1)[0]);
    }

    Sessions.forEach((session, i) => {
        session.window.style.zIndex = i;
        session.titlebar.style.backgroundColor = '';
    });

    session.titlebar.style.backgroundColor = '#006b6b';
}

export const findLatestSession = app => {
    const filtered = Sessions.filter(session => session.app === app);

    return filtered[filtered.length - 1];
}

export const getLatestSession = exclude => {
    const filtered = Sessions.filter(session => !session.isMinimized && session !== exclude);

    return filtered[filtered.length - 1];
}

export const saveDesktopSessions = () => {
    desktopSessions = Sessions.filter(session => !session.isMinimized);

    for (const session of desktopSessions) {
        session.minimize(true, false);
    }
}

export const restoreDesktopSessions = () => {
    for (const session of desktopSessions) {
        session.minimize(false, false);
    }

    clearDesktopSessions();
}

export const clearDesktopSessions = () => {
    desktopSessions = [];
}

export const getSessionIndex = (app, { width, height, minWidth, minHeight }) => {
    if (sessionIndexes[app] === undefined) {
        sessionIndexes[app] = 0;
    }

    const multiplier = Object.keys(sessionIndexes).findIndex(a => a === app);
    const check = index => {
        const { innerWidth, innerHeight } = window;
        const w = width < minWidth ? minWidth : width;
        const h = height < minHeight ? minHeight : height;
        const paddingX = index * 24 + multiplier * 48 + 12;
        const paddingY = index * 28 + 6;

        if (innerWidth - w - paddingX < 0 || innerHeight - 44 - h - paddingY < 0) {
            sessionIndexes[app] = 0;
            return sessionIndexes[app]++;
        }

        return index;
    }

    return [ check(sessionIndexes[app]++), multiplier ];
}

export default Sessions;