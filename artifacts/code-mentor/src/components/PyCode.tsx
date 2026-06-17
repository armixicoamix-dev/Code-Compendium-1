import { highlightPython } from "@/lib/highlight";

interface PyCodeProps {
  code: string;
  className?: string;
  filename?: string;
  hideChrome?: boolean;
}

export function PyCode({ code, className = "", filename = "main.py", hideChrome }: PyCodeProps) {
  const lines = code.split("\n");
  const lineNumbers = lines.map((_, i) => i + 1).join("\n");

  if (hideChrome) {
    return (
      <pre
        className={`code-block ${className}`}
        dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
      />
    );
  }

  return (
    <div className={`code-editor ${className}`}>
      <div className="code-editor__chrome">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="code-editor__filename">{filename}</span>
        <span className="code-editor__lang">Python</span>
      </div>
      <div className="code-editor__body">
        <div className="code-editor__gutter">{lineNumbers}</div>
        <div
          className="code-editor__code"
          dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
        />
      </div>
    </div>
  );
}
