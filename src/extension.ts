import * as vscode from "vscode";
import { exportedComponent, singleComponent } from "./service";

export function activate(context: vscode.ExtensionContext) {
  let singleCreate = vscode.commands.registerCommand(
    "create-component.createSingleComponent",
    singleComponent
  );
  let compositeCreate = vscode.commands.registerCommand(
    "create-component.createExportedReactComponent",
    exportedComponent
  );

  context.subscriptions.push(singleCreate);
  context.subscriptions.push(compositeCreate);
}

// This method is called when your extension is deactivated
export function deactivate() {}
