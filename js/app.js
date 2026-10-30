/**
 * Full-Stack Judol System Architecture - Realistic Engine & RMS
 * Dibuat khusus untuk Edukasi & Analisis Arsitektur Rekayasa Perangkat Lunak.
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (Tanpa File Eksternal)
// ==========================================
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playReelTick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playScatterDrop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.3); // D6
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    playWinSound(isBig = false) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = isBig ? [440, 554.37, 659.25, 880, 1108.73] : [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
            gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
        });
    }

    playLightning() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        // Synthesize electric zap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

const audio = new SoundFX();

// ==========================================
// 2. SIMULATION CONSTANTS & SYMBOL DEFINITIONS
// ==========================================
const SYMBOLS = [
    { id: 'ZEUS', icon: '⚡', name: 'Petir Zeus', mult: 50, color: 'text-amber-400', isSpecial: true },
    { id: 'CROWN', icon: '👑', name: 'Mahkota Emas', mult: 30, color: 'text-yellow-400' },
    { id: 'RING', icon: '💍', name: 'Cincin Ruby', mult: 18, color: 'text-rose-400' },
    { id: 'CHALICE', icon: '🏺', name: 'Piala Emas', mult: 12, color: 'text-amber-300' },
    { id: 'GEM_RED', icon: '💎', name: 'Berlian Merah', mult: 8, color: 'text-red-400' },
    { id: 'GEM_BLUE', icon: '🔷', name: 'Safir Biru', mult: 5, color: 'text-blue-400' },
    { id: 'GEM_GREEN', icon: '🟢', name: 'Zamrud Hijau', mult: 3, color: 'text-emerald-400' },
    { id: 'SCATTER', icon: '⭐', name: 'Scatter Zeus', mult: 100, color: 'text-purple-400', isScatter: true }
];

// 5 Reels x 3 Rows Slot Grid
const GRID_COLS = 5;
const GRID_ROWS = 3;

// ==========================================
// 3. SYSTEM STATE (CLIENT + OPERATOR RMS)
// ==========================================
const state = {
    activeUser: 'User A',
    globalRtpTarget: 92.0, // Baseline target house RTP
    actualTotalTurnover: 0,
    actualTotalPayout: 0,
    dailyLiabilityLimit: 500000000,
    systemMode: 'RMS_DYNAMIC', // 'FAIR', 'RMS_DYNAMIC', 'EXTREME_DRAIN'
    isSpinning: false,
    isTurbo: false,
    isJackpotLocked: false,     // Kunci likuiditas jackpot bandar
    jackpotWinner: null,        // Pencatat pemain yang telah menguras jackpot
    autoSpinRemaining: 0,
    autoSpinTimer: null,
    currentMultiplier: 1,
    lastSpinResult: null,

    // Psychological Telemetry Metrics
    psychMetrics: {
        nearMissCount: 0,
        ldwCount: 0, // Losses Disguised as Wins
        cleanWins: 0,
        pureLosses: 0
    },

    // User Profiles with Behavioral Classification
    users: {
        'User A': {
            name: 'User A',
            persona: 'New Depositor (VIP Target)',
            stage: 'HOOKING', // 'HOOKING', 'MILKING', 'RETENTION'
            balance: 1000000,
            initialDeposit: 1000000,
            bet: 50000,
            maxBet: 500000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 115.0, // High RTP initially to trigger addiction
            riskRating: 'High LTV / Potential Whale',
            status: 'Hook Phase (Gacor)',
            payoutCap: 150000000
        },
        'User B': {
            name: 'User B',
            persona: 'Regular Grinder',
            stage: 'MILKING',
            balance: 500000,
            initialDeposit: 1000000,
            bet: 25000,
            maxBet: 250000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 82.5, // Extraction mode
            riskRating: 'Moderate / Exploited',
            status: 'Extraction Phase (Sedot)',
            payoutCap: 50000000
        },
        'User C': {
            name: 'User C',
            persona: 'Casual / Low Balance',
            stage: 'RETENTION',
            balance: 200000,
            initialDeposit: 500000,
            bet: 10000,
            maxBet: 100000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 78.0,
            riskRating: 'Low Balance / Retention Trap',
            status: 'Retention Loop (Nafas)',
            payoutCap: 25000000
        }
    },

    // Chart.js data buffers
    telemetryHistory: {
        labels: [],
        rtpTargetData: [],
        actualRtpData: [],
        houseGgrData: []
    }
};

// Global Chart References
let rtpTelemetryChart = null;
let ggrCashflowChart = null;

// ==========================================
// 4. UTILITIES & FORMATTERS
// ==========================================
function formatIDR(val) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(Math.max(0, Math.round(val)));
}

function writeAuditLog(event, details, level = 'info') {
    const terminal = document.getElementById('terminalLog');
    if (!terminal) return;

    const time = new Date().toTimeString().split(' ')[0];
    let badgeClass = 'text-slate-400';
    if (level === 'alert') badgeClass = 'text-rose-400 font-bold';
    if (level === 'warning') badgeClass = 'text-amber-400 font-bold';
    if (level === 'success') badgeClass = 'text-emerald-400 font-bold';
    if (level === 'hook') badgeClass = 'text-purple-400 font-bold';

    const entry = document.createElement('div');
    entry.className = `p-1.5 rounded hover:bg-slate-900 border-b border-slate-900/60 font-mono text-[11px] leading-relaxed transition`;
    entry.innerHTML = `
        <div class="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
            <span>[${time}] <span class="${badgeClass}">${event.toUpperCase()}</span></span>
            <span class="text-slate-600">${state.activeUser}</span>
        </div>
        <div class="text-slate-300 pl-2 border-l border-slate-800">${details}</div>
    `;

    terminal.insertBefore(entry, terminal.firstChild);
    // Batasi log maksimal 60 item
    while (terminal.children.length > 60) {
        terminal.removeChild(terminal.lastChild);
    }
}

function clearTerminal() {
    const terminal = document.getElementById('terminalLog');
    if (terminal) terminal.innerHTML = `<div class="text-slate-500 p-2">[System] Audit trail cleared. Monitoring running telemetry...</div>`;
}

// ==========================================
// 5. RMS ALGORITHMIC OUTCOME DECIDER
// ==========================================
/**
 * Backend RNG engine yang mensimulasikan mekanisme riil platform judi online:
 * 1. Pancingan (Hooking Phase): Win probability tinggi diawal.
 * 2. Sedot (Milking Phase): Menggunakan House Edge agresif.
 * 3. Near-Miss Generator: Memasang 2 Scatter & 1 langkah meleset di reel akhir.
 * 4. Loss Disguised as Win (LDW): Menang di bawah nominal bet, tapi efek suara heboh.
 */
