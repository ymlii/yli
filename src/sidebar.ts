import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
export class MoodLoggerViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'moodLogger.sidebar';
    // private storagePath: string;
    // private strategyData: any={};

    constructor(private readonly _context: vscode.ExtensionContext) {
        // this.storagePath = path.join(this._context.globalStorageUri.fsPath, 'moodLoggerData.json');
        // this.loadData();
    }
    private static loadStrategies(context: vscode.ExtensionContext): any[] {
            try {
                const strategyPath = path.join(context.extensionPath, 'src','strategies.json');
                const jsonData = fs.readFileSync(strategyPath, 'utf8');
                return JSON.parse(jsonData);
            } catch (error) {
                console.error('Error loading strategies:', error);
                return [];
            }
        }
    resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible) {
                webviewView.webview.html = this.getHtml(webviewView.webview); // Refresh content
            }
        });

        vscode.commands.registerCommand('moodLogger.refreshSidebar', () => {
            webviewView.webview.html = this.getHtml(webviewView.webview); // Refresh content
        });
        // Handle button clicks
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'openWebview') {
                vscode.commands.executeCommand('moodLogger.openWebview');
                
            }
            if(message.command === 'finishSession'){
                vscode.commands.executeCommand('moodLogger.openReflection');
            }
            if(message.command === 'startPlan'){
                vscode.commands.executeCommand('moodLogger.openPlan');
            }
        });
    }

    private getHtml(webview: vscode.Webview): string {
        const strategies = MoodLoggerViewProvider.loadStrategies(this._context);
        const strategiesJson = JSON.stringify(strategies);


        const plan = this._context.globalState.get<string>('plan') || 'No plan logged yet.';
        const strategy = this._context.globalState.get<string>('strategy') || 'No strategy selected yet.';
        
            // Find the saved strategy in the list and get its description
            const savedStrategyObj = strategies.find(s => s.name === strategy);
            const savedStrategyDescription = savedStrategyObj ? savedStrategyObj.how : '<p>Select a strategy to see details.</p>';

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Experience Logger</title>
            <style>
            body { font-family: Arial, sans-serif; padding: 10px; }
            button { padding: 10px; font-size: 16px; margin-top: 10px; cursor: pointer; }
        </style>
        </head>
        <body>
        <h2>Experience Logger</h2>
        <details>
        <summary>How do I use this extension</summary>
        <ol>
        <li>Click the first button, Start planning, it will lead you to a qualtrics survey. Start planning what strategy you want to use, and how do you want to use it </li>
        <li>Come back to VScode, click the second button, log strategy and plan. Select the strategy you chose in the qualtrics survey, and copy paste your strategy here. Click Save button after copy pasting it.</li>
        <li>Start programming! The sidebar will show the strategy you selected, and how you plan to practice the strategy. The system will send you notification on the bottom right corner every 20 minutes, reminding you of practicing the strategy.</li>
        <li>When you decide to finish today's programming session, click the last Finish Today's Session button. It will lead you to another qualtrics survey, asking you to do a post-task reflection</li>
        </ol>
        </details>
        <button onclick="startPlan()">Start Planning</button> </br>
        <button onclick="openWebview()">Log Strategy and Plan</button></br>
        <button onclick="finishSession()">Finish Today's Session</button>


        <p><strong>Strategy:</strong> ${strategy}</p>
        <p><strong>Plan:</strong> ${plan}</p>
       
        <details>
        <summary>When and how to use this strategy?</summary>
        ${savedStrategyDescription}
        </details>

        <script>
            const vscode = acquireVsCodeApi();
            function openWebview() {
                vscode.postMessage({ command: 'openWebview' });
                vscode.commands.executeCommand('moodLogger.openWebview');
            }
            function finishSession() {
                vscode.postMessage({ command: 'finishSession' });
            }
            
            function startPlan(){
                vscode.postMessage({ command: 'startPlan' });
            }
        </script>
        </body>
        </html>`;
    }

    // private loadData() {
    //     if (fs.existsSync(this.storagePath)) {
    //         const rawData = fs.readFileSync(this.storagePath, 'utf-8');
    //         this.strategyData = JSON.parse(rawData);
    //     } else {
    //         this.strategyData = { strategy: null, plan: null };
    //     }
    // }

    // private saveData() {
    //     fs.writeFileSync(this.storagePath, JSON.stringify(this.strategyData, null, 2));
    // }
}

