const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await",
  "break", "class", "continue", "def", "del", "elif", "else", "except",
  "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield", "match", "case",
]);

const BUILTINS = new Set([
  "print", "len", "range", "int", "str", "float", "list", "dict",
  "tuple", "set", "bool", "type", "isinstance", "issubclass", "super",
  "abs", "min", "max", "sum", "any", "all", "map",
  "filter", "zip", "enumerate", "sorted", "reversed", "open", "input",
  "hasattr", "getattr", "setattr", "delattr", "callable", "id", "hash",
  "object", "Exception", "ValueError", "TypeError", "AttributeError",
  "ZeroDivisionError", "IndexError", "KeyError", "RuntimeError", "NotImplementedError",
  "FrozenInstanceError", "ABC", "ABCMeta", "abstractmethod", "dataclass", "field",
  "List", "Dict", "Tuple", "Optional", "Union", "Any", "Iterator", "Iterable",
  "Callable", "Type", "Generic", "TypeVar", "Self", "Protocol", "ClassVar",
  "frozen", "Enum", "auto", "property", "staticmethod", "classmethod",
  "round", "format", "repr", "next", "iter", "divmod",
]);

const SELF_LIKE = new Set(["self", "cls", "mcs"]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightPython(code: string): string {
  const lines = code.split("\n");
  const out: string[] = [];
  for (const line of lines) {
    out.push(highlightLine(line));
  }
  return out.join("\n");
}

function highlightLine(line: string): string {
  const result: string[] = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    const ch = line[i];

    if (ch === "#") {
      result.push(`<span class="com">${escapeHtml(line.slice(i))}</span>`);
      i = n;
      break;
    }

    if ((ch === "f" || ch === "F" || ch === "r" || ch === "R" || ch === "b" || ch === "B")
        && i + 1 < n && (line[i + 1] === '"' || line[i + 1] === "'")
        && (i === 0 || /[^\w]/.test(line[i - 1]))) {
      const quote = line[i + 1];
      let j = i + 2;
      while (j < n && line[j] !== quote) {
        if (line[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      if (j < n) j++;
      result.push(`<span class="str">${escapeHtml(line.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < n && line[j] !== quote) {
        if (line[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      if (j < n) j++;
      result.push(`<span class="str">${escapeHtml(line.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch) && (i === 0 || /[^\w]/.test(line[i - 1]))) {
      let j = i;
      while (j < n && /[0-9._]/.test(line[j])) j++;
      result.push(`<span class="num">${escapeHtml(line.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    if (ch === "@") {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_.]/.test(line[j])) j++;
      result.push(`<span class="deco">${escapeHtml(line.slice(i, j))}</span>`);
      i = j;
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const isFnCall = j < n && line[j] === "(";
      const prevTwo = line.slice(Math.max(0, i - 5), i);

      if (KEYWORDS.has(word)) {
        result.push(`<span class="kw">${escapeHtml(word)}</span>`);
      } else if (SELF_LIKE.has(word)) {
        result.push(`<span class="selfkw">${escapeHtml(word)}</span>`);
      } else if (BUILTINS.has(word)) {
        result.push(`<span class="builtin">${escapeHtml(word)}</span>`);
      } else if (/class\s+$/.test(prevTwo) || /^[A-Z]/.test(word)) {
        result.push(`<span class="cls">${escapeHtml(word)}</span>`);
      } else if (isFnCall || /def\s+$/.test(prevTwo)) {
        result.push(`<span class="fn">${escapeHtml(word)}</span>`);
      } else {
        result.push(escapeHtml(word));
      }
      i = j;
      continue;
    }

    result.push(escapeHtml(ch));
    i++;
  }

  return result.join("");
}
