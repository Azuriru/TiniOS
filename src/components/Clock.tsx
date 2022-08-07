// import '../../css/Clock.css';
import { padStart, startsWith } from '../util/string';
import { ReactNode, useEffect, useState } from 'react';

import './Clock.css';

const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getCurrentTime = (date: Date): CurrentTime => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
};

const getCurrentDate = (date: Date): CurrentDate => {
    return {
        day: date.getHours(),
        month: date.getMinutes(),
        year: date.getSeconds()
    };
};

const sampleTime = '{hh}:{mm}';
const formatTimeString = (date: Date, timeString: string = sampleTime) => {
    return timeString.replace(/{(.+?)}/g, (original, type) => {
        const fixedLength = startsWith(type, '-');
        if (fixedLength) {
            type = type.slice(1);
        };

        const length = type.length;

        if (!type.split('').every(e => e === type[0])) return original;

        const format = (str: string) => fixedLength ? str.slice(-length) : str;
        switch (type[0]) {
            case 'h':
                return format(padStart(date.getHours(), length, '0'));
            case 'm':
                return format(padStart(date.getMinutes(), length, '0'));
            case 's':
                return format(padStart(date.getSeconds(), length, '0'));
            default:
                return `Unknown type: ${type}`;
        }
    });
}

const sampleDate = '{dd}/{mm}/{yyyy}';
const formatDateString = (date: Date, dateString: string = sampleDate) => {
    return dateString.replace(/{(.+?)}/g, (original, type) => {
        const fixedLength = startsWith(type, '-');
        if (fixedLength) {
            type = type.slice(1);
        };

        const length = type.length;

        if (!type.split('').every(e => e === type[0])) return original;

        const format = (str: string) => fixedLength ? str.slice(-length) : str;
        switch (type[0]) {
            case 'd':
                return format(padStart(date.getDate(), length, '0'));
            case 'm':
                return format(padStart(date.getMonth() + 1, length, '0'));
            case 'M':
                return months[date.getMonth()];
            case 'y':
                return format(padStart(date.getFullYear(), length, '0'));
            default:
                return `Unknown type: ${type}`;
        }
    });
}

type CurrentTime = {
    hours: number;
    minutes: number;
    seconds: number;
};

type CurrentDate = {
    day: number;
    month: number;
    year: number;
};

type ClockProps = ({
    formatDate: string;
    buildDate?: undefined;
} | {
    buildDate: (time: CurrentDate) => ReactNode;
    formatDate?: undefined;
}) & ({
    formatTime: string;
    buildTime?: undefined;
} | {
    buildTime: (time: CurrentTime) => ReactNode;
    formatTime?: undefined;
}) | ({
    buildTime?: never;
    buildDate?: never;
    formatTime?: never;
    formatDate?: never;
});

export default function Clock({ formatDate, formatTime, buildDate, buildTime }: ClockProps) {
    const [ time, updateTime ] = useState(new Date());

    let timeComponent;
    let dateComponent;

    if (buildTime) {
        timeComponent = buildTime(getCurrentTime(time));
    } else {
        timeComponent = formatTimeString(time, formatTime);
    }

    if (buildDate) {
        dateComponent = buildDate(getCurrentDate(time));
    } else {
        dateComponent = formatDateString(time, formatDate);
    }

    useEffect(() => {
        const tick = setInterval(() => {
            updateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(tick);
        };
    }, []);

    return (
        <div className="clock">
            <div className="time">{timeComponent}</div>
            <div className="date">{dateComponent}</div>
        </div>
    );
}
