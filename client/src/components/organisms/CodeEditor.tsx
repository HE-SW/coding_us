import CodeMirror, { ViewUpdate, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { Ref, RefObject, useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
type Props = {
    ref?: Ref<ReactCodeMirrorRef>;
    socketRef: RefObject<ReturnType<typeof io>>;
};

export default function CodeEditor({ ref, socketRef }: Props) {
    const [value, setValue] = useState(`function solution() {
    var answer;
    return answer;
}`);

    const updateCode = debounce((newCode: string) => {
        socketRef.current.emit('code-update', newCode);
    });

    const onChange = useCallback(
        (val: string, viewUpdate: ViewUpdate) => {
            setValue(val);
            updateCode(val);
        },
        [updateCode]
    );

    useEffect(() => {
        socketRef.current.on('code-update', newCode => {
            setValue(newCode);
        });
    }, []);

    return (
        <>
            <CodeMirror
                ref={ref}
                value={value}
                theme={vscodeDark}
                className="h-full"
                height="100%"
                extensions={[javascript({ jsx: true })]}
                onChange={onChange}
            />
        </>
    );
}

function debounce(func: Function, timeout = 300) {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
