"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    var termName = "Microbit";
    var term = vscode.window.createTerminal(termName);
    function findPipLocation() {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { spawn } = require('child_process');
            const child = spawn('pip', ['-V']);
            try {
                let data = "";
                try {
                    for (var _c = __asyncValues(child.stdout), _d; _d = yield _c.next(), !_d.done;) {
                        const chunk = _d.value;
                        console.log('stdout: ' + chunk);
                        data += chunk;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                let error = "";
                try {
                    for (var _e = __asyncValues(child.stderr), _f; _f = yield _e.next(), !_f.done;) {
                        const chunk = _f.value;
                        console.error('stderr: ' + chunk);
                        error += chunk;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                const exitCode = yield new Promise((resolve, reject) => {
                    child.on('close', resolve);
                    let path = "";
                    path = data.substring(data.lastIndexOf(":") - 1, data.lastIndexOf("pip"));
                    console.log("Python third-party dir: " + path);
                    vscode.workspace.getConfiguration("python").update("thirdPartyModulesDirectory", path, vscode.ConfigurationTarget.Global);
                });
                if (exitCode) {
                    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
                }
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function getWorkspace() {
        var targetPath = "";
        try {
            if (typeof vscode.workspace.workspaceFolders !== 'undefined') {
                let workspace = vscode.workspace.workspaceFolders[0].uri.path;
                targetPath = (workspace).replace(/^\/|\/$/g, '');
                targetPath = targetPath.replace(/\//g, '\\\\');
                console.log("Workspace dir: " + targetPath);
                return targetPath;
            }
            else {
                vscode.window.showInformationMessage("Error: No workspace found. Please open a folder.");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    function cleanUpWorkspace(workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = require('fs');
            const rimraf = require("rimraf");
            const util = require("util");
            const rimrafPromise = util.promisify(rimraf);
            var targetFolders = ['.microbit-stubs', 'microbit', 'mbitutils', 'microbit-master', 'mbitutils-master', '.vscode'];
            try {
                for (const value of targetFolders) {
                    let targetPath = workspace + "\\\\" + value;
                    if (fs.existsSync(targetPath)) {
                        yield fs.promises.access(targetPath);
                        yield rimrafPromise(targetPath);
                        console.log("Directory: " + value + " was deleted");
                    }
                    else {
                        console.log(value + " doesn't exist.");
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function downloadRepo(workspace) {
        return __awaiter(this, void 0, void 0, function* () {
            const download = require('download-git-repo');
            try {
                if (typeof workspace !== 'undefined' && workspace) {
                    let targetPath = workspace + "\\\\\.microbit-stubs";
                    console.log("Stubs dir: " + targetPath);
                    yield download('oivron/microbit-stubs', targetPath, function (err) {
                        console.log(err ? 'Error' : 'Repo sucessfully downloaded!');
                    });
                    yield createEnvFile();
                    setEnvVariable();
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function createEnvFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = require('fs');
            const workspace = getWorkspace();
            try {
                if (fs.existsSync(workspace)) {
                    yield fs.writeFile(workspace + '\\\.env', 'PYTHONPATH=./.microbit-stubs/microbit/lib', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('.env created in ' + workspace);
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function setEnvVariable() {
        try {
            console.log('Creating environment variables');
            var cmd = "$initilalValues = [Environment]::GetEnvironmentVariable('Pythonpath', 'User')";
            term.sendText(cmd);
            var cmd = "$arg = Get-Location | select -ExpandProperty Path";
            term.sendText(cmd);
            var cmd = "$workspaceValue = $arg + '\\\.microbit-stubs\\microbit\\lib'";
            term.sendText(cmd);
            var cmd = "$values = $initilalValues + ';' + $workspaceValue";
            term.sendText(cmd);
            var cmd = "[Environment]::SetEnvironmentVariable('Pythonpath', $values, 'User')";
            term.sendText(cmd);
            term.sendText("cls");
        }
        catch (error) {
            console.log(error);
        }
    }
    function modifySettings() {
        try {
            vscode.workspace.getConfiguration("python").update("languageServer", "Pylance", vscode.ConfigurationTarget.Workspace);
            vscode.workspace.getConfiguration("python.linting").update("enabled", true, vscode.ConfigurationTarget.Workspace);
            vscode.workspace.getConfiguration("python.linting").update("pylintEnabled", true, vscode.ConfigurationTarget.Workspace);
            vscode.workspace.getConfiguration("python.analysis").update("autoSearchPaths", true, vscode.ConfigurationTarget.Workspace);
            let extraPathsArgs = ['\.microbit-stubs/microbit/lib'];
            vscode.workspace.getConfiguration("python.autoComplete").update("extraPaths", extraPathsArgs, vscode.ConfigurationTarget.Workspace);
            vscode.workspace.getConfiguration("python.analysis").update("extraPaths", extraPathsArgs, vscode.ConfigurationTarget.Workspace);
            let fileArgs = { "\.microbit-stubs": true, ".vscode": true, ".env": true };
            vscode.workspace.getConfiguration("files").update("exclude", fileArgs, vscode.ConfigurationTarget.Workspace);
            vscode.workspace.getConfiguration("python").update("envFile", "${workspacefolder}/.env", vscode.ConfigurationTarget.Workspace);
            let myPylintArgs = ['--disable=W0614', '--disable=C0111', '--disable=W0401', '--disable=C0411', '--disable=C0413', '--disable=E0401', '--disable=C0303', '--disable=C0305'];
            vscode.workspace.getConfiguration("python.linting").update("pylintArgs", myPylintArgs, vscode.ConfigurationTarget.Workspace);
            console.log("Added workspace settings");
        }
        catch (error) {
            console.log(error);
        }
    }
    function installModules(target) {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { spawn } = require('child_process');
            const args = "pip install " + target + " bitbotxl";
            const child = spawn("powershell.exe", [args]);
            try {
                let data = "";
                try {
                    for (var _c = __asyncValues(child.stdout), _d; _d = yield _c.next(), !_d.done;) {
                        const chunk = _d.value;
                        console.log('stdout: ' + chunk);
                        data += chunk;
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                let error = "";
                try {
                    for (var _e = __asyncValues(child.stderr), _f; _f = yield _e.next(), !_f.done;) {
                        const chunk = _f.value;
                        console.error('stderr: ' + chunk);
                        error += chunk;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                const exitCode = yield new Promise((resolve, reject) => {
                    child.on('close', resolve);
                    vscode.window.showInformationMessage("Finished micro:bit: Prepare");
                });
                if (exitCode) {
                    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
                }
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function checkModulesInstalled() {
        var e_5, _a, e_6, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { spawn } = require('child_process');
            const child = spawn("powershell.exe", ["pip show bitbotxl"]);
            try {
                let data = "";
                try {
                    for (var _c = __asyncValues(child.stdout), _d; _d = yield _c.next(), !_d.done;) {
                        const chunk = _d.value;
                        console.log('stdout: ' + chunk);
                        data += chunk;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                let error = "";
                try {
                    for (var _e = __asyncValues(child.stderr), _f; _f = yield _e.next(), !_f.done;) {
                        const chunk = _f.value;
                        console.error('stderr: ' + chunk);
                        error += chunk;
                        if (chunk.includes("not found")) {
                            //await showMessageWithButton();
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                const exitCode = yield new Promise((resolve, reject) => {
                    child.on('close', resolve);
                });
                if (exitCode) {
                    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
                }
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function showMessageWithButton() {
        return __awaiter(this, void 0, void 0, function* () {
            let workspace = getWorkspace();
            try {
                yield vscode.window
                    .showInformationMessage("Could not install required Python modules. Directory is write protected. Press Install to install to workspace instead.", "Install")
                    .then(selection => {
                    console.log(selection);
                    if (selection === "Install") {
                        let path = "$env:userprofile\\Python\\lib\\site-packages";
                        let target = "-t " + path;
                        console.log("Python third-party dir: " + target);
                        installModules(target);
                        vscode.workspace.getConfiguration("python").update("thirdPartyModulesDirectory", path, vscode.ConfigurationTarget.Global);
                        console.log("Python third-party dir: " + path);
                        setEnvVariables();
                        createPipConfig();
                        let extraPathsArgs = ['\.microbit-stubs/microbit/lib', '$env:userprofile\\Python\\lib\\site-packages'];
                        vscode.workspace.getConfiguration("python.autoComplete").update("extraPaths", extraPathsArgs, vscode.ConfigurationTarget.Workspace);
                        vscode.workspace.getConfiguration("python.analysis").update("extraPaths", extraPathsArgs, vscode.ConfigurationTarget.Workspace);
                    }
                    else {
                        return;
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function setEnvVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var cmd = "$initilalValues = [Environment]::GetEnvironmentVariable('Path', 'User')";
                term.sendText(cmd);
                var cmd = "$userprofileValues = $env:userprofile + '\\Python\\lib\\site-packages' +';' + $env:userprofile + '\\Python\\lib\\site-packages\\bin'";
                term.sendText(cmd);
                var cmd = "$arg = Get-Location | select -ExpandProperty Path";
                term.sendText(cmd);
                var cmd = "$workspaceValue = $arg + '\\\.microbit-stubs\\microbit\\lib'";
                term.sendText(cmd);
                var cmd = "$values = $initilalValues + ';' + $userprofileValues + ';' + $workspaceValue";
                term.sendText(cmd);
                var cmd = "[Environment]::SetEnvironmentVariable('Path', $values, 'User')";
                term.sendText(cmd);
                var cmd = "$initilalValues = [Environment]::GetEnvironmentVariable('Pythonpath', 'User')";
                term.sendText(cmd);
                var cmd = "$userprofileValues = $env:userprofile + '\\Python\\lib\\site-packages' +';' + $env:userprofile + '\\Python\\lib\\site-packages\\bin'";
                term.sendText(cmd);
                //var cmd = "$arg = Get-Location | select -ExpandProperty Path"
                //term.sendText(cmd);
                //var cmd = "$workspaceValue = $arg + '\\\.microbit-stubs\\microbit\\lib'"
                //term.sendText(cmd);
                //var cmd = "$values = $initilalValues + ';' + $userprofileValues + ';' + $workspaceValue"
                var cmd = "$values = $initilalValues + ';' + $userprofileValues";
                term.sendText(cmd);
                var cmd = "[Environment]::SetEnvironmentVariable('Pythonpath', $values, 'User')";
                term.sendText(cmd);
                term.sendText("cls");
                console.log("Added Environment variables");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function createPipConfig() {
        const fs = require('fs');
        const homedir = require('os').homedir();
        try {
            let path = homedir + '\\pip';
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
                fs.writeFile(path + '\\pip.ini', '[global]\ntarget=' + homedir + '\\Python\\lib\\site-packages', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Added pip.ini in ' + homedir);
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    function prepareForMicrobit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield findPipLocation();
                const workspace = getWorkspace();
                yield cleanUpWorkspace(workspace);
                yield downloadRepo(workspace);
                modifySettings();
                let dir = "";
                yield installModules(dir);
                yield checkModulesInstalled();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    let prepareForMicrobitCommand = vscode.commands.registerCommand('extension.prepareForMicrobit', function () {
        prepareForMicrobit();
    });
    function showInputField() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let port = yield vscode.window.showInputBox({ placeHolder: "Please enter the micro:bit COM port number." });
                if (port) {
                    vscode.workspace.getConfiguration("microbit").update("comPort", port, vscode.ConfigurationTarget.Workspace);
                    console.log("micro:bit port: COM" + port);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    function selectComPort() {
        return __awaiter(this, void 0, void 0, function* () {
            yield showInputField();
        });
    }
    let selectComPortCommand = vscode.commands.registerCommand('extension.selectComPort', () => {
        selectComPort();
    });
    function flashMicrobit() {
        term.show();
        const activeDoc = vscode.window.activeTextEditor.document.fileName;
        const bitbotDir = vscode.workspace.getConfiguration("python").get("thirdPartyModulesDirectory", vscode.ConfigurationTarget.Global);
        //let uflashCmd = "uflash.exe " + activeDoc;
        let ufsCmd = "ufs put " + bitbotDir + "\\bitbot.py";
        try {
            const fs = require('fs');
            term.sendText("cls");
            term.sendText("$job = Start-Job { uflash.exe }");
            term.sendText("Wait-Job $job | Out-Null");
            term.sendText("Receive-Job $job");
            console.log("Flashing micro:bit with MicroPython");
            fs.readFile(activeDoc, function (err, data) {
                if (err) {
                    throw err;
                }
                if (data.includes('bitbot')) {
                    console.log(data);
                    term.sendText("$job = Start-Job { " + ufsCmd + " }");
                    term.sendText("Wait-Job $job | Out-Null");
                    term.sendText("Receive-Job $job");
                    console.log("Flashing micro:bit with bitbot.py at " + bitbotDir);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            term.sendText("$job = Start-Job { ufs put '" + activeDoc + "' main.py }");
            term.sendText("Wait-Job $job | Out-Null");
            term.sendText("Receive-Job $job");
            console.log("Flashing micro:bit with " + activeDoc);
        }
    }
    let flashMicrobitCommand = vscode.commands.registerCommand('extension.flashMicrobit', function () {
        flashMicrobit();
    });
    function readReplFromPort() {
        term.show();
        try {
            let comPort = vscode.workspace.getConfiguration("microbit").get("comPort", vscode.ConfigurationTarget.Workspace);
            var cmd = "$port= new-Object System.IO.Ports.SerialPort COM" + comPort + ",115200,None,8,one";
            term.sendText(cmd);
            var cmd = "$port.open()";
            term.sendText(cmd);
            var cmd = "$port.ReadExisting()";
            term.sendText(cmd);
            var cmd = "$port.Close()";
            term.sendText(cmd);
            return;
        }
        catch (error) {
            console.log(error);
        }
    }
    function readRepl() {
        readReplFromPort();
    }
    let readReplCommand = vscode.commands.registerCommand('extension.readRepl', function () {
        readRepl();
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map