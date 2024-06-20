import CodeMirror, { ReactCodeMirrorRef, EditorView } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './tooltip.css';
import { RemoteCursor, addRemoteCursorEffect, remoteCursorPlugin, remoteCursorsField } from './remoteCursor';
import { debounce, randomHexColorCode } from './utils';

type Props = {
    ref?: React.RefObject<ReactCodeMirrorRef | null>;
    socketRef: RefObject<ReturnType<typeof io>>;
};

export default function CodeEditor({ ref, socketRef }: Props) {
    const [value, setValue] = useState('');
    const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
    const colorRef = useRef(randomHexColorCode());
    const updateCode = useCallback(
        debounce((newValue: string) => {
            socketRef.current.emit('code-update', newValue);
        }),
        []
    );

    const onChange = useCallback(
        (val: string) => {
            setValue(val);
            updateCode(val);
        },
        [updateCode]
    );

    useEffect(() => {
        socketRef.current.on('code-update', newCode => {
            console.log(newCode);
            setValue(newCode);
        });

        socketRef.current.on('cursor-move', (data: RemoteCursor[]) => {
            setRemoteCursors(data.filter(v => v.clientId !== socketRef.current.id));
        });
    }, []);

    const emitCursorMove = useCallback(
        debounce((lineNumber: number, column: number) => {
            socketRef.current.emit('cursor-move', {
                lineNumber,
                column,
                clientId: socketRef.current.id,
                color: colorRef.current,
            });
        }, 300),
        []
    );

    const handleEditorUpdate = (update: any) => {
        if (update.selectionSet) {
            const cursorPosition = update.state.selection.main.head;
            const line = update.state.doc.lineAt(cursorPosition);
            const column = cursorPosition - line.from;
            const lineNumber = line.number;
            emitCursorMove(lineNumber, column);
        }
    };

    useEffect(() => {
        if (ref?.current) {
            ref.current.view?.dispatch({
                effects: addRemoteCursorEffect.of(remoteCursors),
            });
        }
    }, [remoteCursors]);

    return (
        <>
            <CodeMirror
                ref={ref}
                value={value}
                theme={vscodeDark}
                className="h-full"
                height="100%"
                onBlur={() => {
                    // 포커스 아웃되면 툴팁 삭제 기능
                }}
                extensions={[
                    javascript({ jsx: true }),
                    EditorView.updateListener.of(handleEditorUpdate),
                    remoteCursorsField,
                    remoteCursorPlugin,
                ]}
                onChange={onChange}
            />
        </>
    );
}
