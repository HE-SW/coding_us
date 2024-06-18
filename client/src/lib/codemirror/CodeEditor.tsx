import CodeMirror, {
    ViewUpdate,
    ReactCodeMirrorRef,
    showTooltip,
    EditorState,
    Tooltip,
    StateField,
} from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './tooltip.css';
import { useLocation, useSearchParams } from 'react-router-dom';

type Props = {
    ref?: React.RefObject<ReactCodeMirrorRef | null>;
    socketRef: RefObject<ReturnType<typeof io>>;
};
type CursorPosition = {
    userId: string;
    pos: number;
    color: string;
};

type SelectionArea = {
    userId: string;
    from: number;
    to: number;
    color: string;
};

export default function CodeEditor({ ref, socketRef }: Props) {
    const [value, setValue] = useState(`function solution() {
    var answer;
    return answer;
}`);
    const params = useSearchParams();
    const userId = params[0].get('id') as string;

    const updateCode = useCallback(
        debounce((newValue: string) => {
            socketRef.current.emit('code-update', newValue);
        }),
        []
    );

    const onChange = useCallback(
        (val: string, viewUpdate: ViewUpdate) => {
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
    }, []);

    const onUpdate = useCallback((viewUpdate: ViewUpdate) => {
        const { view, state } = viewUpdate;
        if (view.hasFocus) {
            const tooltip = getCursor(state, userId);
            const area = getSelectionArea(state, userId);
        }
    }, []);

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
                onUpdate={onUpdate}
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

function getCursor(state: EditorState, userId: string): CursorPosition[] {
    return state.selection.ranges
        .filter(range => range.empty)
        .map(range => {
            return {
                pos: range.head,
                userId,
                color: '#f9af4dcc',
            };
        });
}

function getCursorTooltips(state: EditorState, textContent: string): readonly Tooltip[] {
    return state.selection.ranges
        .filter(range => range.empty)
        .map(range => {
            let line = state.doc.lineAt(range.head);
            // let text = line.number + ':' + (range.head - line.from);
            return {
                pos: range.head,
                above: true,
                strictSide: false,
                arrow: false,
                create: () => {
                    let dom = document.createElement('div');
                    dom.className = 'cm-tooltip-cursor';
                    dom.textContent = textContent;
                    dom.style.backgroundColor = '#f9af4dcc';
                    return { dom };
                },
            };
        });
}

function getSelectionArea(state: EditorState, userId: string) {
    return state.selection.ranges
        .filter(range => !range.empty)
        .map(range => {
            const { from, to } = range;
            return {
                from,
                to,
                userId,
                color: '#f9af4dcc',
            };
        });
}