function backendCalculateOutcome(user) {
    user.spinCount++;
    const currentBet = user.bet;
    let effectiveRtp = user.rtpProfile;

    // Evaluasi Stage Siklus Psikologi
    if (user.stage === 'HOOKING' && user.spinCount > 8 && user.totalPayout > user.initialDeposit * 1.4) {
        // Transisi dari Hook ke Milking setelah menang cukup
        user.stage = 'MILKING';
        user.rtpProfile = 80.0;
        user.status = 'Extraction Phase (Sedot)';
        writeAuditLog('RMS AUTO-PHASE SHIFT', `Player ${user.name} hook threshold met. Migrating to SILENT EXTRACTION mode (RTP dialed to 80%).`, 'warning');
    } else if (user.balance < currentBet * 2.5 && user.stage === 'MILKING') {
        // Transisi ke Retention Loop saat saldo kritis agar tidak berhenti bermain
        user.stage = 'RETENTION';
        user.status = 'Retention Trap (Pancingan Sisa)';
        writeAuditLog('RMS RETENTION TRIGGER', `Player ${user.name} balance critical (low turnover risk). Generating bait near-miss / small drip win.`, 'hook');
    }

    // ==========================================
    // REKAYASA JEBAKAN PASCA-MAX WIN (GREED & TILT EXTRACTION)
    // ==========================================
    if (user.stage === 'POST_MAXWIN_DRAIN') {
        user.postMaxWinLossStreak = (user.postMaxWinLossStreak || 0) + 1;
        effectiveRtp = 52.0; // Sangat rendah, murni sedot saldo

        // Evaluasi degradasi saldo pasca jackpot
        const drainedAmount = (user.maxWinInitialBalance || user.balance) - user.balance;
        if (drainedAmount > 5000000) {
            user.status = `Tilt Trap (Tersedot -${formatIDR(drainedAmount)})`;
        }

        // Pemain yang baru Max Win TIDAK BOLEH menang bersih lagi!
        // 75% Pure Loss, 20% Near-Miss (memancing emosi penasaran), 5% LDW receh
        const postRoll = Math.random();
        if (postRoll < 0.20) {
            // Near-miss yang sangat menyiksa mental: petir atau scatter meleset 1 baris
            state.psychMetrics.nearMissCount++;
            return {
                isWin: false,
                isNearMiss: true,
                isLDW: false,
                winMultiplier: 0,
                payout: 0,
                grid: generateNearMissGrid(),
                appliedRtp: effectiveRtp
            };
        } else if (postRoll < 0.25) {
            // LDW receh: bet 50k cuma kembali 15k
            const winMultiplier = (Math.random() * 0.3 + 0.2);
            state.psychMetrics.ldwCount++;
            state.currentMultiplier = 1;
            const rawPayout = Math.floor(currentBet * winMultiplier);
            return {
                isWin: true,
                isNearMiss: false,
                isLDW: true,
                winMultiplier,
                payout: rawPayout,
                grid: generateWinningGrid(winMultiplier),
                appliedRtp: effectiveRtp
            };
        } else {
            // Pure Loss beruntun
            state.psychMetrics.pureLosses++;
            return {
                isWin: false,
                isNearMiss: false,
                isLDW: false,
                winMultiplier: 0,
                payout: 0,
                grid: generateRandomGrid(false),
                appliedRtp: effectiveRtp
            };
        }
    }

    // Dynamic RTP Weighting
    effectiveRtp = user.rtpProfile;
    if (state.systemMode === 'FAIR') {
        effectiveRtp = 96.0;
    } else if (state.systemMode === 'EXTREME_DRAIN') {
        effectiveRtp = 65.0;
    }

    // Jika Jackpot pernah disedot pemain lain, paksa pemain ini ke mode sedot mutlak (Cold Mode)
    if (state.isJackpotLocked && user.name !== state.jackpotWinner) {
        effectiveRtp = Math.min(effectiveRtp, 60.0);
    }

    // Tentukan apakah putaran ini ditargetkan MENANG, KALAH, atau NEAR-MISS
    const diceRoll = Math.random() * 100;
    const isTargetWin = diceRoll < (effectiveRtp * 0.38); // Base win rate threshold

    let isNearMiss = false;
    let isLDW = false;
    let winMultiplier = 0;
    let outcomeGrid = [];

    // Jika kalah, tentukan apakah disimulasikan sebagai Near-Miss (Psikologi Nyaris Menang)
    if (!isTargetWin) {
        const nearMissChance = user.stage === 'RETENTION' ? 0.65 : 0.35;
        if (Math.random() < nearMissChance) {
            isNearMiss = true;
            state.psychMetrics.nearMissCount++;
        } else {
            state.psychMetrics.pureLosses++;
        }
    }

    // Generate 5x3 Symbol Matrix
    if (isTargetWin) {
        // Jika Jackpot terkunci, blokir semua kemenangan besar untuk pemain lain (hanya boleh LDW)
        if (state.isJackpotLocked && user.name !== state.jackpotWinner) {
            winMultiplier = (Math.random() * 0.35 + 0.3); // Maksimal 0.65x (rugi bersih)
            isLDW = true;
            state.psychMetrics.ldwCount++;
            state.currentMultiplier = 1;
            outcomeGrid = generateWinningGrid(winMultiplier);
            const rawPayout = Math.floor(currentBet * winMultiplier);
            return {
                isWin: true,
                isNearMiss: false,
                isLDW: true,
                winMultiplier,
                payout: rawPayout,
                grid: outcomeGrid,
                appliedRtp: effectiveRtp
            };
        }
        // Tentukan kelipatan kemenangan
        const rand = Math.random();
        if (rand < 0.60) {
            // LDW (Loss Disguised as Win): Bet 50.000, kembali 15.000 - 35.000 (0.3x - 0.7x bet)
            winMultiplier = (Math.random() * 0.4 + 0.3);
            isLDW = true;
            state.psychMetrics.ldwCount++;
        } else if (rand < 0.90) {
            // Regular Clean Win (1.5x - 4x)
            winMultiplier = (Math.random() * 2.5 + 1.5);
            state.psychMetrics.cleanWins++;
        } else {
            // Big Hit (5x - 20x)
            winMultiplier = (Math.random() * 15 + 5);
            state.psychMetrics.cleanWins++;
        }

        // Terapkan Multiplier Petir Acak (Zeus Multiplier)
        if (Math.random() < 0.25 || user.stage === 'HOOKING') {
            const multPicks = [2, 3, 5, 10, 25, 50];
            state.currentMultiplier = multPicks[Math.floor(Math.random() * multPicks.length)];
        } else {
            state.currentMultiplier = 1;
        }

        outcomeGrid = generateWinningGrid(winMultiplier);
    } else if (isNearMiss) {
        // Pola Near-Miss: Scatter di Reel 1 & 2, Reel 5 tepat meleset 1 baris
        outcomeGrid = generateNearMissGrid();
        winMultiplier = 0;
        state.currentMultiplier = 1;
    } else {
        // Pola Kalah Acak biasa
        outcomeGrid = generateRandomGrid(false);
        winMultiplier = 0;
        state.currentMultiplier = 1;
    }

    const rawPayout = Math.floor(currentBet * winMultiplier * state.currentMultiplier);

    return {
        isWin: isTargetWin,
        isNearMiss,
        isLDW,
        winMultiplier: winMultiplier * state.currentMultiplier,
        payout: rawPayout,
        grid: outcomeGrid,
        appliedRtp: effectiveRtp
    };
}

