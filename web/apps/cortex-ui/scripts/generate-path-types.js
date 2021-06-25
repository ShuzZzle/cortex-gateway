const { promises: fs, existsSync } = require("fs");
const { resolve, dirname } = require("path");

function generateSourceFile(template, depth) {
  return template({ depth });
}

async function generateSourceFiles(template) {
  const { template: tmpl, name, levels, ext = ".ts" } = require(resolve("..", template));
  await Promise.all(levels
    .map(level => ({
      file: resolve("./src/generated", `${name}-${level}${ext}`),
      content: generateSourceFile(tmpl, level),
    }))
    .map(async ({ file, content }) => {
      const dir = dirname(file);
      if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file, content, "utf-8");
    })
  )
}

async function generateTemplates(path = ".") {
  const dir = resolve("./templates", path);
  const files = await fs.readdir(dir, { withFileTypes: true });
  if (!files) return;
  await Promise.all(files.map(file => generateSourceFiles(resolve(dir, file.name))));
}

(async () => {
  await generateTemplates("object-paths");
})();

