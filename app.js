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
            const targetSec = link.getAttribute('data-sec');
            if (targetSec) {
                e.preventDefault();
                scrollToSection(targetSec);
                history.pushState(null, null, `#${targetSec}`);
            }
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
    let quizData = [];

    async function loadQuizData() {
        try {
            const res = await fetch('./data/quiz.json');
            if (!res.ok) throw new Error("Mã trạng thái HTTP không hợp lệ");
            quizData = await res.json();
            console.log("[VNR Quiz] Tải câu hỏi trắc nghiệm thành công.");
        } catch (err) {
            console.error("[VNR Quiz] Lỗi khi tải câu hỏi:", err);
        }
    }
    loadQuizData();

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
        if (!quizData || quizData.length === 0) {
            alert("Đang tải câu hỏi trắc nghiệm, vui lòng đợi trong giây lát hoặc tải lại trang.");
            return;
        }
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

// ============================================================
// SCROLL REVEAL ANIMATION (IntersectionObserver)
// ============================================================
(function () {
    'use strict';

    // Auto-tag key elements that should reveal on scroll
    // (only elements NOT already inside a .reveal-group)
    const autoRevealSelectors = [
        '.section-header',
        '.congress-section .slide-container',
        '.congress-photo',
        '.congress-analysis-group',
        '.congress-video-wrapper',
        '.analysis-result-bar',
        '.breakthrough-card',
        '.editorial-card',
        '.editorial-result',
        '.ai-tracker-card',
        '.references-section',
        '.saas-card',
        '.saas-career-card',
        '.macro-chart-col',
        '.fta-sidebar-col',
    ];

    autoRevealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Don't double-tag if already a reveal-item
            if (!el.classList.contains('reveal-item') && !el.classList.contains('reveal-section')) {
                el.classList.add('reveal-section');
            }
        });
    });

    // Collect all revealable elements
    const revealElements = document.querySelectorAll('.reveal-item, .reveal-section');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
})();
