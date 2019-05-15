// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {AutoHeadComment} from "./ext/AutoHeadComment";

import * as HelloWorld from "./ext/HellorWorld";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "first-extension" is now active!');
	HelloWorld.test(context);
	AutoHeadComment.init(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('Your extension "first-extension" is deactivate!');
}
