// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MoodLoggerViewProvider } from './sidebar';
import { MoodLoggerWebviewProvider } from './webview';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.globalState.update('loggedMood', null);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "yli" is now active!');
	const provider = new MoodLoggerViewProvider(context);
	// Register sidebar panel
	context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            MoodLoggerViewProvider.viewType,
            provider
        )
    );

	vscode.commands.executeCommand('setContext', 'moodLogger.sidebarActive', true);

	// Register the command for opening the webview
    context.subscriptions.push(
        vscode.commands.registerCommand('moodLogger.openWebview', () => {
            MoodLoggerWebviewProvider.openWebview(context);
        })
    );
	// open pre-task planning link
	context.subscriptions.push(
		vscode.commands.registerCommand('moodLogger.openPlan', () => {
			MoodLoggerWebviewProvider.openPlan(context);
        })
	);

	// open post-task reflection part
	context.subscriptions.push(
        vscode.commands.registerCommand('moodLogger.openReflection', () => {
			MoodLoggerWebviewProvider.openReflection(context);
        })
    );

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('yli.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from exp_log!');
	});

	context.subscriptions.push(disposable);

	// pop up strategy message
	setInterval(() => {
		vscode.window.showInformationMessage(getRandomReminder());
	}, 15 * 60 * 1000);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// pop different reminder of using strategies
function getRandomReminder(): string {
    const messages = [
        "Remember to practice the strategy you selected.",
        "Stay on track! Try your chosen strategy.",
        "How’s it going? Give your selected strategy a shot.",
        "Take a moment to use your strategy."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}