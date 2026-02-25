document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Audio context setup (simulated for now, you can add real .wav files later)
    const playTypeSound = () => {
        // Placeholder for iOS typing sound trigger
        console.log("*click*");
    };

    // Auto-type logic
    const autoType = async (element, text, speed = 50) => {
        element.value = '';
        for (let i = 0; i < text.length; i++) {
            element.value += text.charAt(i);
            playTypeSound();
            await new Promise(r => setTimeout(r, speed + Math.random() * 50));
        }
    };

    // Handle Login Sequence
    authBtn.addEventListener('click', async () => {
        authBtn.disabled = true;
        authBtn.innerText = "AUTHENTICATING...";
        
        // Simulate the user tapping and auto-typing
        await autoType(usernameInput, "OPR-7742", 100);
        await new Promise(r => setTimeout(r, 400));
        await autoType(passwordInput, "••••••••••••", 80);
        
        await new Promise(r => setTimeout(r, 600));
        bootTerminal();
    });

    // Handle Terminal Boot
    const bootTerminal = async () => {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('terminal-screen').classList.add('active');
        
        const terminal = document.getElementById('terminal-output');
        const bootSequence = [
            "INITIATING SECURE HANDSHAKE...",
            "BYPASSING ISP LOGS... [SUCCESS]",
            "CONNECTING TO NEXUS MAINFRAME...",
            "DECRYPTING PAYLOAD...",
            "WELCOME BACK, AGENT."
        ];

        for (const line of bootSequence) {
            terminal.innerHTML += `> ${line}<br>`;
            await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
        }

        await new Promise(r => setTimeout(r, 1000));
        loadDashboard();
    };

    const loadDashboard = () => {
        document.getElementById('terminal-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        // Dashboard logic will initialize here
    };
});