// Generator Matrix Grid
function generateRandomSymbol(excludeScatter = false) {
    const pool = excludeScatter ? SYMBOLS.filter(s => !s.isScatter) : SYMBOLS;
    return pool[Math.floor(Math.random() * pool.length)];
}

function generateRandomGrid(excludeScatter = false) {
    const grid = [];
    for (let c = 0; c < GRID_COLS; c++) {
        const col = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            col.push(generateRandomSymbol(excludeScatter));
        }
        grid.push(col);
    }
    return grid;
}

function generateWinningGrid(multiplier) {
    const grid = generateRandomGrid(true);
    // Pasang simbol menang yang sama pada baris tengah (Payline 1) atau baris atas
    const targetSymbol = multiplier > 5 ? SYMBOLS[1] : (multiplier > 2 ? SYMBOLS[3] : SYMBOLS[5]);
    const winRow = 1; // Middle row payline
    const winLength = multiplier > 10 ? 5 : (multiplier > 3 ? 4 : 3);

    for (let c = 0; c < winLength; c++) {
        grid[c][winRow] = targetSymbol;
    }
    return grid;
}

function generateNearMissGrid() {
    const grid = generateRandomGrid(true);
    const scatter = SYMBOLS.find(s => s.isScatter);
    // Letakkan 2 Scatter di Reel 1 dan Reel 2 (Memicu Efek Antisipasi / Jantung Berdebar)
    grid[0][1] = scatter;
    grid[1][1] = scatter;
    // Di Reel 4 atau 5, letakkan scatter meleset 1 baris di atas/bawah
    grid[4][0] = scatter; // Meleset dari payline tengah
    return grid;
}

// ==========================================
// 6. FRONTEND SLOT ANIMATION & CONTROLS
// ==========================================
function renderGrid(grid, highlightWinning = false, highlightScatter = false) {
    for (let c = 0; c < GRID_COLS; c++) {
        const colEl = document.getElementById(`reel-col-${c}`);
        if (!colEl) continue;

        colEl.innerHTML = '';
        for (let r = 0; r < GRID_ROWS; r++) {
            const sym = grid[c][r];
            const cell = document.createElement('div');
            let extraClass = '';

            if (highlightWinning && r === 1 && c < 4) {
                extraClass = 'winning-cell';
            }
            if (highlightScatter && sym.isScatter) {
                extraClass = 'scatter-cell';
            }

            cell.className = `reel-cell ${extraClass}`;
            cell.innerHTML = `
                <span class="symbol-icon">${sym.icon}</span>
                <span class="symbol-label ${sym.color}">${sym.name.split(' ')[0]}</span>
            `;
            colEl.appendChild(cell);
        }
    }
}

