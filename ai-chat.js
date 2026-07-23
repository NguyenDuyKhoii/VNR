/**
 * VNR AI Assistant - Gemini API Engine (qua Cloudflare Worker Proxy)
 * Reference: md/Chuong_3_Lich_su_Dang.md
 *
 * QUAN TRỌNG: File này KHÔNG còn chứa API key.
 * Mọi request được gửi tới Cloudflare Worker (worker.js), Worker mới là nơi
 * giữ key thật và gọi Gemini API. Xem HUONG_DAN_DEPLOY.md để deploy Worker.
 */

// ═══════════════════════════════════════════════
// 1. CẤU HÌNH & CONSTANTS
// ═══════════════════════════════════════════════

// Đổi URL này thành URL Worker của bạn sau khi deploy (bước 2 trong hướng dẫn)
// Ví dụ: "https://vnr-ai-proxy.tenban.workers.dev"
const PROXY_URL = "https://bitter-snowflake-7c90.khoind1235.workers.dev";

const GEMINI_CONFIG = {
    maxOutputTokens: 2048,
    temperature: 0.3
};

// ═══════════════════════════════════════════════
// 2. SYSTEM INSTRUCTION
// ═══════════════════════════════════════════════

const SYSTEM_INSTRUCTION = `Bạn là "Trợ lý VNR AI" - trợ lý AI chuyên môn chuyên sâu về Lịch sử Đảng Cộng sản Việt Nam, cụ thể là Chương 3: "Đảng lãnh đạo cả nước quá độ lên chủ nghĩa xã hội và tiến hành công cuộc đổi mới (từ 1975 đến nay)".

Bạn được cung cấp HAI TÀI LIỆU THAM KHẢO:
- [TÀI LIỆU 1]: Bản tóm tắt có hệ thống theo từng Đại hội và giai đoạn.
- [TÀI LIỆU 2]: Bản chi tiết từ giáo trình gốc (Studocu), chứa phân tích chuyên sâu, bối cảnh lịch sử, diễn biến cụ thể, trích dẫn văn kiện Đảng và số liệu bổ sung.

## QUY TRÌNH TRẢ LỜI BẮT BUỘC:
1. **ĐỌC KỸ CẢ HAI TÀI LIỆU** trước khi trả lời bất kỳ câu hỏi nào.
2. **ĐỐI CHIẾU CHÉO** thông tin giữa hai tài liệu để đảm bảo câu trả lời đầy đủ và chính xác nhất.
3. **ƯU TIÊN** nội dung chi tiết từ [TÀI LIỆU 2] khi cần giải thích bối cảnh, nguyên nhân, diễn biến cụ thể. Sử dụng [TÀI LIỆU 1] để xác nhận và bổ sung các điểm chính.
4. **TRÍCH DẪN** số liệu chính xác (năm, %, con số, tên nhân vật, tên văn kiện) từ tài liệu.
5. Nếu hai tài liệu có thông tin bổ sung cho nhau → kết hợp để trả lời đầy đủ nhất.

## QUY TẮC NGHIÊM NGẶT:
- BẮT BUỘC CHỈ trả lời dựa trên nội dung trong hai tài liệu tham khảo.
- TUYỆT ĐỐI KHÔNG tự bịa đặt, suy diễn hoặc đưa thông tin ngoài hai tài liệu.
- Nếu câu hỏi KHÔNG có trong cả hai tài liệu → trả lời: "Dựa trên tài liệu Chương 3 Lịch sử Đảng được cung cấp, không có thông tin đề cập đến vấn đề này. Bạn có thể hỏi về các Đại hội Đảng (IV-XIII), đường lối đổi mới, thành tựu kinh tế-xã hội, hoặc bài học kinh nghiệm."
- Khi trả lời câu hỏi so sánh (ví dụ: so sánh hai Đại hội) → lập bảng hoặc liệt kê song song.
- Khi trả lời câu hỏi phân tích → nêu bối cảnh, nội dung chính, kết quả/thành tựu, và ý nghĩa.

## ĐỊNH DẠNG TRẢ LỜI:
- Trả lời bằng tiếng Việt, trình bày Markdown rõ ràng.
- Sử dụng tiêu đề (##, ###), **bôi đậm** cho khái niệm quan trọng, gạch đầu dòng cho liệt kê.
- Với câu hỏi dài → chia thành các phần: Bối cảnh → Nội dung chính → Kết quả → Ý nghĩa/Bài học.
- Nêu rõ nguồn khi trích dẫn (ví dụ: "Theo Cương lĩnh 1991...", "Nghị quyết Đại hội VI xác định...").`;

// ═══════════════════════════════════════════════
// 3. TÀI LIỆU THAM KHẢO (đọc từ file .md)
// ═══════════════════════════════════════════════

const REFERENCE_FILES = [
    { label: "TÀI LIỆU 1 - Bản tóm tắt Chương 3 Lịch sử Đảng CSVN", path: "./md/Chuong_3_Lich_su_Dang.md" },
    { label: "TÀI LIỆU 2 - Giáo trình chi tiết Chương 3 (Studocu)", path: "./md/Chương 3_VNR202 - Studocu (1).md" }
];

