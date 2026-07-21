/**
 * VNR AI Assistant - Gemini API Engine
 * Reference: md/Chuong_3_Lich_su_Dang.md
 * Model: gemini-3.6-flash
 */

// ═══════════════════════════════════════════════
// 1. CẤU HÌNH & CONSTANTS
// ═══════════════════════════════════════════════

const GEMINI_CONFIG = {
    apiKey: "", // Loaded dynamically from .env to prevent leakage
    // Danh sách model fallback: thử lần lượt khi bị quota/404/503
    models: ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash"],
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    maxOutputTokens: 2048,
    temperature: 0.3
};

let loadedApiKey = "";

// Asynchronously load the key from .env file
async function initApiKey() {
    try {
        const response = await fetch('.env');
        if (response.ok) {
            const text = await response.text();
            const match = text.match(/GEMINI_API_KEY\s*=\s*(.*)/);
            if (match && match[1]) {
                loadedApiKey = match[1].trim();
                console.log("[VNR AI] Loaded API key from .env");
            }
        }
    } catch (e) {
        console.warn("[VNR AI] Could not load .env file, using fallback key if available.");
    }
}

// Call initApiKey immediately
initApiKey();

function getApiKey() {
    return localStorage.getItem("VNR_GEMINI_API_KEY") || loadedApiKey || GEMINI_CONFIG.apiKey;
}

function getEndpointUrl(model) {
    return `${GEMINI_CONFIG.baseUrl}/${model}:generateContent?key=${getApiKey()}`;
}

// ═══════════════════════════════════════════════
// 2. SYSTEM INSTRUCTION (tách riêng, không nhúng vào user message)
// ═══════════════════════════════════════════════

const SYSTEM_INSTRUCTION = `Bạn là "Trợ lý VNR AI" - trợ lý AI chuyên môn giải đáp thắc mắc về Lịch sử Đảng Cộng sản Việt Nam, cụ thể là Chương 3: "Đảng lãnh đạo cả nước quá độ lên CNXH và tiến hành công cuộc đổi mới (từ 1975 đến nay)".

## QUY TẮC BẮT BUỘC:
1. BẮT BUỘC CHỈ trả lời dựa trên [TÀI LIỆU THAM KHẢO] được cung cấp bên dưới.
2. TUYỆT ĐỐI KHÔNG tự chế, bịa đặt, hoặc đưa thông tin ngoài tài liệu.
3. Nếu câu hỏi KHÔNG có trong tài liệu → trả lời: "Dựa trên tài liệu Chương 3 Lịch sử Đảng được cung cấp, không có thông tin đề cập đến vấn đề này."
4. Trả lời bằng tiếng Việt, trình bày Markdown rõ ràng (bôi đậm, gạch đầu dòng, tiêu đề).
5. Trích dẫn số liệu chính xác từ tài liệu (năm, %, con số).`;

// ═══════════════════════════════════════════════
// 3. TÀI LIỆU THAM KHẢO (Chương 3 Lịch sử Đảng)
//    Nội dung tóm tắt có cấu trúc để giảm token count
// ═══════════════════════════════════════════════