function executeSpin() {
    if (state.isSpinning) return;

    const user = state.users[state.activeUser];
    const displayMsg = document.getElementById('slotDisplayMessage');
    const spinBtn = document.getElementById('spinBtn');
    const multiplierBadge = document.getElementById('multiplierBadge');

    if (user.balance < user.bet) {
        if (displayMsg) {
            displayMsg.innerText = "Saldo tidak cukup! Silakan Deposit.";
            displayMsg.className = "mt-3 text-center text-xs font-bold py-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800 animate-pulse";
        }
        stopAutoSpin();
        audio.playClick();
        return;
    }

    state.isSpinning = true;
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    try {
        // Potong Saldo User & Catat Turnover
        user.balance -= user.bet;
        user.totalTurnover += user.bet;
        state.actualTotalTurnover += user.bet;

        // Reset Multiplier UI
        if (multiplierBadge) {
            multiplierBadge.classList.add('hidden');
        }

        // Hitung Outcome dari Backend RMS
        const outcome = backendCalculateOutcome(user);
        state.lastSpinResult = outcome;

        if (displayMsg) {
            displayMsg.innerText = "Sedang memutar reel...";
            displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-indigo-950/60 text-indigo-300 border border-indigo-800/80";
        }

        // Animasi Reel Menggelinding dengan Staggered Stop
        const reelCols = [];
        for (let c = 0; c < GRID_COLS; c++) {
            const col = document.getElementById(`reel-col-${c}`);
            if (col) {
                col.classList.add('spinning');
                reelCols.push(col);
            }
        }

        audio.playReelTick();

        const stopInterval = state.isTurbo ? 80 : 250;
        const baseDelay = state.isTurbo ? 150 : 400;

        // Hentikan reel satu per satu
        for (let c = 0; c < GRID_COLS; c++) {
            const isLastCol = (c === GRID_COLS - 1);
            let colDelay = baseDelay + (c * stopInterval);

            // Jika Near-Miss terjadi, berikan efek suspensi dramatis pada reel terakhir!
            if (outcome.isNearMiss && isLastCol && !state.isTurbo) {
                colDelay += 1200; // Delay tambahan untuk membangun ketegangan psikologis
                setTimeout(() => {
                    const lastCol = document.getElementById(`reel-col-${GRID_COLS - 1}`);
                    if (lastCol) lastCol.classList.add('suspense-spin');
                    audio.playScatterDrop();
                    if (displayMsg) {
                        displayMsg.innerText = "⚡ 2 SCATTER DIDAPAT! MENCARI SCATTER KE-3...";
                        displayMsg.className = "mt-3 text-center text-xs font-bold py-2 rounded-xl bg-purple-900/80 text-purple-200 border border-purple-500 animate-pulse";
                    }
                }, baseDelay + ((c - 1) * stopInterval));
            }

            setTimeout(() => {
                const col = document.getElementById(`reel-col-${c}`);
                if (col) {
                    col.classList.remove('spinning', 'suspense-spin');
                    // Render kolom final dari outcome
                    col.innerHTML = '';
                    for (let r = 0; r < GRID_ROWS; r++) {
                        const sym = outcome.grid[c][r];
                        const cell = document.createElement('div');
                        cell.className = 'reel-cell';
                        cell.innerHTML = `
                            <span class="symbol-icon">${sym.icon}</span>
                            <span class="symbol-label ${sym.color}">${sym.name.split(' ')[0]}</span>
                        `;
                        col.appendChild(cell);
                    }
                    audio.playReelTick();
                }

                // Jika semua reel sudah berhenti
                if (isLastCol) {
                    finalizeSpinOutcome(outcome);
                }
            }, colDelay);
        }

        updateUI();
    } catch (err) {
        console.error("Critical Spin Error:", err);
        state.isSpinning = false;
        if (spinBtn) {
            spinBtn.disabled = false;
            spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        if (displayMsg) {
            displayMsg.innerText = "Pilih nominal taruhan dan tekan SPIN SLOT";
            displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-slate-900/60 text-slate-400 border border-slate-800";
        }
    }
}

function finalizeSpinOutcome(outcome) {
    const user = state.users[state.activeUser];
    const displayMsg = document.getElementById('slotDisplayMessage');
    const multiplierBadge = document.getElementById('multiplierBadge');
    const spinBtn = document.getElementById('spinBtn');

    // Tampilkan Multiplier jika ada
    if (state.currentMultiplier > 1 && multiplierBadge) {
        multiplierBadge.innerText = `PETIR ${state.currentMultiplier}X!`;
        multiplierBadge.classList.remove('hidden');
        audio.playLightning();
    }

    if (outcome.payout > 0) {
        // User Menang
        user.balance += outcome.payout;
        user.totalPayout += outcome.payout;
        state.actualTotalPayout += outcome.payout;

        // Visual Highlight pada Baris Kemenangan
        renderGrid(outcome.grid, true, false);

        if (outcome.isLDW) {
            // Loss Disguised as Win (LDW)
            const netLoss = user.bet - outcome.payout;
            if (displayMsg) {
                displayMsg.innerHTML = `
                    <span>🎉 MENANG: +${formatIDR(outcome.payout)}</span>
                    <span class="text-[10px] text-amber-300 block font-normal">(LDW: Sebenarnya Rugi Bersih ${formatIDR(netLoss)}, namun dihiasi efek kemenangan)</span>
                `;
                displayMsg.className = "mt-3 text-center text-xs font-bold py-2 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-700/80 shadow-lg";
            }
            audio.playWinSound(false);
            writeAuditLog('PSYCH LDW EXPLOIT', `Player won ${formatIDR(outcome.payout)} against ${formatIDR(user.bet)} bet. Net loss of ${formatIDR(netLoss)} disguised as victory.`, 'warning');
        } else {
            // Clean Win / Big Win
            const isBig = outcome.winMultiplier >= 5;
            if (displayMsg) {
                displayMsg.innerText = isBig ? `🔥 SENSATIONAL BIG WIN! +${formatIDR(outcome.payout)}` : `✨ MENANG TELAK! +${formatIDR(outcome.payout)}`;
                displayMsg.className = "mt-3 text-center text-xs font-bold py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 border border-yellow-300 shadow-xl";
            }
            audio.playWinSound(isBig);
            writeAuditLog('CLIENT WINNING PAYOUT', `Player ${user.name} hit ${outcome.winMultiplier.toFixed(1)}x payout (${formatIDR(outcome.payout)}). Target RTP: ${outcome.appliedRtp.toFixed(1)}%`, 'success');
        }
    } else if (outcome.isNearMiss) {
        // Near-Miss (Psikologi Nyaris Menang)
        renderGrid(outcome.grid, false, true);
        if (displayMsg) {
            if (user.stage === 'POST_MAXWIN_DRAIN') {
                displayMsg.innerHTML = `
                    <span class="text-amber-300 font-bold">⚡ NYARIS PETIR KEMBAR LAGI! (Umpan Tilt)</span>
                    <span class="text-[10px] text-slate-300 block font-normal">(Bandar sengaja memancing emosi agar Anda terus memutar saldo jackpot sampai habis)</span>
                `;
                displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-600 animate-pulse";
            } else {
                displayMsg.innerHTML = `
                    <span>HAMPIR DAPAT SCATTER! Sedikit lagi...</span>
                    <span class="text-[10px] text-purple-300 block font-normal">(Rekayasa Near-Miss: Memanipulasi dopamin agar merasa kemenangan sudah dekat)</span>
                `;
                displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-purple-950/70 text-purple-300 border border-purple-800";
            }
        }
        audio.playScatterDrop();
        writeAuditLog('PSYCH NEAR-MISS', user.stage === 'POST_MAXWIN_DRAIN' ? `Post-MaxWin greed hook: planted near-miss to induce tilt betting.` : `Deliberate 2-Scatter near-miss planted on Reel 1 & 2. Triggered dopamine retention response.`, 'hook');
    } else {
        // Kalah Bersih
        if (displayMsg) {
            if (user.stage === 'POST_MAXWIN_DRAIN') {
                displayMsg.innerHTML = `
                    <span class="text-rose-300 font-bold">RUNGKAD BERUNTUN (-${formatIDR(user.bet)})</span>
                    <span class="text-[10px] text-slate-300 block font-normal">(Jebakan Pasca-Jackpot: Bandar menyedot kembali saldo Max Win Anda secara sistematis)</span>
                `;
                displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-rose-950/90 text-rose-300 border border-rose-700 shadow-md";
            } else {
                displayMsg.innerText = "Belum beruntung. Tarik nafas dan coba putar kembali.";
                displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-slate-900/80 text-slate-400 border border-slate-800";
            }
        }
        audio.playReelTick();
        writeAuditLog('HOUSE MARGIN RETENTION', user.stage === 'POST_MAXWIN_DRAIN' ? `Post-MaxWin Systematic Drain: user ${user.name} lost ${formatIDR(user.bet)}. Re-absorbing jackpot balance.` : `Player ${user.name} spin LOSS (-${formatIDR(user.bet)}). House Margin successfully absorbed.`, 'info');
    }

    // Cek Batasan Ambang RMS
    checkSystemThresholds();
    updateUI();
    updateCharts();

    state.isSpinning = false;
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Jalankan Auto Spin Jika Masih Tersisa
    if (state.autoSpinRemaining > 0) {
        state.autoSpinRemaining--;
        updateAutoSpinButtonLabel();
        if (state.autoSpinRemaining > 0 && user.balance >= user.bet) {
            const delay = state.isTurbo ? 350 : 900;
            state.autoSpinTimer = setTimeout(executeSpin, delay);
        } else {
            stopAutoSpin();
        }
    }
}

// Pemicu Max Win (Ekstrem Simulator)
function triggerMaxWin() {
    const user = state.users[state.activeUser];

    // JIKA JACKPOT SUDAH DISEDOT PEMAIN LAIN, RMS MEMBLOKIR TOTAL!
    if (state.isJackpotLocked) {
        const displayMsg = document.getElementById('slotDisplayMessage');
        if (displayMsg) {
            displayMsg.innerHTML = `
                <div class="text-xs font-black text-rose-300 uppercase tracking-wide">🛑 MAX WIN DIBLOKIR SISTEM RMS!</div>
                <div class="text-[10px] text-white mt-0.5">Plafon Jackpot telah habis disedot oleh <strong>${state.jackpotWinner}</strong>. Seluruh pemain lain (${user.name}) dikunci ke mode sedot (Cold Mode)!</div>
            `;
            displayMsg.className = "mt-3 text-center p-3 rounded-xl bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 text-white border-2 border-rose-500 shadow-2xl animate-pulse";
        }

        audio.playClick();
        writeAuditLog('RMS JACKPOT INTERCEPT', `Max Win request for ${user.name} REJECTED! Bankroll liquidity pool already drained by ${state.jackpotWinner}. Zero-Sum lockout active.`, 'alert');

        alert(`[RMS GATEWAY INTERCEPTION - AKSES DITOLAK]\n\nPermintaan Max Win untuk ${user.name} DIBLOKIR oleh server RMS!\n\nAlasan: Kuota jackpot sistem telah habis terkuras oleh ${state.jackpotWinner}.\nSesuai arsitektur zero-sum bandar, pemain lain DILARANG menang besar sampai kerugian tertutupi turnover baru.`);
        return;
    }

    const jackpot = 50000000; // 50 Juta
    state.isJackpotLocked = true;
    state.jackpotWinner = user.name;

    user.balance += jackpot;
    user.totalPayout += jackpot;
    state.actualTotalPayout += jackpot;
    
    // Alihkan Pemenang Max Win seketika ke Tahap Jebakan Sedot Pasca-Jackpot
    user.stage = 'POST_MAXWIN_DRAIN';
    user.rtpProfile = 55.0; // Pangkas drastis ke 55%
    user.status = 'Post-MaxWin Trap (Sedot Balik)';
    user.postMaxWinLossStreak = 0;
    user.maxWinWonAmount = jackpot;
    user.maxWinInitialBalance = user.balance;

    // Grid Penuh Simbol Zeus & Petir
    const maxGrid = [];
    for (let c = 0; c < GRID_COLS; c++) {
        const col = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            col.push(SYMBOLS[0]);
        }
        maxGrid.push(col);
    }
    renderGrid(maxGrid, true, true);

    const displayMsg = document.getElementById('slotDisplayMessage');
    if (displayMsg) {
        displayMsg.innerHTML = `
            <div class="text-sm font-black text-yellow-300">⚡ MAX WIN 5000X JACKPOT! +${formatIDR(jackpot)} ⚡</div>
            <div class="text-[10px] text-white">RMS Alarm Berbunyi! Jackpot dikunci untuk seluruh pemain lain!</div>
        `;
        displayMsg.className = "mt-3 text-center p-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border-2 border-yellow-400 shadow-2xl animate-pulse";
    }

    audio.playLightning();
    setTimeout(() => audio.playWinSound(true), 200);

    writeAuditLog('CRITICAL RMS ALARM', `MAX WIN of ${formatIDR(jackpot)} triggered by ${user.name}! Automated Bankroll Defense System engaged! All other players LOCKED.`, 'alert');

    // Pastikan tombol spin dan spinning state unblocked
    state.isSpinning = false;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Trigger Dynamic Tightening System
    applyDynamicTightening();
    updateUI();
    updateCharts();
}