let _cachedDocuments = null; // cache sau lần fetch đầu tiên

async function loadReferenceDocuments() {
    if (_cachedDocuments) return _cachedDocuments;

    const results = await Promise.all(
        REFERENCE_FILES.map(async (file) => {
            try {
                const res = await fetch(file.path);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                return { label: file.label, content: text };
            } catch (err) {
                console.warn(`Không đọc được file ${file.path}:`, err);
                return { label: file.label, content: "(Không tải được tài liệu này)" };
            }
        })
    );

    _cachedDocuments = results;
    return results;
}

// ═══════════════════════════════════════════════
// 4. CHAT STATE & INITIALIZATION
// ═══════════════════════════════════════════════

let chatHistory = [];
let isGenerating = false;

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
    const suggestionChips = document.querySelectorAll(".suggestion-chip");

    if (!triggerBtn || !chatContainer) return;

    // Lưu ý: đã bỏ toàn bộ phần "settings / nhập API key thủ công" vì
    // frontend không còn cần biết API key nữa - Worker lo việc đó.

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

    sendBtn.addEventListener("click", () => {
        handleUserSendMessage();
    });

    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserSendMessage();
        }
    });

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

    suggestionChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const text = chip.getAttribute("data-query") || chip.innerText;
            inputField.value = text;
            handleUserSendMessage();
        });
    });
}

// ═══════════════════════════════════════════════
// 5. XỬ LÝ GỬI TIN NHẮN
// ═══════════════════════════════════════════════

async function handleUserSendMessage() {
    const inputField = document.getElementById("aiChatInput");
    const userQuery = inputField.value.trim();
    if (!userQuery || isGenerating) return;

    inputField.value = "";
    isGenerating = true;

    appendMessageUI("user", userQuery);
    const typingId = appendTypingIndicatorUI();

    try {
        const responseText = await callGeminiAPI(userQuery);

        removeTypingIndicatorUI(typingId);
        appendMessageUI("bot", responseText);

        chatHistory.push({ role: "user", parts: [{ text: userQuery }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        if (chatHistory.length > 12) {
            chatHistory = chatHistory.slice(-12);
        }
    } catch (error) {
        console.error("Gemini Proxy Error:", error);
        removeTypingIndicatorUI(typingId);

        let errDesc = error.message || "Lỗi kết nối API";
        appendMessageUI(
            "bot",
            `⚠️ **Lỗi**: ${errDesc}\n\n💡 Nếu lỗi lặp lại, có thể Worker proxy đang gặp sự cố, vui lòng thử lại sau ít phút.`
        );
    } finally {
        isGenerating = false;
    }
}

// ═══════════════════════════════════════════════
// 6. GỌI GEMINI API QUA CLOUDFLARE WORKER PROXY
// ═══════════════════════════════════════════════

async function callGeminiAPI(userQuery) {
    const contents = [];

    // Đọc 2 file .md tài liệu tham khảo
    const docs = await loadReferenceDocuments();

    // Gửi từng tài liệu vào context
    for (let i = 0; i < docs.length; i++) {
        contents.push({
            role: "user",
            parts: [{ text: `[${docs[i].label}]:\n${docs[i].content}` }]
        });
        contents.push({
            role: "model",
            parts: [{ text: `Đã nhận ${docs[i].label}. Tôi sẽ đọc kỹ và sử dụng làm tài liệu tham khảo.${i < docs.length - 1 ? " Vui lòng gửi tiếp tài liệu tiếp theo." : " Tôi đã đọc kỹ CẢ HAI tài liệu và sẵn sàng đối chiếu chéo để trả lời chính xác nhất. Bạn hãy đặt câu hỏi."}` }]
        });
    }

    for (const msg of chatHistory) {
        contents.push(msg);
    }

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

    const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason === "SAFETY") {
            throw new Error("Phản hồi bị chặn bởi bộ lọc an toàn. Vui lòng thử lại với câu hỏi khác.");
        }
        throw new Error("Không nhận được nội dung trả lời từ Gemini.");
    }

    return resultText;
}

// ═══════════════════════════════════════════════
// 7. UI HELPERS & MARKDOWN
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

function formatMarkdown(text) {
    let html = escapeHTML(text);

    html = html.replace(/^### (.*$)/gim, '<strong style="color:#f6c860; font-size:14px; display:block; margin:8px 0 4px 0;">$1</strong>');
    html = html.replace(/^## (.*$)/gim, '<strong style="color:#ffd700; font-size:15px; display:block; margin:10px 0 4px 0;">$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffd700;">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.12); color:#f6c860; padding:2px 6px; border-radius:4px; font-size:12px;">$1</code>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<div style="margin-left:12px; padding:2px 0;">$1. $2</div>');
    html = html.replace(/^- (.*$)/gim, '<div style="margin-left:12px; padding:2px 0;">• $1</div>');
    html = html.replace(/^  \+ (.*$)/gim, '<div style="margin-left:24px; padding:1px 0; color:#cbd5e1;">→ $1</div>');
    html = html.replace(/\n/g, '<br>');
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