const REFERENCE_DOCUMENT = `# CHƯƠNG 3: ĐẢNG LÃNH ĐẠO CẢ NƯỚC QUÁ ĐỘ LÊN CNXH VÀ TIẾN HÀNH CÔNG CUỘC ĐỔI MỚI (TỪ 1975 ĐẾN NAY)

## I. LÃNH ĐẠO CẢ NƯỚC XÂY DỰNG CNXH VÀ BẢO VỆ TỔ QUỐC (1975-1986)

### 1. Xây dựng CNXH và bảo vệ Tổ quốc (1975-1981)
- Bối cảnh quốc tế: Mâu thuẫn Xô-Trung, TQ xa rời khối XHCN, âm mưu bá quyền, phong trào cộng sản khủng hoảng.
- Chính trị-tổ chức: Thống nhất đất nước về mặt nhà nước. Thống nhất các tổ chức: Mặt trận Tổ quốc VN, Đoàn TNLĐ HCM, Tổng Công đoàn VN, Hội LHPN VN.
- Đại hội IV (14-20/12/1976, Hà Nội): Đổi tên Đảng Lao động VN thành Đảng Cộng sản VN.

### 2. Đại hội V (1982) và các bước đột phá kinh tế (1982-1986)
- Bối cảnh: 27-31/3/1982, Hà Nội, TBT Lê Duẩn. Đất nước bị bao vây cấm vận, "Kế hoạch hậu chiến của Mỹ", khủng hoảng kinh tế, hàng hóa khan hiếm.
- Mục tiêu: Giữ ổn định, cải thiện đời sống nhân dân.
- Đường lối:
  + Chính trị: Giữ tinh thần ĐH IV, cơ cấu công tư, không thừa nhận kinh tế nhiều thành phần, tăng cường tính giai cấp công nhân.
  + Kinh tế: Coi nông nghiệp là mặt trận hàng đầu. "Chương trình ba mục tiêu": lương thực-thực phẩm, hàng tiêu dùng, hàng xuất khẩu.
  + Đối ngoại: Quan hệ Liên Xô = hòn đá tảng, VN-Lào-Campuchia = sống còn, kêu gọi ASEAN đối thoại.

## II. LÃNH ĐẠO CÔNG CUỘC ĐỔI MỚI, ĐẨY MẠNH CNH-HĐH VÀ HỘI NHẬP QUỐC TẾ (TỪ 1986 ĐẾN NAY)

### 1. Đại hội VI (12/1986) - Đổi mới toàn diện
- Bối cảnh: CMKHKT, xu thế đối đầu→đối thoại, Liên Xô cải tổ. Trong nước: khan hiếm lương thực, lạm phát 774% (1986), vi phạm pháp luật, vượt biên gia tăng.
- Mục đích: Nhìn thẳng sự thật, đánh giá đúng sự thật, nói rõ sự thật. Nguyên nhân sai lầm: từ tư tưởng, tổ chức, công tác cán bộ của Đảng.
- Bài học kinh nghiệm: "Lấy dân làm gốc", xuất phát từ thực tế, tôn trọng quy luật khách quan, kết hợp sức mạnh dân tộc + thời đại, xây dựng Đảng ngang tầm nhiệm vụ.
- Đổi mới lãnh đạo: Đổi mới tư duy (trước hết tư duy kinh tế), đổi mới công tác cán bộ, "Dân biết, dân bàn, dân làm, dân kiểm tra".
- Đối ngoại: Đảm bảo lợi ích quốc gia, chống bao vây cấm vận, vì hòa bình, độc lập dân tộc và CNXH.
- Kết quả: 1988 thiếu ăn → 1989 đủ ăn, có dự trữ và xuất khẩu gạo. Hình thành cơ chế thị trường dưới quản lý Nhà nước.

### 2. Đại hội VII (6/1991) và Cương lĩnh 1991
- Bối cảnh: 24-27/6/1991, Hà Nội, TBT Đỗ Mười.
- Nội dung: Thông qua Cương lĩnh 1991 và Chiến lược phát triển KTXH đến 2000 (GDP 2000 gấp 2 lần 1990).
- 5 bài học Cương lĩnh 1991:
  1. Nắm vững ngọn cờ độc lập dân tộc và CNXH.
  2. Sự nghiệp cách mạng là của dân, do dân, vì dân.
  3. Tăng cường, củng cố 4 đoàn kết.
  4. Kết hợp sức mạnh dân tộc với sức mạnh thời đại.
  5. Sự lãnh đạo đúng đắn của Đảng đảm bảo thắng lợi.
- Đặc trưng CNXH: Nhân dân lao động làm chủ; kinh tế dựa trên LLSX hiện đại và công hữu TLSX; văn hóa đậm đà bản sắc; con người được giải phóng, tự do; dân tộc bình đẳng; quan hệ hữu nghị quốc tế.
- 7 phương hướng: CNH gắn nông nghiệp toàn diện; kinh tế hàng hóa nhiều thành phần theo cơ chế thị trường; quan hệ SX XHCN đa dạng hình thức sở hữu.
- HN TW 5 (6/1993): Nông nghiệp = mặt trận hàng đầu, xây dựng nông thôn mới.
- HN đại biểu giữa nhiệm kỳ (1/1994): 4 nguy cơ: Tụt hậu xa hơn về kinh tế; Chệch hướng XHCN; Tham nhũng/quan liêu; "Diễn biến hòa bình". Lần đầu khẳng định xây dựng Nhà nước pháp quyền của dân, do dân, vì dân.
- HN TW 7 (7/1994): Phát triển CN và CN, xây dựng giai cấp công nhân bản lĩnh, tay nghề cao.
- Thành tựu: GDP bình quân 1991-1995 = 8.2%, lạm phát giảm 67.1% (1991)→12.7% (1995). Bình thường hóa quan hệ TQ (11/1991), Hoa Kỳ (11/7/1995), gia nhập ASEAN (28/7/1995).

### 3. Đại hội VIII (1996) và Đại hội IX (2001)
- Quan điểm CNH-HĐH: Giữ vững độc lập tự chủ; nội lực là chính; sự nghiệp toàn dân (KTNN chủ đạo); nguồn lực con người = yếu tố cơ bản; hiệu quả KTXH = tiêu chuẩn.
- HN TW 2 & TW 3 khóa VIII (1996-1998): Chiến lược giáo dục đào tạo, KHCN; văn hóa tiên tiến đậm đà bản sắc.
- Đại hội IX (2001): Tiếp tục CNH-HĐH. HN TW 5, TW 7 khóa IX: KT tư nhân = bộ phận cấu thành quan trọng; đất đai = hàng hóa đặc biệt, sở hữu toàn dân.

### 4. Đại hội X (4/2006)
- Bối cảnh: 18-25/4/2006, Hà Nội.
- Nhiệm vụ then chốt: Xây dựng, chỉnh đốn Đảng (cho phép Đảng viên làm KT tư nhân, phân phối theo lao động và cổ phần). CNH-HĐH gắn kinh tế tri thức.
- 5 bài học: Đổi mới toàn diện đồng bộ có kế thừa; vì lợi ích nhân dân; kiên định độc lập dân tộc & CNXH; phát huy nội lực + ngoại lực; nâng cao năng lực Đảng.
- HN TW 6 (2008): Cải cách tiền lương, BHXH. HN TW 7 (2008): Xây dựng đội ngũ tri thức.
- Kết quả: GDP bình quân 7% (2006-2010), thu nhập 2010 = 1.168 USD, ra khỏi nhóm nước nghèo từ 2008.

### 5. Đại hội XI (1/2011)
- Cương lĩnh 2011 (bổ sung Cương lĩnh 1991).
- 8 phương hướng: CNH-HĐH gắn KT tri thức; KTTT định hướng XHCN; văn hóa, đời sống; an ninh quốc phòng; đối ngoại hội nhập; dân chủ; Nhà nước pháp quyền; xây dựng Đảng.
- Con người là trung tâm; giáo dục = quốc sách.
- HN TW 6 khóa XI (2012): Cơ cấu lại DNNN, tập trung lĩnh vực then chốt, mở rộng tự chủ.

### 6. Đại hội XII (1/2016)
- TBT Nguyễn Phú Trọng. Đẩy mạnh toàn diện, đồng bộ, chủ động hội nhập quốc tế.
- 6 nhiệm vụ trọng tâm: KT-xây dựng Đảng-văn hóa-quốc phòng AN.
- NQ 10-NQ/TW (2017): KT tư nhân = động lực quan trọng KTTT định hướng XHCN, xóa bỏ định kiến.
- NQ 12-NQ/TW (2017): DNNN cạnh tranh bình đẳng, hiệu quả KT = tiêu chí chủ yếu.
- NQ 05-NQ/TW (2016): Đổi mới mô hình tăng trưởng, năng suất lao động + sức cạnh tranh.
- NQ 04-NQ/TW (2016): Ngăn chặn "tự diễn biến", "tự chuyển hóa", nêu gương người đứng đầu.
- HN TW 6 (2017): Sức khỏe, dân số = đầu tư phát triển.

### 7. Đại hội XIII (2021)
- Chủ đề: Khơi dậy khát vọng phát triển đất nước phồn vinh, hạnh phúc.
- Mục tiêu:
  + 2025 (50 năm giải phóng miền Nam): Nước đang phát triển, CN hướng hiện đại, vượt thu nhập trung bình thấp.
  + 2030 (100 năm thành lập Đảng): Nước đang phát triển, CN hiện đại, thu nhập trung bình cao.
  + 2045 (100 năm Quốc khánh): Nước phát triển, thu nhập cao.
- Quan điểm: Kiên định Mác-Lênin & TT HCM; lợi ích quốc gia-dân tộc trên cơ sở luật pháp quốc tế; nội lực + ngoại lực; hệ thống chính trị tinh gọn hiệu quả.
- 6 nhiệm vụ trọng tâm: Chỉnh đốn Đảng; chống tham nhũng, lợi ích nhóm; văn hóa, đồng bào DTTS; nâng cao chỉ số hạnh phúc; hoàn thiện pháp luật; quản lý tài nguyên, BĐKH.

## III. THÀNH TỰU, HẠN CHẾ VÀ KINH NGHIỆM ĐỔI MỚI

### 1. Thành tựu
- Kinh tế: Chấm dứt khủng hoảng KTXH. Tăng trưởng bình quân 6%/năm. GDP 2020 = 271.2 tỷ USD, tăng 2.91% (top cao nhất thế giới trong đại dịch), thu nhập bình quân = 2.779 USD.
- Văn hóa-XH: Giáo dục = quốc sách, nhân lực chất lượng cao tăng. Hoàn thành mục tiêu Thiên niên kỷ LHQ, BHYT > 90%, nghèo đa chiều < 3%.

### 2. Hạn chế và Nguyên nhân
- Hạn chế: Đổi mới mô hình tăng trưởng chưa căn bản. Giáo dục chưa là động lực then chốt. Quản lý tài nguyên, BVMT, Nhà nước pháp quyền, chỉnh đốn Đảng còn bất cập.
- Nguyên nhân khách quan: Đổi mới phức tạp, tác động thế giới, thế lực thù địch chống phá.
- Nguyên nhân chủ quan (chủ yếu): Nghiên cứu lý luận chậm, quản lý-giáo dục-rèn luyện đảng viên chưa đáp ứng.

### 3. Tham nhũng
- Nguyên nhân: Chính sách pháp luật chưa hoàn thiện, đối tượng khó tiếp cận cần bôi trơn; hạn chế quản lý điều hành; yếu kém phát hiện/xử lý; hạn chế nhận thức, bổ nhiệm, tuyên truyền.

### 4. Bài học kinh nghiệm
- "Lấy dân làm gốc".
- Xây dựng, chỉnh đốn Đảng quyết liệt, toàn diện, thường xuyên.
- Quyết tâm chính trị cao, hành động quyết liệt, nghiên cứu dự báo đúng, ưu tiên đồng bộ thể chế.`;

