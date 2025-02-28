cut from sidebar.ts:

${this.strategyData.strategy ? `
            <p><strong>Today's Strategy:</strong> ${this.strategyData.strategy}</p>
            <p><strong>Practice Plan:</strong> ${this.strategyData.plan}</p>
            <button onclick="finishSession()">Finish Today's Session</button>
        ` : `
            <p>No strategy selected yet. Start by choosing a strategy to practice today.</p>
            <button onclick="openWebview()">Open Experience Tracker</button>
        `}