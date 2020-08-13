import * as vscode from 'vscode';
import * as path from 'path';
import { stringify } from 'querystring';


export function activate(context: vscode.ExtensionContext) {

	var termName = "Microbit";
	var term = vscode.window.createTerminal(termName);


	function sysPathToFile() {
		term.show();
		let fullFilePath = context.asAbsolutePath(path.join('resources', 'mypath.txt'));
		var text = "python.exe -c 'import sys; print(sys.path)' > " + fullFilePath;
		term.sendText(text);
	}


	function runPythonFile() {
		let pathToPythonScript = context.asAbsolutePath(path.join('resources', 'get_path.py'));
		var pythonCommand = "python.exe " + pathToPythonScript;
		const cp = require('child_process');
		cp.exec(pythonCommand, (err, stdout, stderr) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err) {
				console.log('error: ' + err);
			}
		});
	}


	function installBitbotModule() {
		term.show();
		var cmd = "pip install bitbotxl";
		term.sendText(cmd);
	}


	function getRepo() {
		term.show();
		var cmd = "(new-object System.Net.WebClient).DownloadFile('https://github.com/PhonicCanine/microbit/archive/master.zip', 'master.zip')";
		term.sendText(cmd);
		var cmd = "Expand-Archive -Force master.zip .";
		term.sendText(cmd);
		var cmd = "Rename-Item -Path 'microbit-master' -NewName 'microbit'";
		term.sendText(cmd);
		var cmd = "Remove-Item master.zip";
		term.sendText(cmd);

		var cmd = "(new-object System.Net.WebClient).DownloadFile('https://github.com/oivron/mbitutils/archive/master.zip', 'master.zip')";
		term.sendText(cmd);
		var cmd = "Expand-Archive -Force master.zip .";
		term.sendText(cmd);
		var cmd = "Rename-Item -Path 'mbitutils-master' -NewName 'mbitutils'";
		term.sendText(cmd);
		var cmd = "Remove-Item master.zip";
		term.sendText(cmd);
		var cmd = "Remove-Item mbitutils\\README.md";
		term.sendText(cmd);
	}
	let getRepoCommand = vscode.commands.registerCommand('extension.getRepo', function () {
		getRepo();
	});


	function installSettings() {
		term.show();
		let pathToSettings = context.asAbsolutePath("resources\\.vscode");

		var cmd = "Move-Item -Path " + pathToSettings + " -Destination .";
		term.sendText(cmd);
	}


	function prepareMicrobit() {
		sysPathToFile();
		setTimeout(function () { runPythonFile(); }, 1000);
		installBitbotModule();
		getRepo();
		installSettings();
	}
	let prepareMicrobitCommand = vscode.commands.registerCommand('extension.prepareMicrobit', function () {
		prepareMicrobit();
	});


	function flashMicrobit() {
		term.show();

		var text = "uflash \"" + vscode.window.activeTextEditor.document.fileName + "\"";
		term.sendText(text);

		const fs = require('fs');
		let fullFilePath = context.asAbsolutePath(path.join('resources', 'mypath.txt'));
		fs.readFile(fullFilePath, function read(err, data) {
			if (err) {
				throw err;
			}
			let content = data;

			var path = content + "\\bitbot.py";
			path = path.substr(2);
			var ufsCommand = "";
			var ufsCommandFull = ufsCommand.concat("ufs put " + path);
			term.sendText(ufsCommandFull);
		});
	}
	let flashMicrobitCommand = vscode.commands.registerCommand('extension.flashMicrobit', function () {
		flashMicrobit();
	});

}