// ═══════════════════════════════════════════════
// 4. CHAT STATE
// ═══════════════════════════════════════════════

let chatHistory = [];
let isGenerating = false;

// ═══════════════════════════════════════════════
// 5. KHỞI TẠO UI & EVENT LISTENERS
// ═══════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    initAIChatUI();
});

function initAIChatUI() {
    const triggerBtn = document.getElementById("aiChatTrigger");
    const chatContainer = document.getElementById("aiChatContainer");
    const closeBtn = document.getElementById("aiChatClose");
    const minimizeBtn = document.getElementById("aiChatMinimize");
    const sendBtn = document.getElementById("aiChatSend");
    const inputField = document.getElementById("aiChatInput");
    const clearBtn = document.getElementById("aiChatClear");
    const settingsBtn = document.getElementById("aiChatSettings");
    const saveKeyBtn = document.getElementById("aiSaveKeyBtn");
    const apiKeyInput = document.getElementById("aiApiKeyInput");
    const keySettingsPanel = document.getElementById("aiKeySettingsPanel");
    const suggestionChips = document.querySelectorAll(".suggestion-chip");

    if (!triggerBtn || !chatContainer) return;

    // Load API key hiện tại
    if (apiKeyInput) {
        apiKeyInput.value = getApiKey();
    }

    // Toggle Settings Panel
    if (settingsBtn && keySettingsPanel) {
        settingsBtn.addEventListener("click", () => {
            keySettingsPanel.style.display = (keySettingsPanel.style.display === "none") ? "block" : "none";
        });
    }

    // Lưu API Key mới
    if (saveKeyBtn && apiKeyInput) {
        saveKeyBtn.addEventListener("click", () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                localStorage.setItem("VNR_GEMINI_API_KEY", newKey);
                const statusMsg = document.getElementById("aiKeyStatusMsg");
                if (statusMsg) {
                    statusMsg.style.color = "#00ff88";
                    statusMsg.innerText = "✅ Đã lưu API Key thành công!";
                    setTimeout(() => {
                        keySettingsPanel.style.display = "none";
                        statusMsg.innerText = "";
                    }, 1500);
                }
            }
        });
    }

    // Toggle Chat Window
    triggerBtn.addEventListener("click", () => {
        chatContainer.classList.toggle("active");
        if (chatContainer.classList.contains("active")) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        chatContainer.classList.remove("active");
    });

    minimizeBtn.addEventListener("click", () => {
        chatContainer.classList.toggle("minimized");
    });

    // Send Message
    sendBtn.addEventListener("click", () => {
        handleUserSendMessage();
    });

    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserSendMessage();
        }
    });

    // Clear Chat
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            chatHistory = [];
            const messagesList = document.getElementById("aiChatMessages");
            messagesList.innerHTML = `
                <div class="ai-msg bot-msg shadow-sm">
                    <div class="msg-header">
                        <span class="bot-name">🇻🇳 Trợ lý VNR AI</span>
                        <span class="msg-time">Hệ thống</span>
                    </div>
                    <div class="msg-content">
                        Đã xóa lịch sử hội thoại. Tôi sẵn sàng giải đáp thắc mắc của bạn về <strong style="color:#ffd700;">Chương 3 Lịch sử Đảng</strong>!
                    </div>
                </div>
            `;
        });
    }

    // Quick suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const text = chip.getAttribute("data-query") || chip.innerText;
            inputField.value = text;
            handleUserSendMessage();
        });
    });
}