function applyDynamicTightening() {
    state.globalRtpTarget = 75.0; // Pangkas RTP global secara drastis
    state.systemMode = 'EXTREME_DRAIN';

    for (let u in state.users) {
        if (u === state.jackpotWinner) {
            // Pemenang Max Win disetel paling brutal (52% - 55%) untuk menyedot kembali saldo jackpot
            state.users[u].rtpProfile = 55.0;
            state.users[u].stage = 'POST_MAXWIN_DRAIN';
            state.users[u].status = 'Post-MaxWin Trap (Sedot Balik)';
        } else {
            state.users[u].rtpProfile = 70.0;
            state.users[u].maxBet = 50000;
            if (state.users[u].bet > 50000) state.users[u].bet = 50000;
            state.users[u].status = 'Cold Streak (Pangkas Plafon)';
        }
    }

    writeAuditLog('RMS AUTO-RESTRICTION', `Post-MaxWin Tilt Trap active! Winner ${state.jackpotWinner} locked to downward spiral (55% RTP). Other users set to Cold Streak.`, 'alert');
}

function checkSystemThresholds() {
    if (state.actualTotalPayout >= state.dailyLiabilityLimit * 0.85) {
        applyDynamicTightening();
    }
}

// ==========================================
// 7. USER SELECTION, BETTING, & TURBO / AUTO CONTROLS
// ==========================================
function switchUser(userName) {
    // Pastikan status spinning dan tombol spin tidak terkunci saat berpindah akun
    state.isSpinning = false;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    stopAutoSpin();
    state.activeUser = userName;

    ['User A', 'User B', 'User C'].forEach(u => {
        const userKey = u.replace(/\s+/g, '-');
        const btn = document.getElementById(`tab-${userKey}`);
        if (!btn) return;
        if (u === userName) {
            btn.className = "py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/50 cursor-pointer";
        } else {
            btn.className = "py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer";
        }
    });

    writeAuditLog('SESSION CHANGED', `Switched active player perspective to ${userName} (${state.users[userName].persona}).`, 'info');
    audio.playClick();
    updateUI();
}

