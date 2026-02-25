// --- GAME STATE ---
const gameState = {
    balance: 0.50,
    inventory: [],
    filesUnlocked: false,
    mapTargetRevealed: false
};

const game = {
    updateLog: (elementId, msg) => {
        const el = document.getElementById(elementId);
        if(el) el.innerHTML = `> ${msg}<br>` + el.innerHTML;
    },

    buyItem: (item, cost) => {
        if (gameState.balance >= cost) {
            gameState.balance -= cost;
            gameState.inventory.push(item);
            document.getElementById('btc-amount').innerText = gameState.balance.toFixed(2);
            game.updateLog('wallet-log', `TRANSACTION SUCCESS: Downloaded ${item}.exe`);
        } else {
            game.updateLog('wallet-log', 'ERROR: INSUFFICIENT FUNDS');
        }
    },

    unlockFile: () => {
        if (gameState.inventory.includes('key')) {
            gameState.filesUnlocked = true;
            document.getElementById('file-content').classList.remove('hidden');
            game.revealMapTarget();
            alert("FILE DECRYPTED: Target coordinates acquired.");
        } else {
            alert("ACCESS DENIED: Decryption key required. Check the Ledger.");
        }
    },

    revealMapTarget: () => {
        gameState.mapTargetRevealed = true;
        document.getElementById('target-marker').classList.remove('hidden');
        game.updateLog('map-log', 'WARNING: New rogue signal detected.');
    }
};

// --- CORE OS LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Auto-type logic
    const autoType = async (element, text, speed = 50) => {
        element.value = '';
        for (let i = 0; i < text.length; i++) {
            element.value += text.charAt(i);
            await new Promise(r => setTimeout(r, speed + Math.random() * 50));
        }
    };

    // Login
    document.getElementById('auth-btn').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.disabled = true; btn.innerText = "AUTHENTICATING...";
        await autoType(document.getElementById('username'), "OPR-7742", 80);
        await new Promise(r => setTimeout(r, 200));
        await autoType(document.getElementById('password'), "••••••••••••", 60);
        await new Promise(r => setTimeout(r, 400));
        bootTerminal();
    });

    // Boot Sequence
    const bootTerminal = async () => {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('terminal-screen').classList.add('active');
        const terminal = document.getElementById('terminal-output');
        const lines = ["HANDSHAKE...", "BYPASSING LOGS... [OK]", "DECRYPTING PAYLOAD...", "WELCOME BACK, AGENT."];
        for (const line of lines) {
            terminal.innerHTML += `> ${line}<br>`;
            await new Promise(r => setTimeout(r, 600));
        }
        await new Promise(r => setTimeout(r, 800));
        document.getElementById('terminal-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
    };

    // Clock
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }, 1000);

    // App Navigation
    document.querySelectorAll('.app-icon').forEach(app => {
        app.addEventListener('click', () => {
            const appName = app.getAttribute('data-app');
            
            // UI Switch
            document.getElementById('dashboard-screen').classList.remove('active');
            document.getElementById('active-app-screen').classList.add('active');
            document.getElementById('app-title').innerText = appName.toUpperCase();
            
            // Hide all app views, show active
            document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
            document.getElementById(`app-${appName}`).classList.add('active');
        });
    });

    // Close App
    document.getElementById('close-app').addEventListener('click', () => {
        document.getElementById('active-app-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
    });

    // Map Interaction
    document.getElementById('target-marker').addEventListener('click', () => {
        alert("SATELLITE ALIGNED: Initiating localized hack...");
        game.updateLog('map-log', 'HACK IN PROGRESS... Standby for next mission loop.');
    });
});

// Expose game to window for HTML inline onClick functions
window.game = game;
