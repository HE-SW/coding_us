import CodeEditor from '../components/organisms/CodeEditor';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { io } from 'socket.io-client';
const handleStyle = 'bg-gray-500 active:bg-slate-400 transition-colors';
const SOCKET_SERVER_URL = 'http://localhost:4040'; // 서버 URL

export default function CodingUs() {
    const [output, setOutput] = useState<string>();
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    const socketRef = useRef(
        io(SOCKET_SERVER_URL, {
            transports: ['websocket', 'polling'],
        })
    );

    useEffect(() => {
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const onClickCodeRun = () => {
        const code = editorRef.current?.view?.state.doc.toString();
        try {
            const result = eval(`(function() { ${code} return solution(); })()`);
            setOutput(`Result: ${JSON.stringify(result, null, 2)}`);
        } catch (e: any) {
            setOutput(`Error: ${e.message}`);
        }
    };

    const getBottomPanel = () => {
        return (
            <div className="flex-[0_0_60px] border-t-2 border-gray-500 flex justify-between items-center px-2">
                <div></div>
                <button className="bg-gray-500 w-32 rounded-sm hover:bg-gray-700 h-12" onClick={onClickCodeRun}>
                    코드 실행
                </button>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-white">
            <PanelGroup direction="horizontal" className="flex-1">
                <Panel minSize={10}>Left</Panel>
                <PanelResizeHandle className={classNames(handleStyle, 'p-1 ')} />
                <Panel minSize={25}>
                    <PanelGroup direction="vertical">
                        <Panel minSize={25}>
                            <CodeEditor ref={editorRef} socketRef={socketRef} />
                        </Panel>
                        <PanelResizeHandle className={classNames(handleStyle, 'p-1')} />
                        <Panel minSize={25} defaultSize={25}>
                            {output}
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className={classNames(handleStyle, 'p-1')} />
                <Panel minSize={10} defaultSize={15}>
                    Right
                </Panel>
            </PanelGroup>
            {getBottomPanel()}
        </div>
    );
}
