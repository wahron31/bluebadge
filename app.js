// Veri yükleme
let quizData = [];
let woordenData = [];
let cognitiefData = [];
let userData = {
    totalQuestions: 156,
    successRate: 78,
    streakDays: 7,
    progress: {
        cognitief: 65,
        taal: 42,
        scenarios: 28,
        gesprek: 15
    }
};

// Veri dosyalarını yükle
async function loadData() {
    try {
        const [quiz, woorden, cognitief] = await Promise.all([
            fetch('data/quiz_questions.json').then(res => res.json()).catch(() => []),
            fetch('data/woorden.json').then(res => res.json()).catch(() => []),
            fetch('data/cognitief.json').then(res => res.json()).catch(() => [])
        ]);
        
        quizData = quiz;
        woordenData = woorden;
        cognitiefData = cognitief;
        
        updateDashboard();
    } catch (error) {
        console.log('Veri dosyaları yüklenirken hata:', error);
        // Örnek verilerle devam et
        loadSampleData();
    }
}

// Örnek veriler
function loadSampleData() {
    woordenData = [
        {
            woord: "Omtrent",
            betekenis: "over, met betrekking tot, aangaande",
            voorbeeld: "Er zijn nog vragen omtrent de nieuwe procedure.",
            type: "voorzetsel"
        },
        {
            woord: "Derhalve",
            betekenis: "daarom, dus, bijgevolg",
            voorbeeld: "De verdachte was niet thuis, derhalve keerden we terug.",
            type: "bijwoord"
        },
        {
            woord: "Dienovereenkomstig",
            betekenis: "in overeenstemming daarmee",
            voorbeeld: "Het protocol is aangepast en we handelen dienovereenkomstig.",
            type: "bijwoord"
        }
    ];
    
    quizData = [
        {
            vraag: "Wat betekent 'omtrent'?",
            opties: ["over", "onder", "naast", "achter"],
            antwoord: 0,
            categorie: "taal"
        },
        {
            vraag: "2 + 3 × 4 = ?",
            opties: ["20", "14", "10", "24"],
            antwoord: 1,
            categorie: "cognitief"
        }
    ];
    
    updateDashboard();
}

// Dashboard güncellemeleri
function updateDashboard() {
    // İstatistikleri güncelle
    document.getElementById('total-questions').textContent = userData.totalQuestions;
    document.getElementById('success-rate').textContent = userData.successRate + '%';
    document.getElementById('streak-days').textContent = userData.streakDays;
    
    // Günlük kelimeyi güncelle
    updateDailyWord();
    
    // İlerleme barlarını güncelle
    updateProgressBars();
}

// Günlük kelime güncelleme
function updateDailyWord() {
    if (woordenData.length === 0) return;
    
    const today = new Date().getDate();
    const dailyWord = woordenData[today % woordenData.length];
    
    document.getElementById('daily-word').textContent = dailyWord.woord;
    document.getElementById('word-meaning').textContent = `Betekenis: ${dailyWord.betekenis}`;
    document.getElementById('word-example').textContent = `"${dailyWord.voorbeeld}"`;
    
    // Kelime türünü güncelle
    const wordType = document.querySelector('.word-type');
    if (wordType) {
        wordType.textContent = `[${dailyWord.type || 'onbekend'}]`;
    }
}

// İlerleme barlarını güncelle
function updateProgressBars() {
    Object.keys(userData.progress).forEach(key => {
        const progressFill = document.querySelector(`[data-module="${key}"] .progress-fill`);
        if (progressFill) {
            progressFill.style.width = userData.progress[key] + '%';
        }
    });
}

// Günlük test başlatma
function startDailyChallenge(type) {
    switch(type) {
        case 'cognitief':
            window.location.href = 'cognitief.html';
            break;
        case 'taal':
            window.location.href = 'taal.html';
            break;
        case 'situationeel':
            window.location.href = 'scenarios.html';
            break;
        default:
            alert('Deze test is nog in ontwikkeling!');
    }
}

// Quiz sistemleri
function startQuiz(category, questionCount = 10) {
    if (quizData.length === 0) {
        alert('Quiz vragen worden geladen...');
        return;
    }
    
    const categoryQuestions = quizData.filter(q => q.categorie === category);
    const selectedQuestions = shuffleArray(categoryQuestions).slice(0, questionCount);
    
    localStorage.setItem('currentQuiz', JSON.stringify(selectedQuestions));
    localStorage.setItem('quizCategory', category);
    
    window.location.href = 'quiz.html';
}

// Yardımcı fonksiyonlar
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Sonuçları kaydetme
function saveQuizResult(category, score, total) {
    userData.totalQuestions += total;
    const percentage = Math.round((score / total) * 100);
    userData.successRate = Math.round((userData.successRate + percentage) / 2);
    
    // Yerel depolamaya kaydet
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Aktivite geçmişine ekle
    addToActivityHistory(category, score, total);
}

// Aktivite geçmişi
function addToActivityHistory(category, score, total) {
    const activity = {
        date: new Date().toLocaleDateString('nl-NL'),
        category: category,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100)
    };
    
    let history = JSON.parse(localStorage.getItem('activityHistory') || '[]');
    history.unshift(activity);
    history = history.slice(0, 10); // Son 10 aktiviteyi tut
    
    localStorage.setItem('activityHistory', JSON.stringify(history));
}

