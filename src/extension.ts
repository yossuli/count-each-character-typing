import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let totalKeyPresses = context.workspaceState.get("totalKeyPresses", 0);
  let totalCharacters = context.workspaceState.get("totalCharacters", 0);
  console.log("Congratulations, your extension is now active!");

  let disposable = vscode.commands.registerCommand(
    "extension.calculateTypingEfficiency",
    function () {
      vscode.window
        .showInformationMessage(
          "DO you want to reset your typing efficiency data ?",
          {},
          "yes"
        )
        .then((value) => {
          if (value === "yes") {
            totalKeyPresses = 0;
            totalCharacters = 0;
            console.log("reset data");
            context.workspaceState.update("totalKeyPresses", totalKeyPresses);
            context.workspaceState.update("totalCharacters", totalCharacters);
          }
        });
    }
  );

  context.subscriptions.push(disposable);

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (event.contentChanges[0].text !== "") {
        totalKeyPresses++;
        totalCharacters += event.contentChanges[0].text.length;
        context.workspaceState.update("totalKeyPresses", totalKeyPresses);
        context.workspaceState.update("totalCharacters", totalCharacters);
        console.log(
          `[info] ${new Date().toLocaleTimeString()} totalKeyPresses: ${totalKeyPresses}, totalCharacters: ${totalCharacters}`
        );
      }
      vscode.window.setStatusBarMessage(
        `keyPresses: ${totalKeyPresses} characters: ${totalCharacters} efficiency: ${
          Math.round((totalCharacters / totalKeyPresses) * 100) / 100
        }`
      );
    },
    null,
    context.subscriptions
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
