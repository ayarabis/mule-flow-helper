const vscode = require("vscode");
const providers = require("./providers");
const actions = require("./actions");

/**
 * @param {{ subscriptions: vscode.Disposable[]; }} context
 */
function activate(context) {
  ["open2tab", "generateId", "apply"].forEach((command) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `mule-flow-helper.${command}`,
        actions[command]
      )
    );
  });

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      { language: "xml" },
      new providers.XMLCodeLensProvider()
    )
  );
}

exports.activate = activate;