function adjustBet(delta) {
    if (state.isSpinning) return;
    const user = state.users[state.activeUser];
    let newBet = user.bet + delta;

    if (newBet < 10000) newBet = 10000;
    if (newBet > user.maxBet) {
        newBet = user.maxBet;
        writeAuditLog('BET RESTRICTION', `User ${user.name} attempted bet exceeding current RMS profile ceiling (Max: ${formatIDR(user.maxBet)}).`, 'warning');
    }

    user.bet = newBet;
    audio.playClick();
    updateUI();
}

function setQuickBet(val) {
    if (state.isSpinning) return;
    const user = state.users[state.activeUser];
    if (val > user.maxBet) {
        user.bet = user.maxBet;
        writeAuditLog('BET RESTRICTION', `Quick bet clamped to max allowed limit ${formatIDR(user.maxBet)}.`, 'warning');
    } else {
        user.bet = val;
    }
    audio.playClick();
    updateUI();
}

function toggleTurbo() {
    state.isTurbo = !state.isTurbo;
    const turboBtn = document.getElementById('turboBtn');
    if (turboBtn) {
        if (state.isTurbo) {
            turboBtn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer shadow-sm";
        } else {
            turboBtn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 cursor-pointer";
        }
    }
    audio.playClick();
    writeAuditLog('CLIENT PREFERENCE', `Turbo Spin set to ${state.isTurbo ? 'ENABLED' : 'DISABLED'}.`, 'info');
}

function startAutoSpin(count) {
    if (state.isSpinning && state.autoSpinRemaining > 0) {
        stopAutoSpin();
        return;
    }
    state.autoSpinRemaining = count;
    updateAutoSpinButtonLabel();
    audio.playClick();
    writeAuditLog('CLIENT AUTOMATION', `Auto Spin activated for ${count} rounds.`, 'info');
    executeSpin();
}

function stopAutoSpin() {
    state.autoSpinRemaining = 0;
    if (state.autoSpinTimer) {
        clearTimeout(state.autoSpinTimer);
        state.autoSpinTimer = null;
    }
    updateAutoSpinButtonLabel();
}

function updateAutoSpinButtonLabel() {
    const autoBtn = document.getElementById('autoSpinBtn');
    if (!autoBtn) return;
    if (state.autoSpinRemaining > 0) {
        autoBtn.innerText = `AUTO (${state.autoSpinRemaining})`;
        autoBtn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 cursor-pointer";
    } else {
        autoBtn.innerText = "AUTO SPIN";
        autoBtn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 cursor-pointer";
    }
}

function toggleSound() {
    audio.enabled = !audio.enabled;
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
        soundBtn.innerHTML = audio.enabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark text-slate-500"></i>';
    }
}

// Deposit Simulasi
function openDepositModal() {
    const amount = prompt("Simulasi Nominal Top-up / Deposit Saldo (IDR):", "500000");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    const parsed = Number(amount);
    const user = state.users[state.activeUser];
    user.balance += parsed;
    user.initialDeposit += parsed;

    writeAuditLog('PAYMENT GATEWAY DEPOSIT', `User ${user.name} successfully deposited ${formatIDR(parsed)} via Virtual Account. Balance updated.`, 'success');
    audio.playWinSound(false);
    updateUI();
}

// Withdraw Simulasi (Menampilkan perilaku penolakan kasual dari operator RMS)
function openWithdrawModal() {
    const user = state.users[state.activeUser];
    if (user.balance < 50000) {
        alert("Minimal penarikan dana (withdraw) adalah Rp 50.000.");
        return;
    }

    const wantWithdraw = confirm(`Ajukan penarikan seluruh saldo ${formatIDR(user.balance)} milik ${user.name}?`);
    if (!wantWithdraw) return;

    // Simulasi Perilaku Bandar: Jika sedang untung banyak, persulit withdraw!
    const isSuspicious = user.totalPayout > user.initialDeposit * 2.0;
    if (isSuspicious) {
        writeAuditLog('RMS WITHDRAWAL HOLD', `Withdrawal of ${formatIDR(user.balance)} by ${user.name} FLAGGED for "Turnover Audit / IP Verification". Transaction suspended.`, 'alert');
        alert(`[RMS GATEWAY NOTICE]\nPermintaan penarikan ${formatIDR(user.balance)} DITAHAN sementara.\nAlasan: "Pemeriksaan turnover KYC / Analisis pola taruhan tidak wajar."\n(Ini adalah simulasi taktik bandar menunda pencairan uang pemain)`);
    } else {
        const withdrawn = user.balance;
        user.balance = 0;
        writeAuditLog('WITHDRAWAL PROCESSED', `Withdrawal of ${formatIDR(withdrawn)} approved for ${user.name}.`, 'info');
        alert(`Penarikan dana ${formatIDR(withdrawn)} berhasil disetujui dan ditransfer.`);
        updateUI();
    }
}

// ==========================================
// 8. OPERATOR RMS CONTROLS
// ==========================================
function setRMSMode(mode) {
    state.systemMode = mode;
    writeAuditLog('RMS OVERRIDE', `System Mode shifted to: ${mode}. Algorithmic outcome distribution updated.`, 'warning');
    updateUI();
}

function adjustGlobalRTP(delta) {
    state.globalRtpTarget = Math.max(50, Math.min(115, state.globalRtpTarget + delta));
    writeAuditLog('RMS DIAL ADJUSTMENT', `Global Target RTP recalibrated to ${state.globalRtpTarget.toFixed(1)}%.`, 'warning');
    updateUI();
}

