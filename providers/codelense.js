const vscode = require("vscode");

class XMLCodeLensProvider {
  /**
   * @param {import("vscode").TextDocument} document
   * @returns {import("vscode").CodeLens[]}
   */
  provideCodeLenses(document) {
    const codeLenses = [];

    const content = document.getText();

    if (content.includes("<mule")) {
      // only show code lenses for flow and subflow elements in Mule config files
      const re = new RegExp('<(flow|subflow)( |\n).*(\n?).*">', "gm");

      const match = content.matchAll(re);

      let m = null;
      let i = 0;
      do {
        m = match.next();
        if (m.value) {
          const name = m.value[0].match(/name=\"(.*?)(")/)[1];

          const line = document.lineAt(document.positionAt(m.value.index).line);
          const range = new vscode.Range(
            line.lineNumber,
            line.firstNonWhitespaceCharacterIndex,
            line.lineNumber,
            line.range.end.character
          );
          const openLense = new vscode.CodeLens(range);
          openLense.command = {
            title: "Open to Tab",
            command: "mule-flow-helper.open2tab",
            arguments: [name],
          };
          codeLenses.push(openLense);

          const generateLens = new vscode.CodeLens(range);
          generateLens.command = {
            title: "Generate doc:id",
            command: "mule-flow-helper.generateId",
            arguments: [name],
          };
          codeLenses.push(generateLens);
        }
        i++;
      } while (!m.done);
    } else {
      const re = new RegExp(
        "<!-- codebutter:(.*?)(\\[(\\d+),(\\d+)\\])? -->",
        "gm"
      );

      const result = content.matchAll(re);

      if (result) {
        const match = result.next().value;

        const fn = match[1];
        const startLine = parseInt(match[3]);
        const endLine = parseInt(match[4]);

        const line = document.lineAt(0);
        const range = new vscode.Range(
          line.lineNumber,
          line.firstNonWhitespaceCharacterIndex,
          line.lineNumber,
          line.range.end.character
        );

        const args = [fn, startLine, endLine];
        codeLenses.push(
          createCodeLens(range, "Apply", "mule-flow-helper.apply", args)
        );
        codeLenses.push(
          createCodeLens(range, "Append", "mule-flow-helper.apply", [
            ...args,
            true,
          ])
        );
      }
    }

    return codeLenses;
  }
}

/**
 * @param {vscode.Range} range
 * @param {string} title
 * @param {string} command
 * @param {any[]} args
 */
function createCodeLens(range, title, command, args) {
  const codeLens = new vscode.CodeLens(range);
  codeLens.command = {
    title: title,
    command: command,
    arguments: args,
  };
  return codeLens;
}

exports.XMLCodeLensProvider = XMLCodeLensProvider;
