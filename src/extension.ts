import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let prepareForMicrobitCommand = vscode.commands.registerCommand('extension.prepareForMicrobit', function () {
		prepareForMicrobit();
	});
	let readReplCommand = vscode.commands.registerCommand('extension.readRepl', function () {
		readRepl();
	});
	let selectComPortCommand = vscode.commands.registerCommand('extension.selectComPort', () => {
		selectComPort();
	});
	let flashMicrobitCommand = vscode.commands.registerCommand('extension.flashMicrobit', function () {
		flashMicrobit();
	});
	context.subscriptions.push(
		prepareForMicrobitCommand,
		readReplCommand,
		selectComPortCommand,
		flashMicrobitCommand
	);
	console.log('Extension Microbit is now active.');
}


function getTerminal(): vscode.Terminal {
	const terminalName = 'Microbit';
	const terminals = vscode.window.terminals;
	try {
		for (let terminal of terminals) {
			if (terminal.name === terminalName) {
				console.log(`Found existing terminal: ${terminalName}`);
				return terminal;
			}
		}
		const newTerminal = vscode.window.createTerminal(terminalName);
		console.log(`Created new terminal: ${terminalName}`);
		return newTerminal;
	}
	catch (error) {
		console.error(error);
		vscode.window.showErrorMessage('Failed to load workspace. See logs for details.');
		return vscode.window.createTerminal('Microbit');
	}
}


// Finds the location of third-party Python modules.
async function findPipLocation() {
	const { spawn } = require('child_process');
	const child = spawn('pip', ['-V']);

	try {
		let data = '';
		for await (const chunk of child.stdout) {
			console.log('stdout: ' + chunk);
			data += chunk;
		}
		let error = '';
		for await (const chunk of child.stderr) {
			console.error('stderr: ' + chunk);
			error += chunk;
		}
		const exitCode = await new Promise((resolve) => {
			child.on('close', resolve);
			let path = '';
			path = data.substring(
				data.lastIndexOf(':') - 1,
				data.lastIndexOf('pip')
			);
			console.log('Python third-party dir: ' + path);
			vscode.workspace.getConfiguration('python').update('thirdPartyModulesDirectory', path, vscode.ConfigurationTarget.Global);
		});
		if (exitCode) {
			throw new Error(`subprocess error exit ${exitCode}, ${error}`);
		}
		return data;
	} catch (error) {
		console.error('Failed to resolve Python third‑party directory', error);
		vscode.window.showErrorMessage('Unable to resolve Python third‑party directory. See logs for details.');
		return 0;
	}
}


