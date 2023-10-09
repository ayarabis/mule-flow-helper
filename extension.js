const vscode = require("vscode");
const providers = require("./providers");
const actions = require("./actions");

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {
  ["open2tab", "generateId", "apply", "duplicate"].forEach((command) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `mule-flow-helper.${command}`,
        actions[command]
      )
    );
  });

  ["xml", "mule-xml"].forEach((lang) => {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        { language: lang },
        new providers.XMLCodeLensProvider()
      )
    );
  });
}

exports.activate = activate;
