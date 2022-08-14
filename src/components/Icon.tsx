import classNames from 'classnames';

type IconProps = {
    children: string;
    type?: string;
    className?: string;
    props?: object;
};

export default function Icon({ children, type, className, ...props }: IconProps) {
    return (
        <div className={classNames(`material-icons${type ? `-${type}` : ''}`, 'mi', className)} {...props}>
            {children}
        </div>
    );
}

export function appIcon(icon: string) {
    return (
        <img src={`./assets/app-icons/${icon}.png`}/>
    );
}
