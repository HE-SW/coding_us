import CodeMirror, { ViewUpdate, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { Ref, useCallback, useState } from 'react';

type Props = {
    minHeight?: string;
    ref?: Ref<ReactCodeMirrorRef>;
};

export default function CodeEditor({ minHeight, ref }: Props) {
    const [value, setValue] = useState(`function solution() {
    var answer;
    return answer;
}`);
    const onChange = useCallback((val: string, viewUpdate: ViewUpdate) => {
        setValue(val);
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
