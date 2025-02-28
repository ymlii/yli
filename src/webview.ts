import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MoodLoggerWebviewProvider {
    public static readonly viewType = 'moodLogger.webview';
    
    public static openWebview(context: vscode.ExtensionContext) {
        const panel = vscode.window.createWebviewPanel(
            MoodLoggerWebviewProvider.viewType,
            'Mood Logger Tracker',
            vscode.ViewColumn.One,
            { enableScripts: true } // Enable JavaScript in webview
        );

        panel.webview.html = MoodLoggerWebviewProvider.getWebviewContent();

        panel.webview.onDidReceiveMessage(message =>{
            if (message.command === 'logMood') {
                // context.globalState.update('selectedStrategy', message.strategy);
                context.globalState.update('plan', message.plan);
                context.globalState.update('strategy', message.strategy);
                vscode.commands.executeCommand('moodLogger.refreshSidebar');
                
                // vscode.commands.executeCommand('moodLogger.refreshSidebar');
                vscode.window.showInformationMessage('Strategy logged!');
            }
        });
    }
    

    public static openReflection(context: vscode.ExtensionContext) {
        vscode.window.showInformationMessage('Reflection session started.');
        // context.globalState.update('loggedMood', null);
        // Add webview for reflection if needed
        const reflection_url = 'https://sesp.az1.qualtrics.com/jfe/form/SV_8eS77sJbT6wOHoa'; // Change to your actual URL
        vscode.env.openExternal(vscode.Uri.parse(reflection_url));
        vscode.commands.executeCommand('moodLogger.refreshSidebar');
    }

    public static openPlan(context: vscode.ExtensionContext){
        vscode.window.showInformationMessage('Start Planning.');
        const plan_url='https://sesp.az1.qualtrics.com/jfe/form/SV_2rgyt45H3fUvc1w';
        vscode.env.openExternal(vscode.Uri.parse(plan_url));
    }

    private static getWebviewContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Experience Logger</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                button { padding: 10px; background: #007acc; color: white; border: none; cursor: pointer; }
                select {
                    background-color: #f0f0f0 !important;
                    color: #333 !important;
                    font-size: 16px !important;
                    border-radius: 5px !important;
                    padding: 10px !important;
                }
                p{font-size: 16px !important;}
            </style>
        </head>
        <body>
            <h1>Experience Logger</h1>


            <p>1. Which strategy are you planning to practice today?</p>
             <select id="strategy" style="width: 400px">
                <option value="Take a break and come back later with a fresh eye!">Take a break and come back later with a fresh eye!</option>
                <option value="Re-evaluate the Situation">Re-evaluate the Situation</option>
                <option value="Re-frame your struggle">Re-frame your struggle</option>
                <option value="A Mindful Approach: Accepting your Emotions">A Mindful Approach: Accepting your Emotions</option>
                <option value="Flexibility in Strategies and Goals">Flexibility in Strategies and Goals</option>
                <option value="Orienting and Assessing">Orienting and Assessing</option>
                <option value="Planning while Staying Flexible">Planning while Staying Flexible</option>
                <option value="Re-frame your struggle">Understanding the Cause of Your Feelings</option>
            </select>

            <p>2. How are you planning to practice the strategy today? (copy paste from your planning survey responses)</p>
            
            <textarea id="moodInput" rows="6" cols="50" placeholder="I'm planning to practice the strategy ..."></textarea>
            <br><br>
            <button onclick="logMood()">Save</button>
            <p id="loggedfb"></p>

            <script>
                const vscode = acquireVsCodeApi();
                function logMood() {
                    const strategy = document.getElementById('strategy').value;
                    const plan = document.getElementById("moodInput").value;
                    vscode.postMessage({ command: 'logMood', plan: plan, strategy:strategy });
                    document.getElementById("moodInput").value = '';
                    document.getElementById("loggedfb").innerText = 'Strategy Logged! Happy programming! Remember to practice your strategy selected.';
                }
            </script>
        </body>
        </html>`;
    }
}