const range = (n) => n <= 0 ? [] : Array(n).fill(null).map((_, i) => i);
const empty = (n) => "".padStart(n, " ");
const indent = (text, n = 1) => empty(n * 2) + text.replace(/\n/g, `\n${empty(n * 2)}`);
const keyAccess = (n, key= "Key") => range(n).map(n => `[${key}${n}]`).join("");

function template({ depth: maxDepth }) {
  const blocks = range(maxDepth).map(depth => {
    const head = `type Path${depth}<Source> = ${depth === maxDepth - 1 ? "" : `Path${depth + 1}<Source> | `}`;
    const body = range(depth + 1).reverse().reduce((inner, n) => {
      return `{\n  [Key${n} in keyof Source${keyAccess(n)}]: ${indent(inner).trim()};\n}[keyof Source${keyAccess(n)}]`
    }, `\`${range(depth + 1).map(n => `$\{Key${n} & string}`).concat(`$\{keyof Source${keyAccess(depth + 1)} & string}`).join("/")}\``);
    return `${head}${body.trim()};`
  });

  return `
export type Path<Source> = (keyof Source & string) | Path0<Source>;

${blocks.join("\n\n")}
`.trim() + "\n";
}

module.exports = {
  name: "object-path",
  levels: [5, 6, 7, 8, 9, 10],
  template
}
