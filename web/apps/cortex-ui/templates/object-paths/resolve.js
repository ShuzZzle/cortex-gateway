
const range = (n) => n <= 0 ? [] : Array(n).fill(null).map((_, i) => i);
const empty = (n) => "".padStart(n, " ");
const indent = (text, n = 1) => empty(n * 2) + text.replace(/\n/g, `\n${empty(n * 2)}`);

const templateInferBlock = (n) => `PathLike extends \`${range(n).map(n => `$\{infer Key${n}}`).join("/")}\``;
const templateNeverBlock = () => ": never";
const templateDefinitionBlock = (n, max) => `type Resolve${n}<Source, PathLike extends Path<Source>> = ${n === max - 1 ? "" : `Resolve${n + 1}<Source, PathLike> | (\n  `}${templateInferBlock(n + 2)}`;
const templateConditionBlock = (n) => `? Key${n} extends keyof Source${range(n).map(n => `[Key${n}]`).join("")}`;
const templateResolveBlock = (n) => `? Source${range(n).map(n => `[Key${n}]`).join("")} : never`

function template({ depth: maxDepth }) {
  const blocks = range(maxDepth - 1).map(depth => {
    const head = templateDefinitionBlock(depth, maxDepth - 1);
    const body = range(depth + 2).reverse().reduce((inner, n) => {
      return `${templateConditionBlock(n)}\n${indent(inner)}\n${templateNeverBlock()}`;
    }, templateResolveBlock(depth + 2));
    return `${head}\n${indent(body)}\n${depth === maxDepth - 2 ? "" : ")"};`
  });

  return `
import { Path } from "./object-path-${maxDepth}";

export type Resolve<Source, PathLike extends Path<Source>> = PathLike extends keyof Source ? Source[PathLike] : Resolve0<Source, PathLike>;

${blocks.join("\n\n")}
`.trim() + "\n";
}

module.exports = {
  name: "object-path-resolve",
  levels: [5, 6, 7, 8, 9, 10],
  template
}
