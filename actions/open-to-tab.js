const vscode = require("vscode");
const util = require("../util");

/**
 * @param {string} name doc:name
 */
async function open2tab(name) {
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;

  const content = editor.document.getText();

  const re = new RegExp(
    `\\s<flow\\s+name="${util.escapeRegExp(name)}[^>]*>[\\s\\S]*?(<\\/flow>)`,
    "gms"
  );

  const match = content.match(re);

  const element = match[0];

  const index = content.indexOf(element);
  const position = document.positionAt(index);
  const matchedLines = element.split("\n");

  const startLine = document.lineAt(position.line).lineNumber;
  const endLine = document.lineAt(
    position.line + matchedLines.length - 1
  ).lineNumber;

  const filePath = vscode.workspace.asRelativePath(document.uri);
  const result = `<!-- codebutter:${filePath}[${startLine},${endLine}] -->\n${match[0]}`;

  let doc = await vscode.workspace.openTextDocument({
    content: result,
    language: "xml",
  });

  await vscode.window.showTextDocument(doc, {
    preview: true,
  });
}
exports.open2tab = open2tab;
