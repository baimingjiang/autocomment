import * as vscode from 'vscode';
import {Util} from '../utils/Util';

export class AutoHeadComment {
    public static init(context: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeTextDocument(event => {
            if(this.checkComment(event)){
                
            }
        })
    }

    private static checkComment(event: vscode.TextDocumentChangeEvent): Boolean {
        var ret : Boolean = false;

        if (event.document.languageId === "lua") {
            if (event.contentChanges.length === 1) {
                if (event.contentChanges[0].text === "-") {

                    var curentLine = event.contentChanges[0].range.start.line;
                    let lineText = event.document.lineAt(curentLine).text;

                    if (lineText.trim() === "---") {
                        // var range: vscode.Range = new vscode.Range(
                        //     new vscode.Position(curentLine + 1, 0),
                        //     new vscode.Position(event.document.lineCount, 10000));
                        // var text = event.document.getText(range);

                        var insterText = this.createLuaHeadCommentString(event.document);
                        var editor = vscode.window.activeTextEditor as vscode.TextEditor;
                        editor.edit(function (edit) {
                            edit.insert(event.contentChanges[0].range.start, insterText);
                        });
                    }
                }
            }
        }
        else if (event.document.languageId == "cpp") {
            if (event.contentChanges.length === 1) {
                if (event.contentChanges[0].text === "/") {

                    var curentLine = event.contentChanges[0].range.start.line;
                    let lineText = event.document.lineAt(curentLine).text;

                    if (lineText.trim() === "/*/") {
                        var insterText = this.createCppHeadCommentString(event.document);
                        var editor = vscode.window.activeTextEditor as vscode.TextEditor;
                        editor.edit(function (edit) {
                            edit.insert(event.contentChanges[0].range.start, insterText);
                        });
                    }
                }
            }
        }

        return ret;
    }

    private static createLuaHeadCommentString(document : vscode.TextDocument) {
        
        var tabStr : string = "    --";
        
        var ret = "==============================--\n";
        ret += tabStr+"@file: " + Util.getInstance().getFileName(document) + "\n";
        ret += tabStr+"@desc: \n";
        ret += tabStr+"@time: "+ Util.getInstance().getCurData() + "\n";
        ret += tabStr+"@autor: \n";
        ret += tabStr+"@return \n";
        ret += "--==============================-";
        
        return ret;
    }

    private static createCppHeadCommentString(document : vscode.TextDocument) {
        var tabStr : string = "    "

        var ret = "\n==============================\n";
        ret += tabStr+"@file: " + Util.getInstance().getFileName(document) + "\n";
        ret += tabStr+"@desc: \n";
        ret += tabStr+"@time: "+ Util.getInstance().getCurData() + "\n";
        ret += tabStr+"@autor: \n";
        ret += tabStr+"@return \n";
        ret += "==============================\n*";
        
        return ret;

    }
}