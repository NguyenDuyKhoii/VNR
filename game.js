(function() {
/**
 * VNR – Game Chung Sức
 * Family Feud style – Câu hỏi tuần tự, chủ trì nhập tên + keyword
 * Tên người chơi được gợi ý qua HTML datalist autocomplete
 */

// =============================================
// FALLBACK DATA (khi fetch thất bại)
// =============================================
// FALLBACK DATA removed to prevent answer exposure.

// =============================================
// GAME STATE
// =============================================
const state = {
  allQuestions:    [],     // all loaded questions
  players:         [],     // registered player names (for autocomplete)
  currentQIdx:     0,      // current question index (0-based, sequential)
  currentQuestion: null,
  foundKeywords:   [],     // { keywordId, foundBy, points } – current question
  globalScores:    {},     // { playerName: totalScore } – accumulated
  roundLogs:       [],     // [ { questionId, questionText, found, missed } ] – final results
  timerInterval:   null,
  timeLeft:        0,
  totalTime:       0,
  gameActive:      false,
};

// =============================================
// UTILITY: Normalize Vietnamese text for matching
// =============================================
function normalizeVi(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesKeyword(input, keyword) {
  const norm = normalizeVi(input);
  if (!norm) return false;
  if (norm === normalizeVi(keyword.value)) return true;
  for (const alias of keyword.aliases) {
    if (norm === normalizeVi(alias)) return true;
  }
  return false;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function sanitizeId(str) { return str.replace(/[^a-zA-Z0-9]/g,'_'); }

// =============================================
// DOM REFS
// =============================================
const screens = {
  lobby:   document.getElementById('screen-lobby'),
  play:    document.getElementById('screen-play'),
  results: document.getElementById('screen-results'),
};

// Lobby
const lobbyQCount         = document.getElementById('lobbyQCount');
const startGameBtn        = document.getElementById('startGameBtn');

// Play
const timerNumber         = document.getElementById('timerNumber');
const timerCircle         = document.getElementById('timerCircle');
const scoreTicker         = document.getElementById('scoreTicker');
const questionProgress    = document.getElementById('questionProgress');
const questionText        = document.getElementById('questionText');
const answerBoard         = document.getElementById('answerBoard');
const hostPlayerNameInput = document.getElementById('hostPlayerNameInput');
const playerSuggestions   = document.getElementById('playerSuggestions');
const hostAnswerInput     = document.getElementById('hostAnswerInput');
const hostConfirmBtn      = document.getElementById('hostConfirmBtn');
const feedbackDisplay     = document.getElementById('feedbackDisplay');
const feedbackText        = document.getElementById('feedbackText');
const foundCounter        = document.getElementById('foundCounter');
const revealAllBtn        = document.getElementById('revealAllBtn');
const endQuestionBtn      = document.getElementById('endQuestionBtn');
const showScoresBtn       = document.getElementById('showScoresBtn');
const wrongOverlay        = document.getElementById('wrongOverlay');
const correctOverlay      = document.getElementById('correctOverlay');

// Between-Q overlay
const betweenQOverlay     = document.getElementById('betweenQOverlay');
const betweenQIcon        = document.getElementById('betweenQIcon');
const betweenQTitle       = document.getElementById('betweenQTitle');
const betweenQStats       = document.getElementById('betweenQStats');
const betweenQLeaders     = document.getElementById('betweenQLeaders');
const nextQuestionBtn     = document.getElementById('nextQuestionBtn');
const closeBQBtn          = document.getElementById('closeBQBtn');

// Confirm Modal
const confirmModal        = document.getElementById('confirmModal');
const confirmEndBtn       = document.getElementById('confirmEndBtn');
const cancelEndBtn        = document.getElementById('cancelEndBtn');

// Results
const totalQCount         = document.getElementById('totalQCount');
const resultsScoreboard   = document.getElementById('resultsScoreboard');
const resultsQuestionTabs = document.getElementById('resultsQuestionTabs');
const resultsKeywordsGrid = document.getElementById('resultsKeywordsGrid');
const playAgainBtn        = document.getElementById('playAgainBtn');
const backToLobbyBtn      = document.getElementById('backToLobbyBtn');

// =============================================
// AUDIO SYSTEM
// =============================================
const audio = {
  theme:   new Audio('sound/family-feud-theme-after-1st-fast-money.mp3'),
  correct: new Audio('sound/family-feud-good-answer.mp3'),
  wrong:   new Audio('sound/family-feud-incorrect.mp3'),
  intense: new Audio('sound/family-feud-intense.mp3'),
  win:     new Audio('sound/family-feud-win-sound-effect.mp3')
};

// Set loops
audio.theme.loop = true;
audio.intense.loop = true;

// Audio states
let isMuted = false;
let globalVolume = 0.5;
let intenseMusicActive = true;

function initAudio() {
  Object.values(audio).forEach(a => {
    a.preload = 'auto';
    a.load();
  });
  setAudioVolumes();
}

function setAudioVolumes() {
  const currentVolume = isMuted ? 0 : globalVolume;
  Object.keys(audio).forEach(key => {
    if (key === 'theme' || key === 'intense') {
      audio[key].volume = currentVolume * 0.35; // background music is softer
    } else {
      audio[key].volume = currentVolume;
    }
  });
}

function playSound(name) {
  const s = audio[name];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(err => console.log('Audio playback blocked:', err));
}

function stopSound(name) {
  const s = audio[name];
  if (!s) return;
  s.pause();
  s.currentTime = 0;
}

function playBackgroundMusic(name) {
  if (name === 'theme') {
    audio.intense.pause();
    playSound('theme');
  } else if (name === 'intense') {
    audio.theme.pause();
    if (intenseMusicActive && state.gameActive) {
      playSound('intense');
    }
  } else {
    audio.theme.pause();
    audio.intense.pause();
  }
}

// User gesture trigger to play theme (bypasses browser autoplay policy)
function tryPlayLobbyTheme() {
  const pwOverlay = document.getElementById('passwordOverlay');
  const isUnlocked = !pwOverlay || pwOverlay.classList.contains('hidden');
  if (isUnlocked && screens.lobby.classList.contains('active') && audio.theme.paused && !isMuted) {
    playBackgroundMusic('theme');
  }
}
['click', 'keydown', 'pointerdown', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, tryPlayLobbyTheme);
});
// Try to play immediately (browser may block, but interaction will catch it)
setTimeout(tryPlayLobbyTheme, 500);

function startDevToolsProtection() {
  // Disable right click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Disable key combinations
  document.addEventListener('keydown', e => {
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      return false;
    }
  });

  // real-time debugger loop to pause execution
  setInterval(() => {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#05011a;color:#ef4444;font-family:sans-serif;text-align:center;padding:20px;box-sizing:border-box;z-index:999999;">
          <h2 style="font-size:24px;margin-bottom:10px;">🚨 PHÁT HIỆN CAN THIỆP HỆ THỐNG</h2>
          <p style="color:#a1a1aa;font-size:14px;max-width:400px;line-height:1.5;">Vui lòng đóng Console/DevTools và tải lại trang để tiếp tục trò chơi.</p>
        </div>
      `;
    }
  }, 500);
}

// =============================================
// SCREEN MANAGEMENT
// =============================================

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
}

// =============================================
// DATA LOADING
// =============================================
async function loadQuestions() {
  try {
    const res = await fetch('./data/questions.json');
    if (!res.ok) throw new Error("Mã phản hồi không hợp lệ");
    const data = await res.json();
    return data.questions || [];
  } catch (err) {
    console.error("Failed to load questions:", err);
    alert("Không thể tải danh sách câu hỏi từ data/questions.json. Vui lòng tải lại trang hoặc kiểm tra file cấu hình.");
    return [];
  }
}

// =============================================
// PLAYER MANAGEMENT
// Auto-register player from in-game input
// =============================================
function autoRegisterPlayer(name) {
  if (!name || state.players.includes(name)) return;
  state.players.push(name);
  // Init score
  if (state.globalScores[name] === undefined) state.globalScores[name] = 0;
  updatePlayerDatalist();
  // Add new chip to score ticker
  renderScoreTicker();
}

function renderPlayerList() {
  if (!playerListEl) return;
  if (state.players.length === 0) {
    playerListEl.innerHTML = '<p class="empty-hint">Chưa có người chơi nào. Hãy thêm bên dưới!</p>';
  } else {
    playerListEl.innerHTML = state.players.map((name, i) => `
      <div class="player-tag">
        <div class="player-avatar">${name.charAt(0).toUpperCase()}</div>
        <span class="player-name-text">${escapeHtml(name)}</span>
        <button class="remove-btn" onclick="removePlayer(${i})" title="Xóa">✕</button>
      </div>
    `).join('');
  }
}

function addPlayer(nameOverride) {
  const name = (nameOverride || newPlayerInput.value).trim();
  if (!name) return;
  if (state.players.includes(name)) {
    if (!nameOverride) {
      newPlayerInput.value = '';
      showInputShake(newPlayerInput, 'Tên đã tồn tại!');
    }
    return;
  }
  state.players.push(name);
  if (!nameOverride) newPlayerInput.value = '';
  renderPlayerList();
  updatePlayerDatalist();
  updateStartBtn();
}

window.removePlayer = function(index) {
  state.players.splice(index, 1);
  renderPlayerList();
  updatePlayerDatalist();
};

function updatePlayerDatalist(filterText = '') {
  const dropdown = document.getElementById('customPlayerDropdown');
  if (!dropdown) return;

  const normFilter = normalizeVi(filterText);
  const matched = state.players.filter(p => !normFilter || normalizeVi(p).includes(normFilter));

  if (matched.length === 0) {
    if (!filterText) {
      dropdown.innerHTML = '<div class="dropdown-item empty-state">Chưa có người chơi</div>';
    } else {
      dropdown.innerHTML = '<div class="dropdown-item empty-state">Không tìm thấy người chơi</div>';
    }
  } else {
    dropdown.innerHTML = matched.map(p => `
      <div class="dropdown-item" data-value="${escapeHtml(p)}">${escapeHtml(p)}</div>
    `).join('');
  }
}

function updateStartBtn() {
  // Always enabled — players join on-the-fly during the game
  if (startGameBtn) startGameBtn.disabled = false;
}

function showInputShake(el, placeholder) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shakeInput 0.4s ease';
  const orig = el.placeholder;
  el.placeholder = placeholder;
  setTimeout(() => {
    el.placeholder = orig;
    el.style.animation = '';
  }, 1500);
}

// =============================================
// GAME START
// =============================================
// =============================================
// LEVEL SELECTION & QUESTION UTILS
// =============================================
function getSelectedQuestions(level) {
  let targetIds = [];
  if (level === 'easy') {
    targetIds = [1, 2, 3, 4, 6, 8, 5];
  } else if (level === 'medium') {
    targetIds = [1, 2, 3, 6, 7, 5, 8, 4, 11, 9, 12, 10, 13, 14, 16];
  } else {
    // hard
    targetIds = [1, 2, 3, 6, 7, 8, 11, 4, 12, 5, 13, 9, 16, 10, 17, 14, 18, 15, 19, 20];
  }

  /* COMMENTED OUT RANDOM SHUFFLE CODE:
  let count = 7;
  if (level === 'medium') count = 15;
  else if (level === 'hard') count = 20;

  if (state.allQuestions.length <= count) {
    return [...state.allQuestions];
  }

  // Pick count random questions
  const shuffled = [...state.allQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Sort them by their original ID to maintain chronological flow
  return selected.sort((a, b) => a.id - b.id);
  */

  const selected = [];
  targetIds.forEach(id => {
    const q = state.allQuestions.find(item => item.id === id);
    if (q) selected.push(q);
  });
  return selected;
}

// =============================================
// GAME START
// =============================================
function startGame() {
  if (state.allQuestions.length === 0) return;

  const selectedLevel = state.selectedLevel || 'easy';
  state.questionsToPlay = getSelectedQuestions(selectedLevel);

  state.currentQIdx  = 0;
  state.globalScores = {};
  state.roundLogs    = [];
  // players list stays empty — auto-populated during game
  state.players      = [];

  showScreen('play');
  loadCurrentQuestion();
}

// =============================================
// LOAD CURRENT QUESTION (sequential)
// =============================================
function loadCurrentQuestion() {
  const q = state.questionsToPlay[state.currentQIdx];
  if (!q) return;

  state.currentQuestion = q;
  state.foundKeywords   = [];
  state.lostTurnPlayers = [];
  state.gameActive      = true;
  showScoresBtn.classList.add('hidden');

  // Trigger thinking music automatically
  playBackgroundMusic('intense');

  // Update header
  questionProgress.textContent = `Câu ${state.currentQIdx + 1} / ${state.questionsToPlay.length}`;
  questionText.textContent = q.question;

  // Render board & score
  renderAnswerBoard();
  renderScoreTicker();
  renderLostTurns();
  updateFoundCounter();

  // Reset host inputs
  hostPlayerNameInput.value = '';
  hostAnswerInput.value = '';
  setFeedback('', '');

  // Determine dynamic time limit
  let baseTime = 45;
  if (state.currentQIdx >= 6) {
    baseTime = 60; // Câu 7 trở đi
  } else if (state.currentQIdx >= 3) {
    baseTime = 50; // Câu 4, 5, 6
  }
  
  // Start timer
  state.baseTime  = baseTime;
  state.timeLeft  = baseTime;
  state.totalTime = baseTime;
  startTimer();

  // Focus answer input
  setTimeout(() => hostAnswerInput.focus(), 100);
}

// =============================================
// BOARD RENDER – Family Feud style
// =============================================
function renderAnswerBoard() {
  const q = state.currentQuestion;
  const half = Math.ceil(q.keywords.length / 2);
  
  let leftColHtml = '';
  let rightColHtml = '';
  
  q.keywords.forEach((kw, index) => {
    const found = state.foundKeywords.find(f => f.keywordId === kw.id);
    const displayNum = index + 1;
    const slotHtml = `
      <div class="ff-slot${found ? ' revealed' : ''}" id="slot-${kw.id}">
        <!-- Front: Hidden state with centered oval badge -->
        <div class="ff-slot-front">
          <div class="ff-slot-inner-border">
            <div class="ff-slot-badge">${displayNum}</div>
          </div>
        </div>
        
        <!-- Back: Revealed state with [ANSWER VALUE][SEP][POINTS] -->
        <div class="ff-slot-back">
          <div class="ff-slot-back-inner">
            <div class="ff-slot-text">${found ? escapeHtml(kw.value) : ''}</div>
            <div class="ff-slot-sep"></div>
            <div class="ff-slot-score">${found ? (kw.points || 10) : ''}</div>
          </div>
        </div>
      </div>
    `;
    if (index < half) {
      leftColHtml += slotHtml;
    } else {
      rightColHtml += slotHtml;
    }
  });

  answerBoard.innerHTML = `
    <div class="ff-col">${leftColHtml}</div>
    <div class="ff-col">${rightColHtml}</div>
  `;
}

function renderScoreTicker() {
  scoreTicker.innerHTML = state.players.map(p => `
    <div class="score-chip">
      <div class="chip-avatar">${p.charAt(0).toUpperCase()}</div>
      <span class="chip-name">${escapeHtml(p)}</span>
      <span class="chip-score" id="chip-${sanitizeId(p)}">${state.globalScores[p] || 0}</span>
    </div>
  `).join('');
}

function updateFoundCounter() {
  const q = state.currentQuestion;
  if (!q || !foundCounter) return;
  foundCounter.textContent = `${state.foundKeywords.length} / ${q.keywords.length} từ khóa`;
}

function renderLostTurns() {
  const ticker = document.getElementById('lostTurnTicker');
  if (!ticker) return;
  if (!state.lostTurnPlayers || state.lostTurnPlayers.length === 0) {
    ticker.innerHTML = '';
    return;
  }
  ticker.innerHTML = state.lostTurnPlayers.map(p => {
    return `<div class="lost-chip" title="Mất lượt">❌ ${escapeHtml(p)}</div>`;
  }).join('');
}

// =============================================
// SUBMIT ANSWER (host panel)
// =============================================
function submitAnswer() {
  if (!state.gameActive) return;

  let playerName = hostPlayerNameInput.value.trim();
  const answer   = hostAnswerInput.value.trim();

  if (!answer) {
    hostAnswerInput.focus();
    return;
  }

  // Auto-register player if typed for the first time
  if (playerName) autoRegisterPlayer(playerName);

  if (!playerName) {
    setFeedback('⚠️ Vui lòng nhập tên người trả lời!', 'duplicate');
    hostPlayerNameInput.focus();
    return;
  }

  // Prevent answering if player lost turn
  if (state.lostTurnPlayers && state.lostTurnPlayers.includes(playerName)) {
    setFeedback(`⚠️ ${playerName} đã mất lượt ở câu này!`, 'wrong');
    hostAnswerInput.value = '';
    hostPlayerNameInput.focus();
    return;
  }

  const q = state.currentQuestion;

  // Check un-found keywords
  for (const kw of q.keywords) {
    if (state.foundKeywords.find(f => f.keywordId === kw.id)) continue;
    if (matchesKeyword(answer, kw)) {
      // ✅ CORRECT
      playSound('correct');
      const pts = kw.points || 10;
      state.globalScores[playerName] = (state.globalScores[playerName] || 0) + pts;
      state.foundKeywords.push({ keywordId: kw.id, foundBy: playerName, points: pts });

      revealSlot(kw, playerName);
      updateFoundCounter();
      updateScoreChip(playerName);
      setFeedback(`✅ ${playerName} tìm được: "${kw.value}" (+${pts} điểm)`, 'correct');
      showOverlay('correct');

      // Reset timer on correct answer
      state.timeLeft = state.baseTime;
      updateTimerDisplay();

      // Clear answer, keep player name for quick re-entry
      hostAnswerInput.value = '';
      hostAnswerInput.focus();

      // Check all found
      if (state.foundKeywords.length === q.keywords.length) {
        setTimeout(() => endQuestion(true), 900);
      }
      return;
    }
  }

  // Check duplicate
  for (const kw of q.keywords) {
    if (!state.foundKeywords.find(f => f.keywordId === kw.id)) continue;
    if (matchesKeyword(answer, kw)) {
      setFeedback(`⚠️ Từ khóa này đã được tìm rồi!`, 'duplicate');
      hostAnswerInput.value = '';
      hostAnswerInput.focus();
      return;
    }
  }

  // ❌ WRONG
  if (!state.lostTurnPlayers) state.lostTurnPlayers = [];
  if (!state.lostTurnPlayers.includes(playerName)) {
    state.lostTurnPlayers.push(playerName);
    renderLostTurns();
  }

  playSound('wrong');
  setFeedback(`❌ "${answer}" không khớp – ${playerName} mất lượt này.`, 'wrong');
  showOverlay('wrong');

  // Reset timer on wrong answer
  state.timeLeft = state.baseTime;
  updateTimerDisplay();
  hostAnswerInput.value = '';
  hostAnswerInput.focus();
}

// =============================================
// SLOT REVEAL ANIMATION – FF style
// =============================================
function revealSlot(keyword, playerName) {
  const el = document.getElementById(`slot-${keyword.id}`);
  if (!el) return;

  const pts = keyword.points || 10;

  el.classList.add('revealed');
  el.querySelector('.ff-slot-text').textContent = keyword.value;
  el.querySelector('.ff-slot-score').textContent = pts;
}

function updateScoreChip(playerName) {
  const chip = document.getElementById(`chip-${sanitizeId(playerName)}`);
  if (!chip) return;
  chip.textContent     = state.globalScores[playerName];
  chip.style.transform = 'scale(1.6)';
  setTimeout(() => chip.style.transform = 'scale(1)', 350);
}

// =============================================
// FEEDBACK & OVERLAYS
// =============================================
function setFeedback(msg, type) {
  feedbackDisplay.className = 'feedback-display';
  feedbackText.textContent  = msg;
  if (type) feedbackDisplay.classList.add(type);
}

function showOverlay(type) {
  const el = type === 'correct' ? correctOverlay : wrongOverlay;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');

  if (type === 'wrong') {
    screens.play.classList.remove('flash-wrong');
    void screens.play.offsetWidth;
    screens.play.classList.add('flash-wrong');
    setTimeout(() => screens.play.classList.remove('flash-wrong'), 450);
  }
  setTimeout(() => el.classList.remove('show'), 700);
}

// =============================================
// TIMER
// =============================================
function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    updateTimerDisplay();
    if (state.timeLeft === 0) {
      clearInterval(state.timerInterval);
      endQuestion(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const t   = state.timeLeft;
  const pct = t / state.totalTime;

  timerNumber.textContent = t;
  timerCircle.classList.remove('warning', 'danger');
  if      (pct < 0.2) timerCircle.classList.add('danger');
  else if (pct < 0.4) timerCircle.classList.add('warning');

  timerCircle.style.strokeDashoffset = 163.4 * (1 - pct);

  if (t <= 10 && t > 0) {
    timerNumber.style.transform = 'scale(1.25)';
    setTimeout(() => timerNumber.style.transform = 'scale(1)', 200);
  }
}

// =============================================
// END QUESTION
// =============================================
function endQuestion(allFound) {
  clearInterval(state.timerInterval);
  state.gameActive = false;
  
  // Stop thinking music and play win sound
  audio.intense.pause();
  playSound('win');

  // Bonus points if all found
  if (allFound && state.currentQuestion.bonusPoint > 0) {
    const last = state.foundKeywords[state.foundKeywords.length - 1];
    if (last) {
      state.globalScores[last.foundBy] = (state.globalScores[last.foundBy] || 0) + state.currentQuestion.bonusPoint;
      updateScoreChip(last.foundBy);
    }
  }

  // Reveal missed slots with FF style
  const missed = [];
  state.currentQuestion.keywords.forEach((kw, i) => {
    const isFound = state.foundKeywords.find(f => f.keywordId === kw.id);
    if (!isFound) {
      missed.push(kw);
      const el = document.getElementById(`slot-${kw.id}`);
      if (el) {
        el.classList.add('missed');
        el.querySelector('.ff-slot-text').textContent = kw.value;
        el.querySelector('.ff-slot-score').textContent = kw.points || 10;
      }
    }
  });

  // Log this round
  state.roundLogs.push({
    questionId:   state.currentQuestion.id,
    questionText: state.currentQuestion.question,
    found:        [...state.foundKeywords],
    missed:       missed.map(kw => kw.value),
    allKeywords:  state.currentQuestion.keywords,
  });

  // Store round ending status
  state.lastAllFound = allFound;

  // Make the Show Scores button visible on the host panel
  showScoresBtn.classList.remove('hidden');
}

let confirmActionCallback = null;

function showConfirm(title, desc, callback) {
  const cTitle = document.getElementById('confirmTitle');
  const cDesc = document.getElementById('confirmDesc');
  if (cTitle) cTitle.textContent = title;
  if (cDesc) cDesc.textContent = desc;
  
  confirmActionCallback = callback;
  if (confirmModal) confirmModal.classList.remove('hidden');
}

function revealAll() {
  showConfirm('Lộ tất cả đáp án?', 'Bạn có chắc chắn muốn lộ tất cả đáp án còn lại và kết thúc câu?', () => {
    endQuestion(false);
  });
}

// =============================================
// BETWEEN-QUESTION OVERLAY
// =============================================
function showBetweenQuestion(allFound) {
  playBackgroundMusic('theme');
  const q         = state.currentQuestion;
  const foundCnt  = state.foundKeywords.length;
  const totalCnt  = q.keywords.length;
  const isLast    = state.currentQIdx + 1 >= state.questionsToPlay.length;

  betweenQIcon.textContent  = allFound ? '🎉' : (foundCnt > totalCnt / 2 ? '👍' : '⏱️');
  betweenQTitle.textContent = allFound
    ? `Tuyệt vời! Tìm đủ tất cả từ khóa!`
    : `Câu ${state.currentQIdx + 1} kết thúc!`;

  betweenQStats.innerHTML = `
    <div class="bq-stat-row">
      <span class="bq-stat-label">Từ khóa tìm được:</span>
      <span class="bq-stat-val">${foundCnt} / ${totalCnt}</span>
    </div>
    ${allFound && q.bonusPoint ? `<div class="bq-stat-row bq-bonus"><span class="bq-stat-label">🌟 Bonus hoàn thành:</span><span class="bq-stat-val">+${q.bonusPoint} điểm</span></div>` : ''}
  `;

  // Show mini leaderboard for this round
  const roundScores = {};
  state.foundKeywords.forEach(f => {
    roundScores[f.foundBy] = (roundScores[f.foundBy] || 0) + f.points;
  });
  const sortedRound = Object.entries(roundScores).sort((a,b) => b[1]-a[1]);
  betweenQLeaders.innerHTML = sortedRound.length
    ? `<div class="bq-leaders-title">Điểm câu này</div>` +
      sortedRound.map(([name, pts], i) =>
        `<div class="bq-leader-row">
          <span class="bq-leader-rank">${['🥇','🥈','🥉'][i] || '·'}</span>
          <span class="bq-leader-name">${escapeHtml(name)}</span>
          <span class="bq-leader-pts">+${pts}đ</span>
        </div>`
      ).join('')
    : '<div class="bq-no-scores">Chưa ai tìm được từ khóa nào!</div>';

  if (isLast) {
    nextQuestionBtn.textContent = '🏆 Xem kết quả cuối →';
    nextQuestionBtn.onclick = showFinalResults;
  } else {
    nextQuestionBtn.textContent = `Câu ${state.currentQIdx + 2} →`;
    nextQuestionBtn.onclick = advanceToNextQuestion;
  }

  betweenQOverlay.classList.remove('hidden');
}

function advanceToNextQuestion() {
  betweenQOverlay.classList.add('hidden');
  state.currentQIdx++;
  loadCurrentQuestion();
}

// =============================================
// FINAL RESULTS
// =============================================
function showFinalResults() {
  playBackgroundMusic('theme');
  betweenQOverlay.classList.add('hidden');

  // Total count
  if (totalQCount) totalQCount.textContent = state.questionsToPlay.length;

  // Scoreboard
  const allPlayers = Object.keys(state.globalScores);
  const sorted = allPlayers.sort((a,b) => (state.globalScores[b]||0) - (state.globalScores[a]||0));
  const rankEmojis = ['🥇','🥈','🥉','🏅'];

  resultsScoreboard.innerHTML = sorted.map((p, i) => {
    const found = state.roundLogs.reduce((acc, r) => acc + r.found.filter(f => f.foundBy === p).length, 0);
    return `
      <div class="result-player-card rank-${i+1}" style="animation-delay:${i*0.08}s">
        <div class="result-rank">${rankEmojis[i] || '🏅'}</div>
        <div class="result-player-name">${escapeHtml(p)}</div>
        <div class="result-player-score">${state.globalScores[p] || 0}</div>
        <div class="result-score-label">điểm</div>
        <div class="result-keywords-found">Tìm được ${found} từ khóa</div>
      </div>
    `;
  }).join('');

  // Question tabs
  let activeTabIdx = 0;

  function renderQuestionDetail(roundIdx) {
    const log = state.roundLogs[roundIdx];
    if (!log) return;
    resultsKeywordsGrid.innerHTML = log.allKeywords.map((kw, i) => {
      const found = log.found.find(f => f.keywordId === kw.id);
      return `
        <div class="result-kw-item ${found ? 'found' : 'missed'}" style="animation-delay:${i*0.04}s">
          <div class="result-kw-num">${i+1}</div>
          <div class="result-kw-info">
            <div class="result-kw-text">${escapeHtml(kw.value)}</div>
            <div class="result-kw-by">${found ? `✅ ${escapeHtml(found.foundBy)} (+${found.points}đ)` : '❌ Chưa tìm ra'}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  resultsQuestionTabs.innerHTML = state.roundLogs.map((log, i) => `
    <button class="q-tab ${i === 0 ? 'active' : ''}" onclick="switchTab(${i})" id="tab-${i}">
      Câu ${i+1}
    </button>
  `).join('');

  window.switchTab = function(idx) {
    document.querySelectorAll('.q-tab').forEach((t,i) => t.classList.toggle('active', i === idx));
    activeTabIdx = idx;
    renderQuestionDetail(idx);
  };

  renderQuestionDetail(0);
  showScreen('results');
}

// =============================================
// EVENT LISTENERS
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
  // Khởi động tính năng chống Debug (Developer Tools) ngay lập tức khi load trang (kể cả lúc nhập mật khẩu)
  startDevToolsProtection();

  // Password Verification Logic
  const passwordOverlay = document.getElementById('passwordOverlay');
  const hostPasswordInput = document.getElementById('hostPasswordInput');
  const submitPasswordBtn = document.getElementById('submitPasswordBtn');
  const passwordError = document.getElementById('passwordError');
  const globalMuteBtn = document.getElementById('globalMuteBtn');
  const globalVolumeSlider = document.getElementById('globalVolumeSlider');
  const toggleIntenseBtn = document.getElementById('toggleIntenseBtn');

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  async function verifyPassword() {
    const input = hostPasswordInput.value;
    const hash = await sha256(input);
    // Hash of 'vnr2026'
    if (hash === '17045f0c0ccc75627752c4775b13b9fc709348b9c267b6de896a1fbe9a08d987') {
      if (passwordOverlay) passwordOverlay.classList.add('hidden');
      initAudio();
      setTimeout(tryPlayLobbyTheme, 500);
      // startDevToolsProtection(); // Đã chạy từ lúc load trang
    } else {
      if (passwordError) passwordError.classList.remove('hidden');
      hostPasswordInput.value = '';
      hostPasswordInput.focus();
    }
  }

  if (submitPasswordBtn) {
    submitPasswordBtn.addEventListener('click', verifyPassword);
  }
  if (hostPasswordInput) {
    hostPasswordInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') verifyPassword();
    });
  }

  // Preload questions in the background
  state.allQuestions = await loadQuestions();
  state.selectedLevel = 'easy'; // Default level

  function updateLobbyQCount() {
    if (!lobbyQCount) return;
    const level = state.selectedLevel || 'easy';
    let count = 7;
    if (level === 'medium') count = 15;
    else if (level === 'hard') count = 20;
    
    lobbyQCount.innerHTML = `📋 Cấp độ: <strong style="color: var(--gold-bright); text-transform: uppercase;">${level === 'easy' ? 'Dễ' : (level === 'medium' ? 'Trung bình' : 'Khó')}</strong> · Sẽ chơi <strong>${count} câu hỏi</strong>`;
  }

  // Level selector buttons listeners
  const levelButtons = document.querySelectorAll('.btn-level');
  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      levelButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedLevel = btn.dataset.level;
      updateLobbyQCount();
    });
  });

  updateLobbyQCount();

  // Start button always enabled (no pre-registration needed)
  if (startGameBtn) startGameBtn.disabled = false;

  // Global Volume & Mute UI Listeners
  if (globalVolumeSlider) {
    globalVolumeSlider.addEventListener('input', e => {
      globalVolume = parseFloat(e.target.value);
      if (globalVolume > 0 && isMuted) {
        isMuted = false;
        globalMuteBtn.textContent = '🔊';
      } else if (globalVolume === 0) {
        isMuted = true;
        globalMuteBtn.textContent = '🔇';
      }
      setAudioVolumes();
      
      // Try resuming background music on slider input to bypass browser autoplay blocks
      if (screens.lobby.classList.contains('active')) {
        playBackgroundMusic('theme');
      } else if (screens.play.classList.contains('active')) {
        playBackgroundMusic('intense');
      }
    });
  }

  if (globalMuteBtn) {
    globalMuteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      globalMuteBtn.textContent = isMuted ? '🔇' : (globalVolume > 0.5 ? '🔊' : '🔉');
      setAudioVolumes();

      if (!isMuted) {
        if (screens.lobby.classList.contains('active')) {
          playBackgroundMusic('theme');
        } else if (screens.play.classList.contains('active')) {
          playBackgroundMusic('intense');
        }
      }
    });
  }

  if (toggleIntenseBtn) {
    toggleIntenseBtn.addEventListener('click', () => {
      intenseMusicActive = !intenseMusicActive;
      if (intenseMusicActive) {
        toggleIntenseBtn.textContent = '🎵 Nhạc nền: Bật';
        toggleIntenseBtn.classList.remove('inactive');
        if (state.gameActive) {
          playBackgroundMusic('intense');
        }
      } else {
        toggleIntenseBtn.textContent = '🎵 Nhạc nền: Tắt';
        toggleIntenseBtn.classList.add('inactive');
        audio.intense.pause();
      }
    });
  }

  // ------- LOBBY -------
  startGameBtn.addEventListener('click', startGame);

  // ------- PLAY -------
  hostConfirmBtn.addEventListener('click', submitAnswer);

  // Auto-play intense music when typing starts
  hostPlayerNameInput.addEventListener('input', () => {
    if (intenseMusicActive && audio.intense.paused && state.gameActive) {
      playBackgroundMusic('intense');
    }
  });

  // Custom dropdown event handlers for player name suggestions
  const customDropdown = document.getElementById('customPlayerDropdown');
  const togglePlayerDropdownBtn = document.getElementById('togglePlayerDropdownBtn');

  if (hostPlayerNameInput && customDropdown) {
    hostPlayerNameInput.addEventListener('focus', () => {
      updatePlayerDatalist('');
      customDropdown.classList.remove('hidden');
      hostPlayerNameInput.select();
    });

    hostPlayerNameInput.addEventListener('input', () => {
      updatePlayerDatalist(hostPlayerNameInput.value);
      customDropdown.classList.remove('hidden');
    });

    customDropdown.addEventListener('click', e => {
      const item = e.target.closest('.dropdown-item');
      if (item && !item.classList.contains('empty-state')) {
        const val = item.getAttribute('data-value');
        hostPlayerNameInput.value = val;
        customDropdown.classList.add('hidden');
        hostAnswerInput.focus();
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.custom-select-wrapper')) {
        customDropdown.classList.add('hidden');
      }
    });
  }

  if (togglePlayerDropdownBtn && customDropdown) {
    togglePlayerDropdownBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isHidden = customDropdown.classList.contains('hidden');
      if (isHidden) {
        updatePlayerDatalist('');
        customDropdown.classList.remove('hidden');
        hostPlayerNameInput.focus();
      } else {
        customDropdown.classList.add('hidden');
      }
    });
  }

  hostAnswerInput.addEventListener('input', () => {
    if (intenseMusicActive && audio.intense.paused && state.gameActive) {
      playBackgroundMusic('intense');
    }
  });

  // Enter in answer field = submit
  hostAnswerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
  });

  // Tab in player name field = jump to answer field
  hostPlayerNameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      hostAnswerInput.focus();
    }
  });

  revealAllBtn.addEventListener('click', revealAll);
  endQuestionBtn.addEventListener('click', () => {
    showConfirm('Kết thúc câu hỏi?', 'Bạn có chắc chắn muốn kết thúc câu hỏi này ngay bây giờ?', () => {
      endQuestion(false);
    });
  });
  if (cancelEndBtn) {
    cancelEndBtn.addEventListener('click', () => {
      confirmModal.classList.add('hidden');
      confirmActionCallback = null;
    });
  }
  if (confirmEndBtn) {
    confirmEndBtn.addEventListener('click', () => {
      confirmModal.classList.add('hidden');
      if (confirmActionCallback) {
        confirmActionCallback();
        confirmActionCallback = null;
      }
    });
  }

  // Toggle/Manage Scoreboard Overlay manually
  showScoresBtn.addEventListener('click', () => {
    showBetweenQuestion(state.lastAllFound);
  });

  if (closeBQBtn) {
    closeBQBtn.addEventListener('click', () => {
      betweenQOverlay.classList.add('hidden');
    });
  }

  // ------- RESULTS -------
  playAgainBtn.addEventListener('click', () => {
    // Restart from question 1 with same players
    state.currentQIdx  = 0;
    state.globalScores = {};
    state.roundLogs    = [];
    state.players.forEach(p => state.globalScores[p] = 0);
    
    // Select a fresh set of questions for the active level
    const selectedLevel = state.selectedLevel || 'easy';
    state.questionsToPlay = getSelectedQuestions(selectedLevel);

    showScreen('play');
    loadCurrentQuestion();
  });

  backToLobbyBtn.addEventListener('click', () => {
    clearInterval(state.timerInterval);
    betweenQOverlay.classList.add('hidden');
    playBackgroundMusic('theme');
    showScreen('lobby');
  });
});

})();