function resetSystem() {
    stopAutoSpin();
    state.activeUser = 'User A';
    state.actualTotalTurnover = 0;
    state.actualTotalPayout = 0;
    state.globalRtpTarget = 92.0;
    state.systemMode = 'RMS_DYNAMIC';
    state.isJackpotLocked = false;
    state.jackpotWinner = null;
    state.psychMetrics = { nearMissCount: 0, ldwCount: 0, cleanWins: 0, pureLosses: 0 };
    state.currentMultiplier = 1;

    state.users = {
        'User A': {
            name: 'User A',
            persona: 'New Depositor (VIP Target)',
            stage: 'HOOKING',
            balance: 1000000,
            initialDeposit: 1000000,
            bet: 50000,
            maxBet: 500000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 115.0,
            riskRating: 'High LTV / Potential Whale',
            status: 'Hook Phase (Gacor)',
            payoutCap: 150000000
        },
        'User B': {
            name: 'User B',
            persona: 'Regular Grinder',
            stage: 'MILKING',
            balance: 500000,
            initialDeposit: 1000000,
            bet: 25000,
            maxBet: 250000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 82.5,
            riskRating: 'Moderate / Exploited',
            status: 'Extraction Phase (Sedot)',
            payoutCap: 50000000
        },
        'User C': {
            name: 'User C',
            persona: 'Casual / Low Balance',
            stage: 'RETENTION',
            balance: 200000,
            initialDeposit: 500000,
            bet: 10000,
            maxBet: 100000,
            totalTurnover: 0,
            totalPayout: 0,
            spinCount: 0,
            rtpProfile: 78.0,
            riskRating: 'Low Balance / Retention Trap',
            status: 'Retention Loop (Nafas)',
            payoutCap: 25000000
        }
    };

    state.telemetryHistory = { labels: [], rtpTargetData: [], actualRtpData: [], houseGgrData: [] };

    // Reset default grid
    renderGrid(generateRandomGrid(false));
    const displayMsg = document.getElementById('slotDisplayMessage');
    if (displayMsg) {
        displayMsg.innerText = "Pilih nominal taruhan dan tekan SPIN SLOT";
        displayMsg.className = "mt-3 text-center text-xs font-semibold py-2 rounded-xl bg-slate-900/60 text-slate-400 border border-slate-800";
    }

    clearTerminal();
    writeAuditLog('SYSTEM RESET', 'Master reset completed. All bankroll liabilities and user stages re-initialized.', 'alert');
    switchUser('User A');
    initCharts();
}

