import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");

export async function singleComponent(uri: vscode.Uri) {
  if (!vscode.workspace) {
    return vscode.window.showErrorMessage("Please open a project folder first");
  }

  const fsPathOfCurrentFile = getfsPathOfCurrentFile();
  if (!fsPathOfCurrentFile && !uri) {
    vscode.window.showErrorMessage("No active editor.");
    return;
  }

  let currentFolder = uri ? uri.fsPath : path.dirname(fsPathOfCurrentFile);

  let fileName = await promptFileNameDialog();
  if (!fileName) return;
  fileName = capitalizeStartInitial(fileName);

  const filePath = path.join(currentFolder, fileName.concat(".tsx"));
  const fileContent = `const ${fileName} = () => {\n    return <div>make it awesome</div>\n}\nexport default ${fileName}`;

  await fs.writeFileSync(filePath, fileContent);
  const doc = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(doc);
}

function capitalizeStartInitial(fileName: string) {
  return fileName[0].toLocaleUpperCase().concat(fileName.slice(1));
}

async function promptFileNameDialog() {
  return await vscode.window.showInputBox({
    prompt: "Enter the file name:",
    placeHolder: "ExampleComponent",
    validateInput: (value) => {
      if (/ /g.test(value)) return "Cannot have spaces dude (-_-)";
      if (/^\d/.test(value))
        return "Do you really think you should name it that? starting with a number?";
      return "";
    },
  });
}

export async function exportedComponent(uri: vscode.Uri) {
  if (!vscode.workspace) {
    return vscode.window.showErrorMessage("Please open a project folder first");
  }

  const fsPathOfCurrentFile = getfsPathOfCurrentFile();
  if (!fsPathOfCurrentFile && !uri) {
    vscode.window.showErrorMessage("No active editor.");
    return;
  }

  let currentFolder = uri ? uri.fsPath : path.dirname(fsPathOfCurrentFile);

  let fileName = await promptFileNameDialog();
  if (!fileName) return;

  fileName = fileName[0].toLocaleUpperCase().concat(fileName.slice(1));
  const directoryName = "./" + fileName;
  const newDirectoryPath = vscode.Uri.joinPath(
    vscode.Uri.file(currentFolder),
    directoryName
  );

  try {
    if (!fs.existsSync(newDirectoryPath.fsPath)) {
      fs.mkdirSync(newDirectoryPath.fsPath);
      currentFolder = newDirectoryPath.fsPath;
    }
    vscode.window.showInformationMessage(
      `Directory "${directoryName}" created.`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to create directory: ${error as any}`
    );
  }

  const componentFilePath = path.join(currentFolder, fileName.concat(".tsx"));
  const componentFileContent = `const ${fileName} = () => {\n  return <div>make it awesome</div>\n}\n\nexport default ${fileName}`;

  const indexFilePath = path.join(currentFolder, "index.ts");
  const indexFileContent = `export { default } from './${fileName}'`;

  await fs.writeFileSync(componentFilePath, componentFileContent);
  await fs.writeFileSync(indexFilePath, indexFileContent);

  const doc = await vscode.workspace.openTextDocument(componentFilePath);
  await vscode.window.showTextDocument(doc);
}

function getfsPathOfCurrentFile() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) return undefined;
  return activeEditor.document.uri.fsPath;
}
