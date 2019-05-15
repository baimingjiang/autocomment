import * as vscode from 'vscode';
import {Util} from '../utils/Util';

export class AutoHeadComment {
    public static init(context: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeTextDocument(event => {
            if(this.checkComment(event)){
                
            }
        })

        let disposable = vscode.commands.registerCommand('extension.insertautoheadcomment', () => {
            vscode.window.showInformationMessage('Hello World!');
            var editor = vscode.window.activeTextEditor as vscode.TextEditor;
            var document = editor.document;

            var range: vscode.Range = new vscode.Range(
                        new vscode.Position(0, 0),
                        new vscode.Position(document.lineCount, 10000));
            var text = document.getText(range);

            for (var i = 1; i < document.lineCount; i ++) {
                var textLine = document.lineAt(i);
                var str = textLine.text;
                if (str === "--==============================--") {
                    var insertLine = i - 1;
                    editor.edit(function (edit) {
                        var insertStr : string = "    --@modify:" + Util.getInstance().getAuthor() +  " at " + Util.getInstance().getCurDate() + "\n";
                        edit.insert(new vscode.Position(insertLine, 0), insertStr);
                    });
                }
            }

        });
    
        context.subscriptions.push(disposable);
    }

    private static checkComment(event: vscode.TextDocumentChangeEvent): Boolean {
        var ret : Boolean = false;

        var document = event.document;

        var curentLine = event.contentChanges[0].range.start.line;
        var lineText = document.lineAt(curentLine).text;

        if (document.languageId === "lua") {
            if (event.contentChanges.length === 1) {
                if (event.contentChanges[0].text === "-") {
                    if (lineText.trim() === "---") {
                        // var range: vscode.Range = new vscode.Range(
                        //     new vscode.Position(curentLine + 1, 0),
                        //     new vscode.Position(document.lineCount, 10000));
                        // var text = document.getText(range);

                        var insterText = this.createLuaHeadCommentString(document);
                        var editor = vscode.window.activeTextEditor as vscode.TextEditor;
                        editor.edit(function (edit) {
                            edit.insert(event.contentChanges[0].range.start, insterText);
                        });
                    }
                }
            }
        }
        else if (document.languageId == "cpp") {
            if (event.contentChanges.length === 1) {
                if (event.contentChanges[0].text === "/") {

                    if (lineText.trim() === "/*/") {
                        var insterText = this.createCppHeadCommentString(document);
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
        ret += tabStr+"@time: "+ Util.getInstance().getCurDate() + "\n";
        ret += tabStr+"@autor: " + Util.getInstance().getAuthor() + "\n";
        ret += tabStr+"@return \n";
        ret += "--==============================-";
        
        return ret;
    }

    private static createCppHeadCommentString(document : vscode.TextDocument) {
        var tabStr : string = "    "

        var ret = "\n==============================\n";
        ret += tabStr+"@file: " + Util.getInstance().getFileName(document) + "\n";
        ret += tabStr+"@desc: \n";
        ret += tabStr+"@time: "+ Util.getInstance().getCurDate() + "\n";
        ret += tabStr+"@autor: " + Util.getInstance().getAuthor() + "\n";
        ret += tabStr+"@return \n";
        ret += "==============================\n*";
        
        return ret;

    }
}