import { useRef, useCallback, useEffect, useMemo } from "react";
import { highlightPython } from "@/lib/highlight";

interface SmartCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
  "data-testid"?: string;
}

function computeLineNumbers(value: string): string {
  const count = value.split("\n").length;
  return Array.from({ length: Math.max(count, 1) }, (_, i) => i + 1).join("\n");
}

function handleTabKey(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;

  if (start === end) {
    // No selection: insert 4 spaces
    const next = value.slice(0, start) + "    " + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 4;
    });
  } else {
    // Selection: indent each selected line
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);
    const indented = selected.replace(/^/gm, "    ");
    const next = before + indented + after;
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = start;
      el.selectionEnd = end + (indented.length - selected.length);
    });
  }
}

function handleShiftTabKey(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);
  const dedented = selected.replace(/^    /gm, "");
  const next = before + dedented + after;
  onChange(next);
  requestAnimationFrame(() => {
    el.selectionStart = start;
    el.selectionEnd = end - (selected.length - dedented.length);
  });
}

function handleEnterKey(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;

  // Get current line text up to cursor
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const currentLine = value.slice(lineStart, start);

  // Find leading whitespace of current line
  const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";

  // If current line ends with colon (ignoring inline comment/space), add extra indent
  const lineContent = currentLine.replace(/#.*$/, "").trimEnd();
  const extraIndent = lineContent.endsWith(":") ? "    " : "";

  const insert = "\n" + indent + extraIndent;
  const next = value.slice(0, start) + insert + value.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    const newPos = start + insert.length;
    el.selectionStart = el.selectionEnd = newPos;
  });
}

function handleBackspaceKey(
  el: HTMLTextAreaElement,
  value: string,
  onChange: (v: string) => void,
): boolean {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  if (start !== end) return false; // let browser handle selection deletion

  // If the 4 chars before cursor are spaces, delete 4 at once
  if (start >= 4 && value.slice(start - 4, start) === "    ") {
    const next = value.slice(0, start - 4) + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start - 4;
    });
    return true;
  }
  return false;
}

export function SmartCodeEditor({
  value,
  onChange,
  placeholder = "# Напиши Python-код здесь\n",
  minHeight = 280,
  className = "",
  "data-testid": testId,
}: SmartCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const highlighted = useMemo(
    () => highlightPython(value + "\n"),
    [value],
  );
  const lineNumbers = useMemo(() => computeLineNumbers(value), [value]);

  // Sync scroll between textarea and pre
  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Auto-grow container height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
  }, [value, minHeight]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;

      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          handleShiftTabKey(el, value, onChange);
        } else {
          handleTabKey(el, value, onChange);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleEnterKey(el, value, onChange);
        return;
      }

      if (e.key === "Backspace") {
        if (handleBackspaceKey(el, value, onChange)) {
          e.preventDefault();
        }
        return;
      }
    },
    [value, onChange],
  );

  return (
    <div className={`smart-editor ${className}`}>
      <div className="smart-editor__chrome">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="code-editor__filename">solution.py</span>
        <span className="code-editor__lang">Python · редактор</span>
      </div>
      <div className="smart-editor__body">
        <div className="code-editor__gutter" aria-hidden="true">
          {lineNumbers}
        </div>
        <div className="smart-editor__code-area">
          <pre
            ref={preRef}
            className="smart-editor__highlight"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={placeholder}
            className="smart-editor__textarea"
            style={{ minHeight }}
            data-testid={testId}
          />
        </div>
      </div>
    </div>
  );
}
