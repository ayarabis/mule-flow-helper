const { randomUUID } = require("crypto");
const { basename } = require("path");
const vscode = require("vscode");

async function duplicate(args) {
  const filePath = args.path;

  const dir = filePath.split("/").slice(0, -1).join("/");
  const fileName = basename(filePath);
  const ext = fileName.split(".").pop();

  const newFileName = fileName.replace(`.${ext}`, `-copy.${ext}`);
  const newFilePath = `${dir}/${newFileName}`;

  // get content
  const doc = await vscode.workspace.openTextDocument(filePath);
  let content = doc.getText();

  // replce all doc:id with a new one
  content = content.replace(/doc:id=".*"/, `doc:id="${randomUUID()}"`);

  // create new file
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(newFilePath),
    new TextEncoder().encode(content)
  );

  vscode.workspace.openTextDocument(newFilePath).then((doc) => {
    vscode.window.showTextDocument(doc);
  });
}

exports.duplicate = duplicate;