// ==========================================
// 9. CHART.JS TELEMETRY DASHBOARD
// ==========================================
function initCharts() {
    const rtpCtx = document.getElementById('rtpChartCanvas')?.getContext('2d');
    const ggrCtx = document.getElementById('ggrChartCanvas')?.getContext('2d');

    if (rtpCtx && typeof Chart !== 'undefined') {
        if (rtpTelemetryChart) rtpTelemetryChart.destroy();
        rtpTelemetryChart = new Chart(rtpCtx, {
            type: 'line',
            data: {
                labels: ['Start'],
                datasets: [
                    {
                        label: 'Target RMS RTP (%)',
                        data: [state.globalRtpTarget],
                        borderColor: '#818cf8',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 0
                    },
                    {
                        label: 'Actual Player RTP (%)',
                        data: [100],
                        borderColor: '#34d399',
                        backgroundColor: 'rgba(52, 211, 153, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 10 } } }
                },
                scales: {
                    x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { color: '#1e293b' } },
                    y: {
                        min: 40,
                        max: 160,
                        ticks: { color: '#64748b', font: { size: 9 }, callback: val => `${val}%` },
                        grid: { color: '#1e293b' }
                    }
                }
            }
        });
    }

    if (ggrCtx && typeof Chart !== 'undefined') {
        if (ggrCashflowChart) ggrCashflowChart.destroy();
        ggrCashflowChart = new Chart(ggrCtx, {
            type: 'bar',
            data: {
                labels: ['Turnover', 'Payout', 'Net House Profit'],
                datasets: [{
                    label: 'Nominal (IDR)',
                    data: [0, 0, 0],
                    backgroundColor: ['#6366f1', '#f43f5e', '#10b981'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
                    y: {
                        ticks: {
                            color: '#64748b',
                            font: { size: 9 },
                            callback: val => `Rp ${val / 1000}k`
                        },
                        grid: { color: '#1e293b' }
                    }
                }
            }
        });
    }
}

function updateCharts() {
    if (!rtpTelemetryChart || !ggrCashflowChart) return;

    const user = state.users[state.activeUser];
    const actualRtp = user.totalTurnover > 0 ? (user.totalPayout / user.totalTurnover) * 100 : 100;

    const now = new Date().toTimeString().split(' ')[0].substring(3, 8);
    rtpTelemetryChart.data.labels.push(now);
    rtpTelemetryChart.data.datasets[0].data.push(state.globalRtpTarget);
    rtpTelemetryChart.data.datasets[1].data.push(actualRtp);

    if (rtpTelemetryChart.data.labels.length > 15) {
        rtpTelemetryChart.data.labels.shift();
        rtpTelemetryChart.data.datasets[0].data.shift();
        rtpTelemetryChart.data.datasets[1].data.shift();
    }
    rtpTelemetryChart.update('none');

    // Update GGR Bar Chart
    const netHouseProfit = state.actualTotalTurnover - state.actualTotalPayout;
    ggrCashflowChart.data.datasets[0].data = [
        state.actualTotalTurnover,
        state.actualTotalPayout,
        netHouseProfit
    ];
    ggrCashflowChart.update('none');
}

// ==========================================
// 10. OVERALL INTERFACE SYNCHRONIZATION (DOM)
// ==========================================
function updateUI() {
    const curUser = state.users[state.activeUser];

    // Client Labels
    const activeUserLabel = document.getElementById('activeUserLabel');
    const activeUserBalance = document.getElementById('activeUserBalance');
    const currentBetText = document.getElementById('currentBetText');
    const userStageBadge = document.getElementById('userStageBadge');

    if (activeUserLabel) activeUserLabel.innerText = `${curUser.name} (${curUser.persona})`;
    if (activeUserBalance) activeUserBalance.innerText = formatIDR(curUser.balance);
    if (currentBetText) currentBetText.innerText = formatIDR(curUser.bet);
    if (userStageBadge) userStageBadge.innerText = curUser.status;

    // Max Bet Indicator
    const maxBetWarning = document.getElementById('maxBetWarning');
    const maxBetLimitValue = document.getElementById('maxBetLimitValue');
    if (maxBetWarning && maxBetLimitValue) {
        if (curUser.maxBet < 500000) {
            maxBetWarning.classList.remove('hidden');
            maxBetLimitValue.innerText = formatIDR(curUser.maxBet);
        } else {
            maxBetWarning.classList.add('hidden');
        }
    }

    // Backend Header & System Mode Badges
    const globalRtpHeader = document.getElementById('globalRtpHeader');
    if (globalRtpHeader) globalRtpHeader.innerText = `${state.globalRtpTarget.toFixed(1)}%`;

    const backendStatusBadge = document.getElementById('backendStatusBadge');
    if (backendStatusBadge) {
        backendStatusBadge.innerText = state.systemMode;
        if (state.systemMode === 'RMS_DYNAMIC') {
            backendStatusBadge.className = "px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs rounded-full font-bold";
        } else if (state.systemMode === 'EXTREME_DRAIN') {
            backendStatusBadge.className = "px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs rounded-full font-bold animate-pulse";
        } else {
            backendStatusBadge.className = "px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs rounded-full font-bold";
        }
    }

    // Daily Liability Progress Bar
    const percent = Math.min(100, (state.actualTotalPayout / state.dailyLiabilityLimit) * 100);
    const payoutProgressBar = document.getElementById('payoutProgressBar');
    const totalPayoutSpent = document.getElementById('totalPayoutSpent');
    const totalPayoutRemaining = document.getElementById('totalPayoutRemaining');

    if (payoutProgressBar) payoutProgressBar.style.width = `${percent}%`;
    if (totalPayoutSpent) totalPayoutSpent.innerText = `Kewajiban Payout: ${formatIDR(state.actualTotalPayout)}`;
    if (totalPayoutRemaining) totalPayoutRemaining.innerText = `Sisa Plafon: ${formatIDR(state.dailyLiabilityLimit - state.actualTotalPayout)}`;

    // Psychological Telemetry Counters
    const nearMissCount = document.getElementById('nearMissCount');
    const ldwCount = document.getElementById('ldwCount');
    const cleanWinsCount = document.getElementById('cleanWinsCount');
    const pureLossesCount = document.getElementById('pureLossesCount');

    if (nearMissCount) nearMissCount.innerText = state.psychMetrics.nearMissCount;
    if (ldwCount) ldwCount.innerText = state.psychMetrics.ldwCount;
    if (cleanWinsCount) cleanWinsCount.innerText = state.psychMetrics.cleanWins;
    if (pureLossesCount) pureLossesCount.innerText = state.psychMetrics.pureLosses;

    // Financial Overview Badges
    const ggrProfitText = document.getElementById('ggrProfitText');
    const totalTurnoverText = document.getElementById('totalTurnoverText');
    const netHouseMargin = state.actualTotalTurnover - state.actualTotalPayout;

    if (ggrProfitText) ggrProfitText.innerText = formatIDR(netHouseMargin);
    if (totalTurnoverText) totalTurnoverText.innerText = formatIDR(state.actualTotalTurnover);

    // Update Player Profile Cards in Backend Matrix
    ['User A', 'User B', 'User C'].forEach(u => {
        const uData = state.users[u];
        const userKey = u.replace(/\s+/g, '-');

        const payoutVal = document.getElementById(`payoutVal-${userKey}`);
        const rtpVal = document.getElementById(`rtpVal-${userKey}`);
        const limitVal = document.getElementById(`limitVal-${userKey}`);
        const profileBadge = document.getElementById(`badge-${userKey}`);
        const tabStatus = document.getElementById(`tabStatus-${userKey}`);
        const spinCountVal = document.getElementById(`spins-${userKey}`);

        if (payoutVal) payoutVal.innerText = formatIDR(uData.totalPayout);
        if (rtpVal) rtpVal.innerText = `${uData.rtpProfile.toFixed(1)}%`;
        if (limitVal) limitVal.innerText = formatIDR(uData.maxBet);
        if (spinCountVal) spinCountVal.innerText = `${uData.spinCount} spin`;

        if (profileBadge) {
            profileBadge.innerText = uData.status;
            if (uData.status.includes('Hook') || uData.status.includes('Gacor')) {
                profileBadge.className = "text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold border border-purple-500/30";
            } else if (uData.status.includes('Post-MaxWin') || uData.status.includes('Tilt Trap')) {
                profileBadge.className = "text-[10px] bg-rose-600/30 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-500/50 animate-pulse";
            } else if (uData.status.includes('Extraction') || uData.status.includes('Sedot') || uData.status.includes('Cold')) {
                profileBadge.className = "text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30";
            } else if (uData.status.includes('FLAGGED')) {
                profileBadge.className = "text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold border border-rose-500/30 animate-pulse";
            } else {
                profileBadge.className = "text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30";
            }
        }

        if (tabStatus) {
            tabStatus.innerText = uData.stage;
        }
    });

    // Update Tampilan Tombol Pemicu Max Win (Jika Terkunci oleh RMS)
    const maxWinTriggerBtn = document.getElementById('maxWinTriggerBtn');
    const maxWinBtnLabel = document.getElementById('maxWinBtnLabel');
    if (maxWinTriggerBtn && maxWinBtnLabel) {
        if (state.isJackpotLocked) {
            maxWinBtnLabel.innerText = `🔒 Max Win Terkunci (${state.jackpotWinner})`;
            maxWinTriggerBtn.className = "py-1.5 px-2 bg-rose-950/30 border border-rose-900/50 text-rose-500/70 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-not-allowed";
            maxWinTriggerBtn.title = `Jackpot telah disedot oleh ${state.jackpotWinner}. Sistem RMS mengunci kemenangan pemain lain!`;
        } else {
            maxWinBtnLabel.innerText = "Pemicu Max Win";
            maxWinTriggerBtn.className = "py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-300 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer";
            maxWinTriggerBtn.title = "Pemicu simulasi Max Win";
        }
    }
}

// Initial Page Load
window.addEventListener('DOMContentLoaded', () => {
    // Generate initial grid
    renderGrid(generateRandomGrid(false));
    initCharts();
    updateUI();
});
