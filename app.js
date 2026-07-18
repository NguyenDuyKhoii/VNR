/**
 * VNR Web Application - JavaScript Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. NAVIGATION & LAYOUT LOGIC
    // ----------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('#home, .section');
    const navLogo = document.getElementById('navLogo');

    // Navbar scroll effect
    function updateNavbarState() {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', () => {
        updateNavbarState();

        // Update active nav link based on scroll position
        let currentSection = '';
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom > 120) {
                currentSection = sec.id;
            }
        });
        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-sec') === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Smooth Scroll to Section
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPos = targetSection.offsetTop - navHeight - 10;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        // Close mobile menu if open
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
    }

    // Nav Links Click Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSec = link.getAttribute('data-sec');
            scrollToSection(targetSec);
            history.pushState(null, null, `#${targetSec}`);
        });
    });

    // Logo Click listener (Go to top)
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, null, '#');
    });

    // CTA buttons - smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
                history.pushState(null, null, href);
            }
        });
    });

    // Handle initial load with Hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => scrollToSection(hash), 300);
    }

    updateNavbarState();

    // ----------------------------------------------------
    // SCROLL REVEAL ANIMATIONS
    // ----------------------------------------------------
    const revealItems = document.querySelectorAll('.reveal-item');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }

    // Page dots — sync with scroll position
    const pageDots = document.querySelectorAll('.page-dots .dot');

    if (pageDots.length) {
        const dotTargets = Array.from(pageDots).map(dot => dot.dataset.target);

        function updatePageDots() {
            let activeIdx = 0;
            dotTargets.forEach((id, idx) => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 200) activeIdx = idx;
            });
            pageDots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIdx));
        }

        window.addEventListener('scroll', updatePageDots, { passive: true });
        updatePageDots();

        pageDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetId = dot.dataset.target;
                if (targetId) scrollToSection(targetId);
            });
        });
    }

    // ----------------------------------------------------
    // 2. INTERACTIVE QUIZ LOGIC
    // ----------------------------------------------------
    const quizData = [
        {
            question: "Đại hội VIII của Đảng (năm 1996) đã đưa ra nhận định mang tính bước ngoặt nào sau đây?",
            options: [
                "Cả nước hoàn thành cơ bản công nghiệp hóa, hiện đại hóa.",
                "Những tiền đề chuẩn bị cho công nghiệp hóa cơ bản đã hoàn thành.",
                "Nước ta bước vào thời kỳ quá độ lên chủ nghĩa xã hội.",
                "Kinh tế tri thức chiếm vai trò chủ đạo trong nền kinh tế Việt Nam."
            ],
            correct: 1,
            explanation: "Đại hội VIII nhận định sau 10 năm đổi mới sơ khởi (1986-1996), nước ta đã cơ bản ra khỏi khủng hoảng kinh tế-xã hội, các tiền đề chuẩn bị cho công nghiệp hóa đã hoàn thành, cho phép chuyển sang thời kỳ đẩy mạnh CNH, HĐH đất nước."
        },
        {
            question: "Việt Nam chính thức gia nhập Tổ chức Thương mại Thế giới (WTO) vào thời gian nào và thuộc giai đoạn Đại hội mấy của Đảng?",
            options: [
                "Tháng 7/1995 - Đại hội VII",
                "Tháng 12/2001 - Đại hội IX",
                "Tháng 1/2007 - Đại hội X",
                "Tháng 1/2016 - Đại hội XII"
            ],
            correct: 2,
            explanation: "Việt Nam chính thức trở thành thành viên thứ 150 của WTO vào ngày 11/01/2007. Quyết sách này nằm trong lộ trình chủ động hội nhập kinh tế quốc tế sâu rộng được khẳng định mạnh mẽ tại Đại hội X."
        },
        {
            question: "Mô hình kinh tế tổng quát của nước ta: 'Nền kinh tế thị trường định hướng xã hội chủ nghĩa' được xác định chính thức tại kỳ Đại hội nào?",
            options: [
                "Đại hội VIII (năm 1996)",
                "Đại hội IX (năm 2001)",
                "Đại hội X (năm 2006)",
                "Đại hội XI (năm 2011)"
            ],
            correct: 1,
            explanation: "Đại hội IX (năm 2001) đã chính thức làm rõ mô hình kinh tế tổng quát của Việt Nam trong thời kỳ quá độ là nền kinh tế thị trường định hướng xã hội chủ nghĩa, vận hành theo quy luật thị trường dưới sự quản lý của Nhà nước."
        },
        {
            question: "Đại hội XI (năm 2011) của Đảng đã xác định bao nhiêu đột phá chiến lược để đẩy mạnh CNH, HĐH đất nước?",
            options: [
                "2 đột phá chiến lược",
                "3 đột phá chiến lược",
                "4 đột phá chiến lược",
                "5 đột phá chiến lược"
            ],
            correct: 1,
            explanation: "Ba đột phá chiến lược gồm: (1) Hoàn thiện thể chế kinh tế thị trường định hướng XHCN; (2) Phát triển nhanh nguồn nhân lực, nhất là nguồn nhân lực chất lượng cao; (3) Xây dựng hệ thống kết cấu hạ tầng đồng bộ hiện đại."
        },
        {
            question: "Theo định hướng tầm nhìn phát triển đất nước đến năm 2045 của Đại hội XIII (năm 2021), Việt Nam phấn đấu đạt mục tiêu gì?",
            options: [
                "Trở thành nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao.",
                "Trở thành nước phát triển, thu nhập cao.",
                "Hoàn thành cơ bản sự nghiệp công nghiệp hóa, hiện đại hóa.",
                "Trở thành quốc gia đứng đầu khối ASEAN về quy mô kinh tế số."
            ],
            correct: 1,
            explanation: "Đại hội XIII đề ra mục tiêu chiến lược: Đến năm 2030 (kỷ niệm 100 năm lập Đảng) trở thành nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao; và đến năm 2045 (kỷ niệm 100 năm thành lập nước) trở thành nước phát triển, thu nhập cao."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionIndex = null;
    let hasAnswered = false;

    // Quiz DOM elements
    const startScreen = document.getElementById('quiz-start');
    const playScreen = document.getElementById('quiz-play');
    const endScreen = document.getElementById('quiz-end');
    
    const startQuizBtn = document.getElementById('startQuizBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    
    const quizProgressFill = document.getElementById('quizProgressFill');
    const questionNumText = document.getElementById('questionNumText');
    const currentScoreIndicator = document.getElementById('currentScoreIndicator');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    const explanationBox = document.getElementById('explanationBox');
    const explanationTitle = document.getElementById('explanationTitle');
    const explanationText = document.getElementById('explanationText');
    const finalScoreVal = document.getElementById('finalScoreVal');
    const resultMessage = document.getElementById('resultMessage');

    // Event Listeners
    startQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', handleNextQuestion);
    restartQuizBtn.addEventListener('click', resetQuiz);

    function startQuiz() {
        startScreen.classList.remove('active');
        playScreen.classList.add('active');
        currentQuestionIndex = 0;
        score = 0;
        loadQuestion();
    }

    function loadQuestion() {
        hasAnswered = false;
        selectedOptionIndex = null;
        nextQuestionBtn.disabled = true;
        
        // Hide explanation
        explanationBox.style.display = 'none';
        explanationBox.classList.remove('correct-explain', 'wrong-explain');

        const currentQuestion = quizData[currentQuestionIndex];
        
        // Update UI info
        questionNumText.textContent = `Câu hỏi ${currentQuestionIndex + 1}/${quizData.length}`;
        currentScoreIndicator.textContent = `Điểm: ${score}`;
        
        // Progress bar
        const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
        quizProgressFill.style.width = `${progressPercentage}%`;

        // Load text
        questionText.textContent = currentQuestion.question;

        // Render options
        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.innerHTML = `<span style="color: var(--color-gold-400); font-weight: 700; margin-right: 8px;">${String.fromCharCode(65 + idx)}.</span> ${option}`;
            btn.addEventListener('click', () => selectOption(idx));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(index) {
        if (hasAnswered) return;
        
        hasAnswered = true;
        selectedOptionIndex = index;
        const currentQuestion = quizData[currentQuestionIndex];
        const optionButtons = optionsContainer.querySelectorAll('.option-btn');

        // Disable all option buttons
        optionButtons.forEach(btn => btn.disabled = true);

        // Check answer
        const isCorrect = (index === currentQuestion.correct);
        
        if (isCorrect) {
            score++;
            currentScoreIndicator.textContent = `Điểm: ${score}`;
            optionButtons[index].classList.add('correct');
            
            explanationTitle.textContent = "Chính Xác! 🎉";
            explanationBox.classList.add('correct-explain');
        } else {
            optionButtons[index].classList.add('wrong');
            optionButtons[currentQuestion.correct].classList.add('correct'); // highlight correct answer
            
            explanationTitle.textContent = "Chưa Chính Xác ❌";
            explanationBox.classList.add('wrong-explain');
        }

        // Show explanation
        explanationText.textContent = currentQuestion.explanation;
        explanationBox.style.display = 'block';

        // Enable next button
        nextQuestionBtn.disabled = false;
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        playScreen.classList.remove('active');
        endScreen.classList.add('active');

        finalScoreVal.textContent = `${score} / ${quizData.length}`;

        // Custom congratulatory message based on score
        if (score === quizData.length) {
            resultMessage.textContent = "Xuất sắc! Bạn đã trả lời đúng tất cả các câu hỏi. Bạn là một chuyên gia lịch sử Đảng!";
        } else if (score >= 3) {
            resultMessage.textContent = "Rất tốt! Bạn nắm khá vững kiến thức về công cuộc đổi mới và hội nhập của nước nhà.";
        } else {
            resultMessage.textContent = "Hoàn thành! Bạn hãy đọc thêm nội dung timeline ở trang trước để củng cố kiến thức nhé!";
        }
    }

    function resetQuiz() {
        endScreen.classList.remove('active');
        startScreen.classList.add('active');
    }
});
