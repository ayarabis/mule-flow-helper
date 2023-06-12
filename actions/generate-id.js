const vscode = require("vscode");
const util = require("../util");
const { randomUUID } = require("crypto");

/**
 * @param {string} name doc:name
 */
function generateId(name) {
  const editor = vscode.window.activeTextEditor;
  const document = editor.document;
  const content = document.getText();

  const re = new RegExp(
    `<flow\\s+name="${util.escapeRegExp(name)}[^>]*>[\\s\\S]*?(<\\/flow>)`,
    "gms"
  );
  const match = content.match(re);
  const element = match[0];

  const index = content.indexOf(element);
  const position = document.positionAt(index);

  const result = element.replace(/doc:id=".*"/, `doc:id="${randomUUID()}"`);

  const startLine = document.lineAt(position.line);

  const matchedLines = result.split("\n");

  const endPosition = new vscode.Position(
    document.positionAt(index + result.length).line,
    matchedLines[matchedLines.length - 1].length
  );

  editor.edit((editBuilder) => {
    editBuilder.replace(
      new vscode.Range(
        new vscode.Position(
          startLine.lineNumber,
          startLine.firstNonWhitespaceCharacterIndex
        ),
        endPosition
      ),
      result
    );
  });
}

exports.generateId = generateId;
