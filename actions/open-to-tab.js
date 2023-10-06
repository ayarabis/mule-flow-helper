const vscode = require("vscode");
const util = require("../util");

/**
 * @param {string} name doc:name
 * @param {import("vscode").TextLine} line start line fo the element
 */
async function open2tab(name, line) {
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;

  const range = new vscode.Range(
    line.range.start,
    new vscode.Position(document.lineCount, 1)
  );
  const content = editor.document.getText(range);

  const re = new RegExp(
    `\\s+<(munit:test|(sub-)?flow)[\\s\\S]+name="${util.escapeRegExp(
      name
    )}"(.*?<\\/(munit:test|(sub-)?flow)>)`,
    "gms"
  );

  const match = content.match(re);
  const element = match[0];

  const matchedLines = element.split("\n");

  const endLine = document.lineAt(
    line.lineNumber + matchedLines.length - 1
  ).lineNumber;

  const filePath = vscode.workspace.asRelativePath(document.uri);
  const result = `<!-- mule-flow-helper:${filePath}[${
    line.lineNumber - 1
  },${endLine}] -->\n${match[0]}`;

  let doc = await vscode.workspace.openTextDocument({
    content: result,
    language: "xml",
  });

  await vscode.window.showTextDocument(doc, {
    preview: true,
  });
}
exports.open2tab = open2tab;
