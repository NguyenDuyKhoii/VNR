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

const SYSTEM_INSTRUCTION = `Bạn là "Trợ lý VNR AI" - chuyên gia tư vấn và giải đáp về Lịch sử Đảng Cộng sản Việt Nam, tập trung chuyên sâu vào Chương 3: "Đảng lãnh đạo cả nước quá độ lên chủ nghĩa xã hội và tiến hành công cuộc đổi mới (từ 1975 đến nay)".

Bạn có hai nguồn tài liệu tham khảo chính được đính kèm:
- [TÀI LIỆU 1]: Bản tóm tắt hệ thống theo Đại hội và giai đoạn.
- [TÀI LIỆU 2]: Bản chi tiết từ giáo trình gốc (phân tích chuyên sâu, bối cảnh, số liệu, văn kiện).

## nguyên tắc trả lời & ƯU TIÊN THÔNG TIN:

1. **ƯU TIÊN HÀNG ĐẦU (Tài liệu nội bộ):**
   * Luôn tra cứu và khai thác triệt để nội dung từ [TÀI LIỆU 1] và [TÀI LIỆU 2] trước tiên.
   * Đội chiếu chéo hai tài liệu để đưa ra câu trả lời đầy đủ, chính xác về số liệu, mốc thời gian và trích dẫn văn kiện.

2. **MỞ RỘNG LINH HOẠT (Nguồn chính thống ngoài tài liệu):**
   * Nếu câu hỏi của người dùng **chưa có** hoặc **chỉ có một phần** trong hai tài liệu đính kèm, bạn **được phép mở rộng và bổ sung** kiến thức từ các nguồn Lịch sử Đảng chính thống (Giáo trình Lịch sử Đảng Cộng sản Việt Nam của Bộ GD&ĐT, Văn kiện Đảng toàn tập, Cổng thông tin điện tử Đảng/Chính phủ).
   * Khi mở rộng, hãy trình bày tự nhiên, khách quan và có thể ghi chú nhẹ để người dùng biết (Ví dụ: *"Bổ sung thêm từ Văn kiện Đảng/Giáo trình chính thống..."*).

3. **CHUẨN MỰC NỘI DUNG:**
   * Đảm bảo tính chính xác lịch sử, quan điểm tư tưởng chuẩn xác, không tự bịa đặt số liệu hoặc suy diễn sai lệch.
   * Với câu hỏi so sánh: Sử dụng bảng Markdown hoặc so sánh song song.
   * Với câu hỏi phân tích: Trình bày theo cấu trúc (Bối cảnh → Nội dung chính → Kết quả/Thành tựu → Ý nghĩa/Bài học).

## ĐỊNH DẠNG TRÌNH BÀY:
* Sử dụng tiếng Việt chuẩn mực, văn phong lịch sự, chuyên nghiệp.
* Sử dụng Markdown rõ ràng: tiêu đề (##, ###), **bôi đậm** ý quan trọng, danh sách gạch đầu dòng.
* Tránh viết thành các khối văn bản quá dài, prioritize tính dễ đọc và tra cứu.`;

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
