const { randomUUID } = require("crypto");
const vscode = require("vscode");

/**
 * Apply the content of the current file to the file specified in the comment
 * @param {string} fn file name
 * @param {number} start start line
 * @param {number} end end line
 */
async function apply(fn, start, end, append = false) {
  let editor = vscode.window.activeTextEditor;

  let content = editor.document.getText().split("\n").slice(1).join("\n");
  await clearAndClose(editor);

  const document = await openRelativePath(fn);

  editor = vscode.window.activeTextEditor;

  const lastLineLength = document.lineAt(end).text.length;

  if (append) {
    var ids = (content.match(/doc:id=".*?"/g) || []);
    for(let i =0;i < ids.length;i++){
      content = content.replace(ids[i], `doc:id="${randomUUID()}"`);
    }
    const docName = content.match(/name="(.*?)"/)[1];
    if (editor.document.getText().includes(docName)) {
      content = content.replace(docName, docName + "-copy");
    }

    await editor.edit((editBuilder) => {
      editBuilder.insert(
        new vscode.Position(end, lastLineLength),
        "\n" + content
      );
    });
  } else {
    const range = new vscode.Range(
      new vscode.Position(start + 1, 0),
      new vscode.Position(end, lastLineLength)
    );

    editor.revealRange(range);

    await editor.edit((editBuilder) => {
      editBuilder.replace(range, content);
    });
  }
}

/**
 * Open a file relative to the current workspace
 * @param {string} relativePath
 * @returns {Promise<vscode.TextDocument>}
 */
async function openRelativePath(relativePath) {
  const currentWorkspacePath = vscode.workspace.workspaceFolders[0].uri; // Get the current workspace path
  const fileUri = currentWorkspacePath.with({
    path: currentWorkspacePath.path + "/" + relativePath,
  }); // Create a URI for the relative path

  const document = await vscode.workspace.openTextDocument(fileUri);
  await vscode.window.showTextDocument(document);
  return document;
}

/**
 * @param {vscode.TextEditor} editor
 */
async function clearAndClose(editor) {
  const wholeDocumentRange = editor.document.validateRange(
    new vscode.Range(0, 0, Infinity, Infinity)
  );
  await editor.edit((editBuilder) => {
    editBuilder.replace(wholeDocumentRange, "");
  });

  await vscode.commands.executeCommand("workbench.action.closeActiveEditor", [
    true,
  ]);
}

exports.apply = apply;
