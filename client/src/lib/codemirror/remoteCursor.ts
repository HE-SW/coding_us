import {
    Decoration,
    DecorationSet,
    EditorView,
    StateEffect,
    StateField,
    ViewPlugin,
    WidgetType,
} from '@uiw/react-codemirror';

export interface RemoteCursor {
    lineNumber: number;
    column: number;
    clientId: string;
    color: string;
}

export const addRemoteCursorEffect = StateEffect.define<RemoteCursor[]>();

export const remoteCursorsField = StateField.define<RemoteCursor[]>({
    create() {
        return [];
    },
    update(cursors, tr) {
        for (let effect of tr.effects) {
            if (effect.is(addRemoteCursorEffect)) {
                return effect.value;
            }
        }
        return cursors;
    },
});

export const remoteCursorPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = this.buildDecorations(view);
        }

        update(update: { view: EditorView }) {
            this.decorations = this.buildDecorations(update.view);
        }

        buildDecorations(view: EditorView): DecorationSet {
            const remoteCursors = view.state.field(remoteCursorsField);
            let decorations = remoteCursors.map(({ lineNumber, column, clientId, color }) => {
                const line = view.state.doc.line(lineNumber);
                const pos = line.from + column;
                return Decoration.widget({
                    widget: new RemoteCursorWidget(clientId, color),
                    side: 0,
                }).range(pos);
            });
            return Decoration.set(decorations);
        }
    },
    {
        decorations: v => v.decorations,
    }
);

class RemoteCursorWidget extends WidgetType {
    clientId: string;
    color: string;

    constructor(clientId: string, color: string) {
        super();
        this.clientId = clientId;
        this.color = color;
    }

    toDOM(): HTMLElement {
        const cursor = document.createElement('span');
        cursor.className = 'cm-remote-cursor';
        cursor.style.borderLeft = `1px solid ${this.color}cc`;
        cursor.style.marginLeft = '-1px';
        cursor.style.height = '1.2em';
        cursor.style.pointerEvents = 'none';
        cursor.style.position = 'absolute';
        cursor.style.zIndex = '10';
        cursor.setAttribute('data-client-id', this.clientId);
        return cursor;
    }
}
