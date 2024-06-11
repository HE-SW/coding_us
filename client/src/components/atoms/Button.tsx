import { HTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';
import classNames from 'classnames';
export function FormButton({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
    const { pending } = useFormStatus();
    return (
        <button
            className={classNames(
                'bg-blue-500 hover:bg-blue-600 shadow-black shadow-sm rounded-lg text-white h-8',
                className
            )}
            disabled={pending}
            {...props}
        >
            {pending ? '...loading' : children}
        </button>
    );
}
