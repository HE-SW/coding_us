import classNames from 'classnames';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
    typography?: keyof typeof TYPOGRAPHY_VARIANT;
}
export default function Txt({ typography = 'p', className, ...props }: Props) {
    return <span className={classNames('m-0 p-0', TYPOGRAPHY_VARIANT[typography], className)} {...props} />;
}

const TYPOGRAPHY_VARIANT = {
    h1: 'text-[56px] font-black',
    h2: 'text-[48px] font-extrabold',
    h3: 'text-[40px] font-bold',
    h4: 'text-[36px] font-bold',
    h5: 'text-[24px] font-bold',
    h6: 'text-[18px] font-bold',
    p: 'text-[15px] font-normal',
    sm: 'text-[12px] font-normal',
    xs: 'text-[11px] font-normal',
};
