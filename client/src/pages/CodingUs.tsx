import CodeEditor from '../lib/codemirror/CodeEditor';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { io } from 'socket.io-client';
import Txt from '../components/atoms/Txt';
const handleStyle = 'bg-dark-600 active:bg-slate-400 transition-colors';
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || ''; // 서버 URL

export default function CodingUs() {
    const [output, setOutput] = useState<string>();
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    const socketRef = useRef(
        io(SOCKET_SERVER_URL, {
            withCredentials: true,
        })
    );

    useEffect(() => {
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });
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
            <div className="flex-[0_0_60px] flex justify-between items-center px-3">
                <div></div>
                <button className="bg-dark-200 px-5 py-[5px] rounded hover:bg-dark-300" onClick={onClickCodeRun}>
                    <Txt className="font-semibold text-dark-50">체점하기</Txt>
                </button>
            </div>
        );
    };

    const getOutPut = () => {
        'use server';
        return (
            <div className="h-full">
                <Txt>{output}</Txt>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-main-background text-white">
            <PanelGroup direction="horizontal" className="flex-1">
                <Panel>
                    <PanelGroup direction="vertical" className="flex-1">
                        <PanelGroup direction="horizontal" className="flex-1">
                            <Panel minSize={10} className="bg-dark-700">
                                <div className=" h-full">문제</div>
                            </Panel>
                            <PanelResizeHandle className={classNames(handleStyle, 'p-[2px]')} />
                            <Panel minSize={25}>
                                <PanelGroup direction="vertical">
                                    <Panel minSize={25}>
                                        <CodeEditor ref={editorRef} socketRef={socketRef} />
                                    </Panel>
                                    <PanelResizeHandle className={classNames(handleStyle, 'p-[2px]')} />
                                    <Panel minSize={25} defaultSize={25} className="bg-dark-700">
                                        {getOutPut()}
                                    </Panel>
                                </PanelGroup>
                            </Panel>
                        </PanelGroup>
                        {getBottomPanel()}
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className={classNames(handleStyle)} />
                <Panel defaultSize={20} maxSize={25}>
                    chat
                </Panel>
            </PanelGroup>
        </div>
    );
}
