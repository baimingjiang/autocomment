import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import * as exec from 'child_process';
import { stringify } from 'querystring';

export class Util {
    private static instance : Util;

    private constructor() {}

    static getInstance() : Util {
        if (!this.instance) {
            this.instance = new Util();
        }

        return this.instance;
    }

    public getProjectPath(document : vscode.TextDocument) :string {
        if (!document) {
            document = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : document;
        }
    
        if (!document) {
            this.showError("当前激活的编辑器不是文件或者没有文件被打开！")
            return "";
        }

        let currentFile = document.uri.fsPath;
        let projectPath = null;

        var workspaceFolders :string[] = [];

        if (vscode.workspace.workspaceFolders) {
            for(var i = 0; i < vscode.workspace.workspaceFolders.length; i ++) {
                workspaceFolders[i] = vscode.workspace.workspaceFolders[i].uri.path;
            }
        }
        

        if (Object.keys(workspaceFolders).length == 1 && workspaceFolders[0] === vscode.workspace.rootPath) {
            var rootPath = workspaceFolders[0];
            var files = fs.readdirSync(rootPath);
            workspaceFolders = files.filter(name => !/^\./g.test(name)).map(name => path.resolve(rootPath, name));
        }

        workspaceFolders.forEach(folder => {
            if (currentFile.indexOf(folder) === 0) {
                projectPath = folder;
            }
        });

        if (!projectPath) {
            this.showError("获取工程路径异常")

            return "";
        }

        return projectPath;
    }

    public showError(info : string) {
        vscode.window.showErrorMessage(info);
    }

    public getCurData() : string {
        var ret : string = "";

        var date: Date = new Date();
        ret = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

        return ret;
    }

    public getFileName(document : vscode.TextDocument) : string {
        var ret : string = "";
        var filePath = document.fileName;

        var fileNameArr = filePath.split("\/");
        ret = fileNameArr[fileNameArr.length - 1]

        return ret;
    }

};