// Sayfa yüklendikende
document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı verilerini yükle
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        userData = { ...userData, ...JSON.parse(savedUserData) };
    }
    
    // Verileri yükle
    loadData();
    
    // Event listenerlar
    document.getElementById('reload-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
    });
    
    // Kelime pratiği butonu
    document.querySelector('.word-practice-btn')?.addEventListener('click', function() {
        startQuiz('taal', 5);
    });
    
    // Quiz sayfası kontrolü
    if (location.pathname.endsWith('quiz.html')) {
        initializeQuizPage();
    }
    
    // Kelime sayfası kontrolü
    if (location.pathname.endsWith('woorden.html')) {
        updateDailyWord();
    }
});

// Quiz sayfası başlatma
function initializeQuizPage() {
    const currentQuiz = localStorage.getItem('currentQuiz');
    if (!currentQuiz) {
        document.body.innerHTML = '<p>Quiz verisi bulunamadı. <a href="index.html">Ana sayfaya dön</a></p>';
        return;
    }
    
    const questions = JSON.parse(currentQuiz);
    const category = localStorage.getItem('quizCategory');
    
    // Quiz container'ı bul
    const container = document.getElementById('quiz-container');
    if (container) {
        renderQuiz(container, questions, category);
    }
}

// Quiz render etme
function renderQuiz(container, questions, category) {
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        const q = questions[currentQuestion];
        container.innerHTML = `
            <div class="quiz-header">
                <h2>${category.toUpperCase()} Quiz</h2>
                <div class="quiz-progress">
                    <span>Vraag ${currentQuestion + 1} van ${questions.length}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            <div class="question-container">
                <h3>${q.vraag}</h3>
                <div class="options">
                    ${q.opties.map((optie, index) => 
                        `<button class="option-btn" onclick="selectAnswer(${index})">${optie}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="quiz-footer">
                <span>Score: ${score}/${currentQuestion}</span>
            </div>
        `;
    }
    
    window.selectAnswer = function(selectedIndex) {
        const q = questions[currentQuestion];
        const correct = selectedIndex === q.antwoord;
        
        if (correct) score++;
        
        // Feedback toon
        const options = document.querySelectorAll('.option-btn');
        options[q.antwoord].classList.add('correct');
        if (!correct) {
            options[selectedIndex].classList.add('incorrect');
        }
        
        // Volgende vraag na 2 seconden
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 2000);
    };
    
    function showResults() {
        const percentage = Math.round((score / questions.length) * 100);
        
        container.innerHTML = `
            <div class="quiz-results">
                <h2>Quiz Voltooid!</h2>
                <div class="result-score">
                    <span class="score-big">${score}/${questions.length}</span>
                    <span class="score-percentage">${percentage}%</span>
                </div>
                <div class="result-feedback">
                    ${percentage >= 80 ? '🎉 Uitstekend!' : 
                      percentage >= 60 ? '👍 Goed gedaan!' : '📚 Blijf oefenen!'}
                </div>
                <div class="result-actions">
                    <button onclick="location.href='index.html'" class="btn-primary">Terug naar Dashboard</button>
                    <button onclick="location.reload()" class="btn-secondary">Opnieuw Proberen</button>
                </div>
            </div>
        `;
        
        // Resultaat opslaan
        saveQuizResult(category, score, questions.length);
    }
    
    showQuestion();
}

// CSS voor quiz styling toevoegen
const quizStyles = `
    .quiz-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .quiz-progress {
        margin-top: 1rem;
    }
    
    .question-container {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
    }
    
    .options {
        display: grid;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .option-btn {
        background: #f8f9fa;
        border: 2px solid #dee2e6;
        padding: 1rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    
    .option-btn:hover {
        background: #e9ecef;
        border-color: #3498db;
    }
    
    .option-btn.correct {
        background: #d4edda;
        border-color: #27ae60;
        color: #155724;
    }
    
    .option-btn.incorrect {
        background: #f8d7da;
        border-color: #e74c3c;
        color: #721c24;
    }
    
    .quiz-results {
        text-align: center;
        background: white;
        padding: 3rem;
        border-radius: 20px;
    }
    
    .score-big {
        font-size: 3rem;
        font-weight: bold;
        color: #2c3e50;
    }
    
    .score-percentage {
        font-size: 1.5rem;
        color: #7f8c8d;
        margin-left: 1rem;
    }
    
    .result-feedback {
        font-size: 1.2rem;
        margin: 2rem 0;
    }
    
    .result-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 1rem 2rem;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #3498db;
        color: white;
    }
    
    .btn-secondary {
        background: #95a5a6;
        color: white;
    }
    
    .btn-primary:hover, .btn-secondary:hover {
        transform: translateY(-2px);
    }
`;

// Dinamik CSS ekleme
if (!document.getElementById('quiz-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'quiz-styles';
    styleSheet.textContent = quizStyles;
    document.head.appendChild(styleSheet);
}
