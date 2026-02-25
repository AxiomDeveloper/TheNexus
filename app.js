const STORAGE_KEY = "nexus-state-v1";

const defaultState = {
  didBoot: false,
  balance: 0.5,
  inventory: {
    bruteForceKey: false,
  },
  intelDecrypted: false,
  mapTargetRevealed: false,
  mapHackComplete: false,
};

const state = loadState();

const screens = {
  login: document.getElementById("login-screen"),
  terminal: document.getElementById("terminal-screen"),
  dashboard: document.getElementById("dashboard-screen"),
  window: document.getElementById("window-screen"),
};

const views = {
  comms: document.getElementById("view-comms"),
  intel: document.getElementById("view-intel"),
  ledger: document.getElementById("view-ledger"),
  satmap: document.getElementById("view-satmap"),
  terminal: document.getElementById("view-terminal"),
  settings: document.getElementById("view-settings"),
};

const refs = {
  agentId: document.getElementById("agent-id"),
  agentPass: document.getElementById("agent-pass"),
  loginBtn: document.getElementById("login-btn"),
  loginStatus: document.getElementById("login-status"),
  terminalOutput: document.getElementById("terminal-output"),
  windowTitle: document.getElementById("window-title"),
  btcBalance: document.getElementById("btc-balance"),
  ledgerStatus: document.getElementById("ledger-status"),
  intelStatus: document.getElementById("intel-status"),
  intelFile: document.getElementById("intel-file"),
  mapStatus: document.getElementById("map-status"),
  targetMarker: document.getElementById("target-marker"),
  statusRight: document.getElementById("status-right"),
};

bindEvents();
startClock();
hydrateUIFromState();

function bindEvents() {
  refs.loginBtn.addEventListener("click", runLoginSequence);

  document.querySelectorAll(".app-icon").forEach((appBtn) => {
    appBtn.addEventListener("click", () => openApp(appBtn.dataset.app));
  });

  document.querySelectorAll(".dock-item").forEach((dockBtn) => {
    dockBtn.addEventListener("click", () => openApp(dockBtn.dataset.app));
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    showScreen("dashboard");
  });

  document.getElementById("buy-key-btn").addEventListener("click", purchaseKey);
  document.getElementById("decrypt-btn").addEventListener("click", decryptIntel);
  refs.targetMarker.addEventListener("click", runMapHack);
  refs.targetMarker.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") runMapHack();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });
}

async function runLoginSequence() {
  refs.loginBtn.disabled = true;
  refs.loginStatus.textContent = "Injecting credential signature...";
  await autoType(refs.agentId, "AGENT-7742", 90);
  await wait(180);
  await autoType(refs.agentPass, "NEXUS//SIGMA-9", 60, true);
  refs.loginStatus.textContent = "Authenticating relay tunnel...";
  await wait(600);
  await bootTerminal();

  state.didBoot = true;
  saveState();
  hydrateUIFromState();
  showScreen("dashboard");
}

async function bootTerminal() {
  showScreen("terminal");
  refs.terminalOutput.textContent = "";

  const lines = [
    "[NEXUS] INITIALIZING SECURE FRAMEWORK...",
    "[NEXUS] BYPASSING ISP LOGS...SUCCESS",
    "[NEXUS] DECRYPTING PAYLOAD BLOCKS...SUCCESS",
    "[NEXUS] SPOOFING REGIONAL SIGNAL GRID...SUCCESS",
    "[NEXUS] WELCOME, AGENT.",
  ];

  for (const line of lines) {
    refs.terminalOutput.textContent += `> ${line}\n`;
    await wait(560);
  }

  await wait(700);
}

function openApp(appName) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  const activeView = views[appName];
  if (!activeView) return;

  refs.windowTitle.textContent = appName.toUpperCase();
  activeView.classList.add("active");
  showScreen("window");
}

function purchaseKey() {
  const cost = 0.2;

  if (state.inventory.bruteForceKey) {
    refs.ledgerStatus.textContent = "BruteForce_Key.exe already in inventory.";
    return;
  }

  if (state.balance < cost) {
    refs.ledgerStatus.textContent = "Transaction failed: insufficient BTC balance.";
    return;
  }

  state.balance = Number((state.balance - cost).toFixed(2));
  state.inventory.bruteForceKey = true;
  refs.ledgerStatus.textContent = "Purchase complete. Key injected into secure inventory.";

  saveState();
  hydrateUIFromState();
}

function decryptIntel() {
  if (!state.inventory.bruteForceKey) {
    refs.intelStatus.textContent = "Access denied. Acquire BruteForce_Key.exe in LEDGER.";
    return;
  }

  state.intelDecrypted = true;
  state.mapTargetRevealed = true;
  refs.intelStatus.textContent = "Decryption successful. Coordinates extracted.";

  saveState();
  hydrateUIFromState();
}

function runMapHack() {
  if (!state.mapTargetRevealed) {
    refs.mapStatus.textContent = "No target lock. Decrypt intel first.";
    return;
  }

  state.mapHackComplete = true;
  refs.mapStatus.textContent = "Hack initiated... satellite channel compromised.";
  saveState();
}

function hydrateUIFromState() {
  refs.btcBalance.textContent = state.balance.toFixed(2);

  refs.intelFile.classList.toggle("hidden", !state.intelDecrypted);
  refs.targetMarker.classList.toggle("hidden", !state.mapTargetRevealed);

  if (state.inventory.bruteForceKey) {
    refs.ledgerStatus.textContent = "Inventory synced: BruteForce_Key.exe detected.";
  }

  if (state.intelDecrypted) {
    refs.intelStatus.textContent = "Decryption successful. Coordinates extracted.";
    refs.mapStatus.textContent = state.mapHackComplete
      ? "Hack initiated... satellite channel compromised."
      : "Target acquired. Tap marker to initiate hack.";
  }

  refs.statusRight.textContent = `${batteryHint()} | AES-512`;

  if (state.didBoot) {
    showScreen("dashboard");
  } else {
    showScreen("login");
  }
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      inventory: {
        ...defaultState.inventory,
        ...(parsed.inventory || {}),
      },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function startClock() {
  const clock = document.getElementById("clock");
  const update = () => {
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  update();
  setInterval(update, 1000);
}

async function autoType(element, value, speed = 80, mask = false) {
  element.value = "";

  for (let i = 0; i < value.length; i += 1) {
    if (mask) {
      element.value += "•";
    } else {
      element.value += value[i];
    }

    await wait(speed + Math.random() * 40);
  }
}

function batteryHint() {
  const fakeLevel = Math.floor(92 + (Date.now() / 1000) % 6);
  return `${fakeLevel}%`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
