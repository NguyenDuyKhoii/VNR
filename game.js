(function() {
/**
 * VNR – Game Chung Sức
 * Family Feud style – Câu hỏi tuần tự, chủ trì nhập tên + keyword
 * Tên người chơi được gợi ý qua HTML datalist autocomplete
 */

// =============================================
// FALLBACK DATA (khi fetch thất bại)
// =============================================
const FALLBACK_DATA = {
  questions: [
    {
      "id": 1,
      "question": "Kể tên các tỉnh, thành phố tập trung nhiều khu công nghiệp, khu chế xuất lớn nhất nước ta hiện nay?",
      "keywords": [
        { "id": 1, "value": "Tỉnh Bình Dương", "aliases": ["binh duong", "tinh binh duong", "bd", "binhduong"], "points": 50 },
        { "id": 2, "value": "Tỉnh Đồng Nai", "aliases": ["dong nai", "tinh dong nai", "dn", "dongnai"], "points": 38 },
        { "id": 3, "value": "Thành phố Hồ Chí Minh", "aliases": ["tp hcm", "sai gon", "ho chi minh", "hcm", "tphcm", "tp ho chi minh", "thanh pho ho chi minh"], "points": 25 },
        { "id": 4, "value": "Tỉnh Bắc Ninh", "aliases": ["bac ninh", "tinh bac ninh", "bn", "bacninh"], "points": 18 },
        { "id": 5, "value": "Thành phố Hải Phòng", "aliases": ["hai phong", "thanh pho hai phong", "hp", "haiphong"], "points": 12 },
        { "id": 6, "value": "Thủ đô Hà Nội", "aliases": ["ha noi", "thu do ha noi", "hn", "hanoi"], "points": 8 },
        { "id": 7, "value": "Tỉnh Long An", "aliases": ["long an", "tinh long an", "la", "longan"], "points": 5 },
        { "id": 8, "value": "Tỉnh Bà Rịa Vũng Tàu", "aliases": ["ba ria vung tau", "vung tau", "brvt", "ba ria", "baria vungtau", "tinh ba ria vung tau"], "points": 3 }
      ],
      "timeLimit": 90,
      "bonusPoint": 30
    },
    {
      "id": 2,
      "question": "Kể tên các mặt hàng nông sản và sản phẩm xuất khẩu chủ lực có giá trị kinh tế cao của Việt Nam khi hội nhập?",
      "keywords": [
        { "id": 1, "value": "Lúa gạo", "aliases": ["gao", "lua gao", "lua", "rice", "xuat khau gao"], "points": 48 },
        { "id": 2, "value": "Cà phê", "aliases": ["ca phe", "coffee", "caphe", "xuat khau ca phe"], "points": 36 },
        { "id": 3, "value": "Hạt điều", "aliases": ["dieu", "hat dieu", "cashew", "xuat khau hat dieu"], "points": 24 },
        { "id": 4, "value": "Thủy hải sản", "aliases": ["thuy san", "hai san", "tom", "ca", "muc", "seafood", "thuy hai san", "tom ca", "ca tra", "tom dong lanh"], "points": 15 },
        { "id": 5, "value": "Trái cây nhiệt đới", "aliases": ["hoa qua", "trai cay", "sau rieng", "thanh long", "nhan", "vai", "trai cay nhiet doi", "nong san trai cay"], "points": 8 },
        { "id": 6, "value": "Hạt tiêu", "aliases": ["tieu", "hat tieu", "pepper"], "points": 4 }
      ],
      "timeLimit": 100,
      "bonusPoint": 30
    },
    {
      "id": 3,
      "question": "Đại hội VIII (1996) đã xác định những động lực và nguồn lực cốt lõi nào để đẩy mạnh công nghiệp hóa, hiện đại hóa đất nước?",
      "keywords": [
        { "id": 1, "value": "Phát huy nguồn lực con người", "aliases": ["nguon luc con nguoi", "con nguoi", "nhan luc", "nhan su", "yeu to con nguoi", "nguon nhan luc", "con nguoi la trung toan", "con nguoi la trung tam", "phat huy con nguoi"], "points": 45 },
        { "id": 2, "value": "Khoa học và Công nghệ", "aliases": ["khoa hoc cong nghe", "khoa hoc va cong nghe", "khcn", "khoa hoc", "cong nghe", "kh cn", "khoa hoc ky thuat", "khkt", "khoa hoc va cong nghe la dong luc"], "points": 32 },
        { "id": 3, "value": "Giáo dục và Đào tạo", "aliases": ["giao duc", "dao tao", "giao duc dao tao", "giao duc va dao tao", "gd dt", "gddt", "truong hoc", "hoc tap", "gd va dt"], "points": 18 },
        { "id": 4, "value": "Xây dựng cơ sở hạ tầng đồng bộ", "aliases": ["ha tang", "co so ha tang", "duong sa", "cau cong", "he thong ha tang", "xay dung ha tang", "ha tang dong bo", "ket cau ha tang"], "points": 8 }
      ],
      "timeLimit": 100,
      "bonusPoint": 30
    },
    {
      "id": 4,
      "question": "Đại hội IX (2001) đã đưa ra những bước đột phá lý luận và chủ trương chiến lược mới nào cho nền kinh tế nước ta?",
      "keywords": [
        { "id": 1, "value": "Kinh tế thị trường định hướng xã hội chủ nghĩa", "aliases": ["kinh te thi truong", "dinh huong xa hoi chu nghia", "kttt", "kinh te thi truong dinh huong xhcn", "kinh te thi truong dinh huong xa hoi chu nghia", "kinh te dinh huong xhcn"], "points": 52 },
        { "id": 2, "value": "Kinh tế tri thức", "aliases": ["kinh te tri thuc", "tri thuc", "phat trien kinh te tri thuc"], "points": 35 },
        { "id": 3, "value": "Công nghiệp hóa rút ngắn", "aliases": ["cnh rut ngan", "rut ngan", "cong nghiep hoa rut ngan", "di tat don dau rut ngan"], "points": 22 },
        { "id": 4, "value": "Chủ động và tích cực hội nhập kinh tế quốc tế", "aliases": ["chu dong va tich cuc hoi nhap", "hoi nhap kinh te", "hoi nhap quoc te", "hoi nhap kinh te quoc te", "chu dong hoi nhap"], "points": 12 },
        { "id": 5, "value": "Thực hiện đi tắt đón đầu", "aliases": ["di tat don dau", "di tat", "don dau"], "points": 5 }
      ],
      "timeLimit": 120,
      "bonusPoint": 40
    },
    {
      "id": 5,
      "question": "Đại hội X (2006) đã đề ra những quyết sách lịch sử nào giúp giải phóng nguồn lực kinh tế tư nhân và đưa đất nước thoát nghèo?",
      "keywords": [
        { "id": 1, "value": "Cho phép Đảng viên làm kinh tế tư nhân", "aliases": ["dang vien lam kinh te tu nhan", "kinh te tu nhan", "dang vien lam kinh te", "cho phep dang vien lam kinh te", "dang vien lam tu nhan"], "points": 48 },
        { "id": 2, "value": "Đưa nước ta thoát khỏi nhóm nước nghèo", "aliases": ["thoat khoi nhom nuoc ngheo", "thoat ngheo", "dua nuoc ta thoat ngheo", "ra khoi nuoc ngheo", "thoat khoi kem phat trien"], "points": 35 },
        { "id": 3, "value": "Gia nhập Tổ chức Thương mại Thế giới", "aliases": ["gia nhap wto", "wto", "to chuc thuong mai the gioi", "vao wto", "thanh vien wto"], "points": 24 },
        { "id": 4, "value": "Tinh gọn bộ máy hành chính nhà nước", "aliases": ["tinh gon bo may", "bo may hanh chinh", "sap xep bo may", "giam bo may", "tinh gon bo may hanh chinh"], "points": 14 },
        { "id": 5, "value": "Thu hút mạnh mẽ dòng vốn đầu tư trực tiếp nước ngoài", "aliases": ["fdi", "thu hut fdi", "dau tu nuoc ngoai", "dong von fdi", "thu hut dau tu nuoc ngoai"], "points": 6 }
      ],
      "timeLimit": 120,
      "bonusPoint": 40
    },
    {
      "id": 6,
      "question": "Ba đột phá chiến lược được xác định tại Đại hội XI (2011) nhằm đưa nước ta vượt qua bẫy thu nhập trung bình là gì?",
      "keywords": [
        { "id": 1, "value": "Hoàn thiện thể chế kinh tế thị trường", "aliases": ["the che", "the che kinh te thi truong", "hoan thien the che", "hoan thien the chettt", "the che kinh te"], "points": 55 },
        { "id": 2, "value": "Phát triển nguồn nhân lực chất lượng cao", "aliases": ["nhan luc", "nguon nhan luc", "nhan luc chat luong cao", "phat trien nhan luc", "nhan luc chat luong"], "points": 38 },
        { "id": 3, "value": "Xây dựng hệ thống kết cấu hạ tầng đồng bộ", "aliases": ["ha tang", "ket cau ha tang", "ha tang dong bo", "xay dung ha tang", "ha tang giao thong"], "points": 22 }
      ],
      "timeLimit": 90,
      "bonusPoint": 30
    },
    {
      "id": 7,
      "question": "Theo số liệu cập nhật thực tiễn, Việt Nam hiện đang giữ những vị trí, thứ hạng kinh tế nổi bật nào trên bản đồ thế giới?",
      "keywords": [
        { "id": 1, "value": "Xếp thứ ba mươi hai thế giới về quy mô GDP", "aliases": ["xep thu 32", "32 the gioi", "quy mo gdp", "gdp dung thu 32", "gdp xep thu ba muoi hai", "gdp 32"], "points": 48 },
        { "id": 2, "value": "Top hai mươi nền kinh tế hàng đầu về thương mại quốc tế", "aliases": ["top 20 thuong mai", "top 20", "thuong mai quoc te", "thuong mai dung top 20", "top hai muoi thuong mai"], "points": 35 },
        { "id": 3, "value": "Top mười lăm toàn cầu về thu hút đầu tư trực tiếp nước ngoài", "aliases": ["top 15 fdi", "top 15", "dau tu truc tiep nuoc ngoai", "thu hut fdi top 15", "top muoi lam fdi"], "points": 22 },
        { "id": 4, "value": "Tốc độ tăng trưởng GDP đạt tám phẩy không hai phần trăm", "aliases": ["tang truong 8.02%", "8.02%", "tam phay khong hai phan tram", "gdp tang 8.02", "tang truong gdp tam phay khong hai"], "points": 12 },
        { "id": 5, "value": "Quy mô GDP đạt năm trăm mười bốn tỷ USD", "aliases": ["514 ty usd", "514 ty", "514", "nam tram muoi bon ty usd", "gdp dat nam tram muoi bon ty"], "points": 5 }
      ],
      "timeLimit": 120,
      "bonusPoint": 50
    },
    {
      "id": 8,
      "question": "Đại hội XII (2016) đã xác định những chủ trương và nhiệm vụ then chốt nào trong công tác xây dựng Đảng và hội nhập toàn diện?",
      "keywords": [
        { "id": 1, "value": "Đẩy mạnh phòng chống tham nhũng lãng phí", "aliases": ["phong chong tham nhung", "chong tham nhung", "quan lieu lang phi", "phong va chong tham nhung", "lo thi nong", "lo thi nong len"], "points": 46 },
        { "id": 2, "value": "Kinh tế tư nhân là một động lực quan trọng", "aliases": ["kinh te tu nhan", "dong luc quan trong", "kinh te tu nhan la dong luc", "phat trien kinh te tu nhan"], "points": 32 },
        { "id": 3, "value": "Hội nhập quốc tế toàn diện sâu rộng", "aliases": ["hoi nhap toan dien", "hoi nhap quoc te", "hoi nhap toan dien sau rong", "chu dong hoi nhap"], "points": 20 },
        { "id": 4, "value": "Ngăn chặn tự diễn biến tự chuyển hóa", "aliases": ["tu dien bien", "tu chuyen hoa", "ngan chan tu dien bien tu chuyen hoa", "chong tu dien bien"], "points": 12 },
        { "id": 5, "value": "Cử lực lượng tham gia hoạt động gìn giữ hòa bình Liên Hợp Quốc", "aliases": ["gin giu hoa binh", "lien hop quoc", "gin giu hoa binh lhq", "tham gia gin giu hoa binh"], "points": 4 }
      ],
      "timeLimit": 120,
      "bonusPoint": 50
    },
    {
      "id": 9,
      "question": "Ba trụ cột chiến lược cốt lõi tạo nên \"Hệ điều hành\" quốc gia trong tiến trình chuyển đổi số và công nghiệp hóa hiện đại hóa hiện nay?",
      "keywords": [
        { "id": 1, "value": "Kinh tế số", "aliases": ["kinh te so", "kinh tes o"], "points": 50 },
        { "id": 2, "value": "Chính phủ số", "aliases": ["chinh phu so", "chinh phuso"], "points": 35 },
        { "id": 3, "value": "Xã hội số", "aliases": ["xa hoi so", "xa hoiso"], "points": 22 },
        { "id": 4, "value": "Dữ liệu số liên thông", "aliases": ["du lieu so", "du lieu", "du lieu lien thong", "du lieu so lien thong"], "points": 10 }
      ],
      "timeLimit": 100,
      "bonusPoint": 30
    },
    {
      "id": 10,
      "question": "Những lĩnh vực công nghệ số trọng điểm và định hướng nghề nghiệp mũi nhọn được luật hóa làm chiến lược quốc gia của Việt Nam hiện nay?",
      "keywords": [
        { "id": 1, "value": "Công nghiệp bán dẫn và thiết kế vi mạch", "aliases": ["ban dan", "thiet ke vi mach", "chip ban dan", "ic design", "vi mach ban dan", "thiet ke chip"], "points": 48 },
        { "id": 2, "value": "Trí tuệ nhân tạo", "aliases": ["ai", "tri tue nhan tao", "cong nghe ai"], "points": 35 },
        { "id": 3, "value": "Sản xuất thử nghiệm và làm chủ chip bán dẫn", "aliases": ["san xuat thu chip", "lam chu chip ban dan", "che tao chip", "thu nghiem chip"], "points": 22 },
        { "id": 4, "value": "Đào tạo kỹ sư thiết kế vi mạch", "aliases": ["dao tao ky su", "dao tao can bo", "dao tao nhan luc ban dan", "dao tao thiet ke vi mach"], "points": 12 },
        { "id": 5, "value": "Ứng dụng điện toán đám mây và an ninh mạng", "aliases": ["an ninh mang", "dien toan dam may", "cloud", "cloud computing", "cyber security"], "points": 5 }
      ],
      "timeLimit": 120,
      "bonusPoint": 50
    }
  ]
};

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
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.questions || FALLBACK_DATA.questions;
  } catch {
    return FALLBACK_DATA.questions;
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

function updatePlayerDatalist() {
  // Update autocomplete suggestions
  playerSuggestions.innerHTML = state.players
    .map(p => `<option value="${escapeHtml(p)}">`)
    .join('');
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
function startGame() {
  if (state.allQuestions.length === 0) return;

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
  const q = state.allQuestions[state.currentQIdx];
  if (!q) return;

  state.currentQuestion = q;
  state.foundKeywords   = [];
  state.lostTurnPlayers = [];
  state.gameActive      = true;
  showScoresBtn.classList.add('hidden');

  // Trigger thinking music automatically
  playBackgroundMusic('intense');

  // Update header
  questionProgress.textContent = `Câu ${state.currentQIdx + 1} / ${state.allQuestions.length}`;
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
  const isLast    = state.currentQIdx + 1 >= state.allQuestions.length;

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
  if (totalQCount) totalQCount.textContent = state.allQuestions.length;

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
  // Password Verification Logic
  const passwordOverlay = document.getElementById('passwordOverlay');
  const hostPasswordInput = document.getElementById('hostPasswordInput');
  const submitPasswordBtn = document.getElementById('submitPasswordBtn');
  const passwordError = document.getElementById('passwordError');

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
      startDevToolsProtection();
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

  const globalMuteBtn = document.getElementById('globalMuteBtn');
  const globalVolumeSlider = document.getElementById('globalVolumeSlider');
  const toggleIntenseBtn = document.getElementById('toggleIntenseBtn');

  if (lobbyQCount) {
    lobbyQCount.textContent = `📋 ${state.allQuestions.length} câu hỏi · Chơi theo thứ tự`;
  }

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