// Checks to see that a workspace is open and gets the path.
function getWorkspace() {
	var targetPath = '';

	try {
		if (typeof vscode.workspace.workspaceFolders !== 'undefined') {
			let workspace = vscode.workspace.workspaceFolders[0].uri.path;
			targetPath = (workspace).replace(/^\/|\/$/g, '');
			targetPath = targetPath.replace(/\//g, '\\\\');
			console.log('Workspace dir: ' + targetPath);
			return targetPath;
		}
		else {
			vscode.window.showInformationMessage('Error: No workspace found. Please open a folder.');
			return 0;
		}
	}
	catch (error) {
		console.error('No workspace found', error);
		return 0;
	}
}


// Downloads the microbit-stubs repo and extracts it to a .microbit-stubs folder in the workspace.
async function downloadRepo(workspace: any) {
	const fs = require('fs');
	const https = require('https');
	const path = require('path');
	const os = require('os');
	const { execFile, spawn } = require('child_process');
	const { promisify } = require('util');

	if (!workspace) {
		vscode.window.showInformationMessage('Error: No workspace found. Please open a folder.');
		return 0;
	}

	const workspacePath = getWorkspace();
	if (!workspacePath) {
		return 0;
	}

	const targetDir = path.join(workspacePath, '.microbit-stubs');
	if (fs.existsSync(targetDir)) {
		console.log(`Repo already downloaded at ${targetDir}`);
		return 0;
	}

	console.log(`Downloading repo to ${targetDir}`);
	const tmpZip = path.join(os.tmpdir(), 'microbit-stubs.zip');

	try {
		return new Promise<void>((resolve, reject) => {
			const downloadWithRedirects = (url: string, redirectCount = 0) => {
				if (redirectCount > 5) {
					reject(new Error('Too many redirects'));
					return;
				}

				const file = fs.createWriteStream(tmpZip);
				const options = new URL(url);

				https.request(options, (res: any) => {
					// Handle redirects
					if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307 || res.statusCode === 308) {
						const redirectUrl = res.headers.location;
						if (!redirectUrl) {
							reject(new Error('Redirect location not provided'));
							return;
						}
						file.destroy();
						fs.unlinkSync(tmpZip);
						downloadWithRedirects(redirectUrl, redirectCount + 1);
						return;
					}

					if (res.statusCode !== 200) {
						reject(new Error(`Failed to download repo zip, status ${res.statusCode}`));
						return;
					}

					res.pipe(file);

					file.on('finish', () => {
						file.close(async () => {
							try {
								// Create target directory
								if (!fs.existsSync(targetDir)) {
									fs.mkdirSync(targetDir, { recursive: true });
								}

								// Extract zip file using platform-specific tools
								const platform = os.platform();

								if (platform === 'win32') {
									// Windows: use PowerShell's Expand-Archive
									const escapedZip = tmpZip.replace(/'/g, "''");
									const escapedTarget = targetDir.replace(/'/g, "''");
									const psCommand = `Expand-Archive -Path '${escapedZip}' -DestinationPath '${escapedTarget}' -Force`;

									const child = spawn('powershell.exe', ['-Command', psCommand]);

									await new Promise<void>((psResolve, psReject) => {
										child.on('error', psReject);
										child.on('close', (code: number) => {
											if (code !== 0) {
												psReject(new Error(`Extraction failed with code ${code}`));
											} else {
												psResolve();
											}
										});
									});
								} else {
									// Linux and macOS: use unzip command
									const execFilePromise = promisify(execFile);
									await execFilePromise('unzip', ['-q', tmpZip, '-d', targetDir]);
								}

								// Move contents from microbit-stubs-master folder to target directory
								const masterDir = path.join(targetDir, 'microbit-stubs-master');
								if (fs.existsSync(masterDir)) {
									const items = fs.readdirSync(masterDir);
									for (const item of items) {
										const source = path.join(masterDir, item);
										const dest = path.join(targetDir, item);
										fs.renameSync(source, dest);
									}
									// Remove the now-empty master directory
									fs.rmdirSync(masterDir);
								}

								console.log('Repo downloaded and extracted successfully');

								// Clean up temp zip file
								fs.unlinkSync(tmpZip);
								resolve();
							} catch (error) {
								reject(error);
							}
						});
					});
				}).on('error', reject).end();
			};

			downloadWithRedirects('https://github.com/oivron/microbit-stubs/archive/refs/heads/master.zip');
		});
	} catch (error) {
		console.error(error);
	}
}


function modifySettings() {
	try {
		let fileArgs: object = { '\.microbit-stubs': true};
		vscode.workspace.getConfiguration('files').update('exclude', fileArgs, vscode.ConfigurationTarget.Workspace);

		let stubPathsArgs: string = '\.microbit-stubs/microbit/lib';
		vscode.workspace.getConfiguration('python.analysis').update('stubPath', stubPathsArgs, vscode.ConfigurationTarget.Workspace);

		console.log('Added workspace settings');
	} catch (error) {
		console.error(error);
	}
}


// Installs the bitbotxl module and its dependencies.
async function installModules(target: string) {
	const { spawn } = require('child_process');
	const args = 'pip install ' + target + ' bitbotxl';

	const child = spawn('powershell.exe', [args]);

	try {
		let data = '';
		for await (const chunk of child.stdout) {
			console.log('stdout: ' + chunk);
			data += chunk;
		}
		let error = '';
		for await (const chunk of child.stderr) {
			console.error('stderr: ' + chunk);
			error += chunk;
		}
		const exitCode = await new Promise((resolve) => {
			child.on('close', resolve);
			vscode.window.showInformationMessage('Finished micro:bit: Prepare');
		});
		if (exitCode) {
			throw new Error(`subprocess error exit ${exitCode}, ${error}`);
		}
		return data;
	} catch (error) {
		console.error(error);
		return 0;
	}
}


// Checks to see that the bitbotxl module was installed.
async function checkModulesInstalled() {
	const { spawn } = require('child_process');
	const child = spawn('powershell.exe', ['pip show bitbotxl']);

	try {
		let data = '';
		for await (const chunk of child.stdout) {
			console.log('stdout: ' + chunk);
			data += chunk;
		}
		let error = '';
		for await (const chunk of child.stderr) {
			console.error('stderr: ' + chunk);
			error += chunk;
			if (chunk.includes('not found')) {
			}
		}
		const exitCode = await new Promise((resolve) => {
			child.on('close', resolve);
		});
		if (exitCode) {
			throw new Error(`subprocess error exit ${exitCode}, ${error}`);
		}
		return data;
	} catch (error) {
		console.error(error);
		return 0;
	}
}


// Main function to prepare the workspace for micro:bit development.
async function prepareForMicrobit() {
	try {
		await findPipLocation();
		const workspace = getWorkspace();
		await downloadRepo(workspace);
		modifySettings();
		let dir = '';
		await installModules(dir);
		await checkModulesInstalled();
	} catch (error) {
		console.error(error);
	}
}


// Show input field to enter micro:bit COM port.
async function showInputField() {
	try {
		let port = await vscode.window.showInputBox({ placeHolder: 'Please enter the micro:bit COM port number.' });
		if (port) {
			vscode.workspace.getConfiguration('microbit').update('comPort', port, vscode.ConfigurationTarget.Workspace);
			console.log('micro:bit port: COM' + port);
		}
	} catch (error) {
		console.error(error);
	}
}

async function selectComPort() {
	await showInputField();
}


// Flashes the active Python file and (optionally) installs the bitbotxl module to the micro:bit.
function flashMicrobit() {
	const terminal = getTerminal();
	terminal.show();

	const activeDoc = vscode.window.activeTextEditor.document.fileName;
	const bitbotDir = vscode.workspace.getConfiguration('python').get('thirdPartyModulesDirectory', vscode.ConfigurationTarget.Global);
	const path = require('path');

	const bitbotPath = path.join(bitbotDir || '', 'bitbot.py');
	const escapedBitbotPath = bitbotPath.replace(/'/g, "''");
	let ufsCmd = `ufs put '${escapedBitbotPath}'`;

	try {
		const fs = require('fs');

		terminal.sendText('cls');
		terminal.sendText(`$job = Start-Job { uflash.exe }`);
		terminal.sendText('Wait-Job $job | Out-Null');
		terminal.sendText('Receive-Job $job');
		console.log('Flashing micro:bit with MicroPython');

		fs.readFile(activeDoc, function (err: Error, data: Buffer) {
			if (err) {
				throw err;
			}
			if (data.includes('bitbot')) {
				console.log(data);
				terminal.sendText(`$job = Start-Job { ${ufsCmd} }`);
				terminal.sendText('Wait-Job $job | Out-Null');
				terminal.sendText('Receive-Job $job');
				console.log('Flashing micro:bit with bitbot.py at ' + bitbotDir);
			}
		});
	} catch (error) {
		console.error(error);
	}
	finally {
		const escapedActive = activeDoc.replace(/'/g, "''");
		terminal.sendText(`$job = Start-Job { ufs put '${escapedActive}' 'main.py' }`);
		terminal.sendText('Wait-Job $job | Out-Null');
		terminal.sendText('Receive-Job $job');
		console.log('Flashing micro:bit with ' + activeDoc);
	}
}


// Reads error messages from the micro:bit.
function readReplFromPort() {
	const terminal = getTerminal();
	terminal.show();

	try {
		let comPort = vscode.workspace.getConfiguration('microbit').get('comPort', vscode.ConfigurationTarget.Workspace);

		var cmd = '$port= new-Object System.IO.Ports.SerialPort COM' + comPort + ',115200,None,8,one';
		terminal.sendText(cmd);
		var cmd = '$port.open()';
		terminal.sendText(cmd);
		var cmd = '$port.ReadExisting()';
		terminal.sendText(cmd);
		var cmd = '$port.Close()';
		terminal.sendText(cmd);
		return;
	} catch (error) {
		console.error(error);
	}
}


function readRepl() {
	readReplFromPort();
}