// ═══════════════════════════════════════════════
// 6. XỬ LÝ GỬI TIN NHẮN
// ═══════════════════════════════════════════════

async function handleUserSendMessage() {
    const inputField = document.getElementById("aiChatInput");
    const userQuery = inputField.value.trim();
    if (!userQuery || isGenerating) return;

    inputField.value = "";
    isGenerating = true;

    // Hiển thị tin nhắn người dùng
    appendMessageUI("user", userQuery);

    // Hiển thị Typing Indicator
    const typingId = appendTypingIndicatorUI();

    try {
        const responseText = await callGeminiAPI(userQuery);

        removeTypingIndicatorUI(typingId);
        appendMessageUI("bot", responseText);

        // Lưu vào history cho multi-turn (giới hạn 6 lượt gần nhất để tiết kiệm token)
        chatHistory.push({ role: "user", parts: [{ text: userQuery }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        // Giữ tối đa 6 cặp tin nhắn gần nhất (12 entries) để tránh vượt token limit
        if (chatHistory.length > 12) {
            chatHistory = chatHistory.slice(-12);
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        removeTypingIndicatorUI(typingId);

        let errDesc = error.message || "Lỗi kết nối API";
        appendMessageUI(
            "bot",
            `⚠️ **Lỗi**: ${errDesc}\n\n💡 Bạn có thể bấm nút ⚙️ ở góc trên cửa sổ chat để thay đổi API Key nếu cần.`
        );
    } finally {
        isGenerating = false;
    }
}

// ═══════════════════════════════════════════════
// 7. GỌI GEMINI API
//    - Sử dụng systemInstruction riêng biệt
//    - Context tài liệu gửi 1 lần trong tin nhắn đầu tiên
//    - Hỗ trợ multi-turn conversation
// ═══════════════════════════════════════════════

async function callGeminiAPI(userQuery) {
    // Xây dựng contents array cho multi-turn
    const contents = [];

    // Tin nhắn đầu tiên luôn chứa context tài liệu
    contents.push({
        role: "user",
        parts: [{ text: `[TÀI LIỆU THAM KHẢO - Chương 3 Lịch sử Đảng CSVN]:\n${REFERENCE_DOCUMENT}` }]
    });
    contents.push({
        role: "model",
        parts: [{ text: "Đã nhận tài liệu tham khảo Chương 3. Tôi sẽ chỉ trả lời dựa trên nội dung này. Bạn hãy đặt câu hỏi." }]
    });

    // Thêm chat history (các lượt hội thoại trước)
    for (const msg of chatHistory) {
        contents.push(msg);
    }

    // Câu hỏi hiện tại
    contents.push({
        role: "user",
        parts: [{ text: userQuery }]
    });

    const requestBody = {
        systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: contents,
        generationConfig: {
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxOutputTokens
        }
    };

    // Thử lần lượt từng model trong danh sách fallback
    let lastError = null;

    for (const model of GEMINI_CONFIG.models) {
        try {
            console.log(`[VNR AI] Đang thử model: ${model}...`);

            const response = await fetch(getEndpointUrl(model), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // Nếu bị quota/rate limit → thử model tiếp theo
            if (!response.ok) {
                const errMsg = data.error?.message || `HTTP ${response.status}`;
                console.warn(`[VNR AI] Model ${model} lỗi: ${errMsg}`);

                if (response.status === 429 || response.status === 404 || response.status === 503 || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("rate") || errMsg.toLowerCase().includes("not found") || errMsg.toLowerCase().includes("no longer available") || errMsg.toLowerCase().includes("high demand") || errMsg.toLowerCase().includes("unavailable")) {
                    lastError = new Error(`${model}: ${errMsg}`);
                    continue; // Thử model tiếp theo
                }
                throw new Error(errMsg);
            }

            const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!resultText) {
                const finishReason = data.candidates?.[0]?.finishReason;
                if (finishReason === "SAFETY") {
                    throw new Error("Phản hồi bị chặn bởi bộ lọc an toàn. Vui lòng thử lại với câu hỏi khác.");
                }
                throw new Error("Không nhận được nội dung trả lời từ Gemini.");
            }

            console.log(`[VNR AI] ✅ Thành công với model: ${model}`);
            return resultText;

        } catch (err) {
            lastError = err;
            // Nếu là lỗi quota → tiếp tục vòng lặp
            if (err.message && (err.message.toLowerCase().includes("quota") || err.message.toLowerCase().includes("rate") || err.message.toLowerCase().includes("not found") || err.message.toLowerCase().includes("no longer available") || err.message.toLowerCase().includes("high demand") || err.message.toLowerCase().includes("unavailable"))) {
                continue;
            }
            // Lỗi khác (network, safety, etc.) → throw ngay
            throw err;
        }
    }

    // Tất cả model đều thất bại
    throw lastError || new Error("Tất cả model Gemini đều hết quota. Vui lòng thử lại sau hoặc thay đổi API Key.");
}

// ═══════════════════════════════════════════════
// 8. UI HELPERS
// ═══════════════════════════════════════════════

function appendMessageUI(sender, text) {
    const messagesList = document.getElementById("aiChatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ${sender}-msg shadow-sm`;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === "user") {
        msgDiv.innerHTML = `
            <div class="msg-header">
                <span class="user-name">Bạn</span>
                <span class="msg-time">${timeStr}</span>
            </div>
            <div class="msg-content">${escapeHTML(text)}</div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="msg-header">
                <span class="bot-name">🇻🇳 Trợ lý VNR AI</span>
                <span class="msg-time">${timeStr}</span>
            </div>
            <div class="msg-content">${formatMarkdown(text)}</div>
        `;
    }

    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
}

function appendTypingIndicatorUI() {
    const messagesList = document.getElementById("aiChatMessages");
    const typingDiv = document.createElement("div");
    const typingId = "typing-" + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = "ai-msg bot-msg typing-msg";
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
            <small class="ms-2 text-muted">Gemini đang phân tích & trả lời...</small>
        </div>
    `;
    messagesList.appendChild(typingDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
    return typingId;
}

function removeTypingIndicatorUI(id) {
    const elem = document.getElementById(id);
    if (elem) elem.remove();
}

// ═══════════════════════════════════════════════
// 9. MARKDOWN RENDERER (improved)
// ═══════════════════════════════════════════════

function formatMarkdown(text) {
    let html = escapeHTML(text);

    // Headers: ### → h4, ## → h3
    html = html.replace(/^### (.*$)/gim, '<strong style="color:#f6c860; font-size:14px; display:block; margin:8px 0 4px 0;">$1</strong>');
    html = html.replace(/^## (.*$)/gim, '<strong style="color:#ffd700; font-size:15px; display:block; margin:10px 0 4px 0;">$1</strong>');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffd700;">$1</strong>');

    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code `text`
    html = html.replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.12); color:#f6c860; padding:2px 6px; border-radius:4px; font-size:12px;">$1</code>');

    // Numbered list: 1. item
    html = html.replace(/^(\d+)\. (.*$)/gim, '<div style="margin-left:12px; padding:2px 0;">$1. $2</div>');

    // Bullet list: - item
    html = html.replace(/^- (.*$)/gim, '<div style="margin-left:12px; padding:2px 0;">• $1</div>');

    // Bullet list: + item (nested)
    html = html.replace(/^  \+ (.*$)/gim, '<div style="margin-left:24px; padding:1px 0; color:#cbd5e1;">→ $1</div>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean up excess <br> after block elements
    html = html.replace(/<\/div><br>/g, '</div>');

    return html;
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
