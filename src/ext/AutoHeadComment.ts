import * as vscode from 'vscode';
import {Util} from '../utils/Util';

export class AutoHeadComment {
    private static splitLineStrForLua : string = "--==============================--";

    public static init(context: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeTextDocument(event => {
            if(this.insertComment(event)){ }
        })

        let disposable = vscode.commands.registerCommand('extension.insertmodifycomment', () => {
            vscode.window.showInformationMessage('Insert modified comments by ' + Util.getInstance().getAuthor());
            this.insertModifyComment()
        });
        context.subscriptions.push(disposable);

        let disposable1 = vscode.commands.registerCommand("extension.insertautoheadcomment", () => {
            vscode.window.showInformationMessage('Insert head comments by ' + Util.getInstance().getAuthor());
            this.insertAutoHeadComment()
        });
        context.subscriptions.push(disposable1);
    }

    private static insertComment(event: vscode.TextDocumentChangeEvent): Boolean {
        var ret : Boolean = false;

        var document = event.document;
        var editor = vscode.window.activeTextEditor as vscode.TextEditor;

        if (editor === null) {
            return false;
        }

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
                        editor.edit(function (edit) {
                            // edit.delete(event.contentChanges[0].range);
                            // edit.insert(new vscode.Position(document.lineAt(curentLine).lineNumber, 0), insterText);

                            edit.replace(document.lineAt(curentLine).range, insterText);
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
                            edit.replace(document.lineAt(curentLine).range, insterText);
                        });
                    }
                }
            }
        }

        return ret;
    }

    private static insertAutoHeadComment() {
        var editor = vscode.window.activeTextEditor as vscode.TextEditor;
        
        if (editor) {
            var document = editor.document;
            var insterText = this.createLuaHeadCommentString(document);

            editor.edit(function (edit) {
                edit.insert(new vscode.Position(0, 0), insterText);
            });
        }
    }

    private static insertModifyComment() {
        var editor = vscode.window.activeTextEditor as vscode.TextEditor;
        if (editor) {
            var document = editor.document;

            var range: vscode.Range = new vscode.Range(
                        new vscode.Position(0, 0),
                        new vscode.Position(document.lineCount, 10000));
            var text = document.getText(range);
    
            for (var i = 1; i < document.lineCount; i ++) {
                var textLine = document.lineAt(i);
                var str = textLine.text;
                if (str === this.splitLineStrForLua) {
                    var insertLine = i - 1;
                    editor.edit(function (edit) {
                        var insertStr : string = "    --@modify:" + Util.getInstance().getAuthor() +  " at " + Util.getInstance().getCurDate() + "\n";
                        edit.insert(new vscode.Position(insertLine, 0), insertStr);
                    });
                }
            }
        }
    }

    private static createLuaHeadCommentString(document : vscode.TextDocument) {
        
        var tabStr : string = "    --";
        var ret : string = "";

        ret += this.splitLineStrForLua + "\n";
        ret += tabStr+"@file: " + Util.getInstance().getFileName(document) + "\n";
        ret += tabStr+"@desc: \n";
        ret += tabStr+"@time: "+ Util.getInstance().getCurDate() + "\n";
        ret += tabStr+"@autor: " + Util.getInstance().getAuthor() + "\n";
        ret += tabStr+"@return \n";
        ret += this.splitLineStrForLua;
        
        return ret;
    }

    private static createCppHeadCommentString(document : vscode.TextDocument) {
        var tabStr : string = "    "

        var ret = "\n/******************************\n";
        ret += tabStr+"@file: " + Util.getInstance().getFileName(document) + "\n";
        ret += tabStr+"@desc: \n";
        ret += tabStr+"@time: "+ Util.getInstance().getCurDate() + "\n";
        ret += tabStr+"@autor: " + Util.getInstance().getAuthor() + "\n";
        ret += tabStr+"@return \n";
        ret += "******************************\n*/";
        
        return ret;
    }

    private static createModifyCommentString() {
        var ret : string = "";

        ret = "    --@modify:" + Util.getInstance().getAuthor() +  " at " + Util.getInstance().getCurDate() + "\n";

        return ret;
    }
}