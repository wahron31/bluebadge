// Global variables
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

// Mobile menu toggle function
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  
  if (navLinks && mobileBtn) {
    navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('active');
  }
}

// Make it globally available
window.toggleMobileMenu = toggleMobileMenu;

// Close menus when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.querySelector('.nav-links');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileBtn && navLinks && !mobileBtn.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
        mobileBtn.classList.remove('active');
    }
});

// Load data files
async function loadData() {
    try {
        const [quiz, woorden, abstractRed, verbaalRed, numeriekRed] = await Promise.all([
            fetch('data/quiz_questions.json').then(res => res.json()).catch(() => []),
            fetch('data/woorden.json').then(res => res.json()).catch(() => []),
            fetch('data/abstract_redeneren.json').then(res => res.json()).catch(() => []),
            fetch('data/verbaal_redeneren.json').then(res => res.json()).catch(() => []),
            fetch('data/numeriek_redeneren.json').then(res => res.json()).catch(() => [])
        ]);
        
        quizData = quiz;
        woordenData = woorden;
        // Combine cognitive questions
        cognitiefData = [...abstractRed, ...verbaalRed, ...numeriekRed];
        
        updateDashboard();
    } catch (error) {
        console.log('Error loading data files:', error);
        // Continue with sample data
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

// Geliştirilmiş scoring sistemi ve activity tracking
function saveQuizResult(category, score, total) {
    const percentage = Math.round((score / total) * 100);
    const result = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('nl-NL'),
        category: category,
        score: score,
        total: total,
        percentage: percentage,
        type: 'quiz'
    };
    
    // Save to quiz results
    let quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    quizResults.unshift(result);
    quizResults = quizResults.slice(0, 100); // Keep last 100 results
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // Update user data
    userData.totalQuestions += total;
    userData.successRate = calculateOverallSuccessRate();
    userData.streakDays = calculateStreakDays();
    
    // Save updated user data
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update dashboard
    updateDashboard();
    
    // Add to activity history
    addToActivityHistory(category, `${category} quiz`, score, total);
}

// Calculate overall success rate from all test results
function calculateOverallSuccessRate() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    if (allResults.length === 0) return userData.successRate || 78;
    
    return Math.round(allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length);
}

// Calculate current streak days
function calculateStreakDays() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    if (allResults.length === 0) return userData.streakDays || 7;
    
    const uniqueDates = [...new Set(allResults.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();
    
    // Check if there was activity today
    if (uniqueDates[0] === today) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
    } else {
        // Check if activity was yesterday
        const yesterday = new Date(checkDate.getTime() - 24*60*60*1000).toISOString().split('T')[0];
        if (uniqueDates[0] === yesterday) {
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 2);
        } else {
            return 0;
        }
    }
    
    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
        const expectedDate = checkDate.toISOString().split('T')[0];
        if (uniqueDates[i] === expectedDate) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Enhanced activity history
function addToActivityHistory(category, description, score, total) {
    const activity = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('nl-NL'),
        category: category,
        description: description,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        timestamp: new Date().getTime()
    };
    
    let history = JSON.parse(localStorage.getItem('activityHistory') || '[]');
    history.unshift(activity);
    history = history.slice(0, 50); // Keep last 50 activities
    
    localStorage.setItem('activityHistory', JSON.stringify(history));
    
    // Update recent activity display if on index page
    updateRecentActivityDisplay();
}

// Update recent activity display on dashboard
function updateRecentActivityDisplay() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const history = JSON.parse(localStorage.getItem('activityHistory') || '[]');
    const recent = history.slice(0, 3); // Show last 3 activities
    
    activityList.innerHTML = recent.map(activity => `
        <div class="activity-item">
            <span class="activity-date">${formatActivityDate(activity.date)}</span>
            <span class="activity-desc">${activity.description} - Score: ${activity.score}/${activity.total}</span>
            <span class="activity-score ${getScoreClass(activity.percentage)}">${activity.percentage}%</span>
        </div>
    `).join('');
}

// Format activity date for display
function formatActivityDate(dateString) {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0];
    
    if (dateString === today) return 'Vandaag';
    if (dateString === yesterday) return 'Gisteren';
    
    const daysAgo = Math.floor((Date.now() - date.getTime()) / (24*60*60*1000));
    return `${daysAgo} dagen geleden`;
}

// Get score class for styling
function getScoreClass(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    return 'needs-improvement';
}

// Enhanced progress calculation
function updateProgressBars() {
    // Get all test results
    const cognitiveResults = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
    const languageResults = JSON.parse(localStorage.getItem('languageResults') || '[]');
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    
    // Calculate progress based on actual performance
    const cognitiveAvg = cognitiveResults.length > 0 
        ? Math.round(cognitiveResults.reduce((sum, r) => sum + r.percentage, 0) / cognitiveResults.length)
        : userData.progress.cognitief || 65;
        
    const taalAvg = languageResults.length > 0 
        ? Math.round(languageResults.reduce((sum, r) => sum + r.percentage, 0) / languageResults.length)
        : userData.progress.taal || 42;
    
    // Update progress bars with smooth animation
    updateProgressBar('cognitief', cognitiveAvg);
    updateProgressBar('taal', taalAvg);
    
    // Update userData
    userData.progress.cognitief = cognitiveAvg;
    userData.progress.taal = taalAvg;
}

// Update individual progress bar with animation
function updateProgressBar(module, percentage) {
    const progressFill = document.querySelector(`[data-module="${module}"] .progress-fill`);
    if (progressFill) {
        // Animate to new percentage
        progressFill.style.transition = 'width 1s ease-out';
        progressFill.style.width = percentage + '%';
    }
    
    // Update percentage text
    const percentageText = document.querySelector(`[data-module="${module}"] span`);
    if (percentageText) {
        percentageText.textContent = percentage + '% voltooid';
    }
}

// Enhanced dashboard updates
function updateDashboard() {
    // Update basic stats
    document.getElementById('total-questions').textContent = userData.totalQuestions;
    document.getElementById('success-rate').textContent = userData.successRate + '%';
    document.getElementById('streak-days').textContent = userData.streakDays;
    
    // Update daily word
    updateDailyWord();
    
    // Update progress bars
    updateProgressBars();
    
    // Update recent activity
    updateRecentActivityDisplay();
    
    // Update achievement indicators
    updateAchievementIndicators();
}

// Update achievement indicators
function updateAchievementIndicators() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    // Check for perfect score achievement
    const hasPerfectScore = allResults.some(r => r.percentage === 100);
    if (hasPerfectScore) {
        showAchievementNotification('🎯 Perfect Score behaald!');
    }
    
    // Check for streak achievements
    if (userData.streakDays === 7) {
        showAchievementNotification('🔥 7-dagen streak behaald!');
    }
    
    // Check for improvement
    const recentResults = allResults.slice(0, 5);
    if (recentResults.length === 5) {
        const recentAvg = recentResults.reduce((sum, r) => sum + r.percentage, 0) / 5;
        const olderResults = allResults.slice(5, 10);
        if (olderResults.length > 0) {
            const olderAvg = olderResults.reduce((sum, r) => sum + r.percentage, 0) / olderResults.length;
            if (recentAvg > olderAvg + 10) {
                showAchievementNotification('📈 Grote verbetering gedetecteerd!');
            }
        }
    }
}

// Show achievement notification
function showAchievementNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Scenario functions
function startScenario(scenarioType) {
  console.log('Starting scenario:', scenarioType);
  
  // Store scenario type for tracking
  localStorage.setItem('currentScenario', scenarioType);
  
  // Show scenario interface
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.innerHTML = `
      <section class="scenario-interface">
        <h3>Scenario: ${getScenarioTitle(scenarioType)}</h3>
        <div class="scenario-content">
          <div class="scenario-description">
            <p>${getScenarioDescription(scenarioType)}</p>
          </div>
          <div class="scenario-options">
            <h4>Wat zou je doen?</h4>
            <div class="option-buttons">
              <button class="scenario-option" onclick="selectScenarioOption('${scenarioType}', 'A')">
                ${getScenarioOption(scenarioType, 'A')}
              </button>
              <button class="scenario-option" onclick="selectScenarioOption('${scenarioType}', 'B')">
                ${getScenarioOption(scenarioType, 'B')}
              </button>
              <button class="scenario-option" onclick="selectScenarioOption('${scenarioType}', 'C')">
                ${getScenarioOption(scenarioType, 'C')}
              </button>
            </div>
          </div>
        </div>
        <div class="scenario-controls">
          <button class="control-btn secondary" onclick="backToScenarios()">Terug naar Overzicht</button>
        </div>
      </section>
    `;
  }
}

function getScenarioTitle(type) {
  const titles = {
    'verkeer': 'Verkeerscontrole',
    'huiszoeking': 'Huiszoeking',
    'massa': 'Massale Ordeverstoring',
    'pursuit': 'Pursuit Situatie',
    'recherche': 'Recherche Onderzoek',
    'nood': 'Noodsituatie'
  };
  return titles[type] || 'Onbekend Scenario';
}

function getScenarioDescription(type) {
  const descriptions = {
    'verkeer': 'Je controleert een verdachte bestuurder tijdens een routinecontrole. De bestuurder gedraagt zich nerveus en weigert zijn rijbewijs te tonen.',
    'huiszoeking': 'Je moet een huiszoeking uitvoeren in een woning waar mogelijk drugs worden verhandeld. Er zijn kinderen aanwezig.',
    'massa': 'Er is een massale ordeverstoring in het centrum van de stad. Demonstranten worden steeds agressiever.',
    'pursuit': 'Je bent betrokken bij een achtervolging van een verdachte auto. De bestuurder rijdt gevaarlijk door de stad.',
    'recherche': 'Je onderzoekt een inbraak in een winkel. Er zijn sporen van geweld en de eigenaar is gewond.',
    'nood': 'Er is een schietpartij gemeld in een winkelcentrum. Je bent de eerste agent ter plaatse.'
  };
  return descriptions[type] || 'Geen beschrijving beschikbaar.';
}

function getScenarioOption(type, option) {
  const options = {
    'verkeer': {
      'A': 'Direct aanhouden en boete uitschrijven',
      'B': 'Rustig blijven en om verduidelijking vragen',
      'C': 'Versterking oproepen en auto doorzoeken'
    },
    'huiszoeking': {
      'A': 'Direct binnengaan en doorzoeken',
      'B': 'Eerst de kinderen veiligstellen',
      'C': 'Wachten op versterking en specialistische eenheid'
    },
    'massa': {
      'A': 'Direct ingrijpen met geweld',
      'B': 'Proberen te de-escaleren',
      'C': 'Versterking oproepen en gebied afzetten'
    },
    'pursuit': {
      'A': 'Doorgaan met achtervolging',
      'B': 'Achtervolging stoppen vanwege veiligheidsrisico',
      'C': 'Helikopter inzetten voor luchtsteun'
    },
    'recherche': {
      'A': 'Direct sporen veiligstellen',
      'B': 'Eerst slachtoffer helpen',
      'C': 'Wachten op forensisch team'
    },
    'nood': {
      'A': 'Direct naar binnen gaan',
      'B': 'Eerst situatie inschatten',
      'C': 'Versterking oproepen en gebied afzetten'
    }
  };
  return options[type]?.[option] || 'Geen optie beschikbaar.';
}

function selectScenarioOption(scenarioType, option) {
  console.log('Selected option:', option, 'for scenario:', scenarioType);
  
  // Store result
  const scenarioResults = JSON.parse(localStorage.getItem('scenarioResults') || '{}');
  if (!scenarioResults[scenarioType]) {
    scenarioResults[scenarioType] = [];
  }
  scenarioResults[scenarioType].push({
    option: option,
    timestamp: new Date().toISOString(),
    scenario: scenarioType
  });
  localStorage.setItem('scenarioResults', JSON.stringify(scenarioResults));
  
  // Show feedback
  alert(`Je hebt optie ${option} gekozen. Goed gedaan!`);
  
  // Return to scenarios overview
  backToScenarios();
}

function backToScenarios() {
  window.location.href = 'scenarios.html';
}

// Interview functions
function startInterview(interviewType) {
  console.log('Starting interview:', interviewType);
  
  // Store interview type for tracking
  localStorage.setItem('currentInterview', interviewType);
  
  // Show interview interface
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.innerHTML = `
      <section class="interview-interface">
        <h3>Interview Training: ${getInterviewTitle(interviewType)}</h3>
        <div class="interview-content">
          <div class="interview-question">
            <h4>Vraag:</h4>
            <p>${getInterviewQuestion(interviewType)}</p>
          </div>
          <div class="interview-options">
            <h4>Antwoord opties:</h4>
            <div class="option-buttons">
              <button class="interview-option" onclick="selectInterviewOption('${interviewType}', 'A')">
                ${getInterviewOption(interviewType, 'A')}
              </button>
              <button class="interview-option" onclick="selectInterviewOption('${interviewType}', 'B')">
                ${getInterviewOption(interviewType, 'B')}
              </button>
              <button class="interview-option" onclick="selectInterviewOption('${interviewType}', 'C')">
                ${getInterviewOption(interviewType, 'C')}
              </button>
            </div>
          </div>
        </div>
        <div class="interview-controls">
          <button class="control-btn secondary" onclick="backToInterviews()">Terug naar Overzicht</button>
        </div>
      </section>
    `;
  }
}

function getInterviewTitle(type) {
  const titles = {
    'sollicitatie': 'Sollicitatiegesprek',
    'nood': 'Noodsituatie Interview',
    'onderzoek': 'Onderzoeksinterview',
    'team': 'Team Interview',
    'radio': 'Radio Communicatie',
    'rolspel': 'Rolspel Training'
  };
  return titles[type] || 'Onbekende Interview Type';
}

function getInterviewQuestion(type) {
  const questions = {
    'sollicitatie': 'Waarom wil je bij de politie werken?',
    'nood': 'Hoe zou je reageren op een agressieve verdachte?',
    'onderzoek': 'Hoe ga je om met tegenstrijdige verklaringen?',
    'team': 'Beschrijf een situatie waarin je in een team werkte.',
    'radio': 'Hoe communiceer je effectief via de radio?',
    'rolspel': 'Je bent in een stressvolle situatie. Hoe blijf je kalm?'
  };
  return questions[type] || 'Geen vraag beschikbaar.';
}

function getInterviewOption(type, option) {
  const options = {
    'sollicitatie': {
      'A': 'Ik wil mensen helpen en de samenleving beschermen',
      'B': 'Het lijkt me een interessante baan',
      'C': 'Ik heb geen andere opties'
    },
    'nood': {
      'A': 'Direct ingrijpen met geweld',
      'B': 'Proberen te de-escaleren',
      'C': 'Versterking oproepen'
    },
    'onderzoek': {
      'A': 'Beide verklaringen gelijk behandelen',
      'B': 'Meer bewijs verzamelen',
      'C': 'De geloofwaardigste kiezen'
    },
    'team': {
      'A': 'Ik werkte samen met collega\'s aan een project',
      'B': 'Ik deed mijn eigen werk',
      'C': 'Ik had geen team ervaring'
    },
    'radio': {
      'A': 'Kort en bondig communiceren',
      'B': 'Alle details doorgeven',
      'C': 'Wachten tot ik rustig ben'
    },
    'rolspel': {
      'A': 'Ik blijf kalm en denk na',
      'B': 'Ik raak in paniek',
      'C': 'Ik handel instinctief'
    }
  };
  return options[type]?.[option] || 'Geen optie beschikbaar.';
}

function selectInterviewOption(interviewType, option) {
  console.log('Selected option:', option, 'for interview:', interviewType);
  
  // Store result
  const interviewResults = JSON.parse(localStorage.getItem('interviewResults') || '{}');
  if (!interviewResults[interviewType]) {
    interviewResults[interviewType] = [];
  }
  interviewResults[interviewType].push({
    option: option,
    timestamp: new Date().toISOString(),
    interview: interviewType
  });
  localStorage.setItem('interviewResults', JSON.stringify(interviewResults));
  
  // Show feedback
  alert(`Je hebt optie ${option} gekozen. Goed gedaan!`);
  
  // Return to interviews overview
  backToInterviews();
}

function backToInterviews() {
  window.location.href = 'gesprek.html';
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

function goToResultsPage(payload) {
    try {
        localStorage.setItem('lastQuizResult', JSON.stringify(payload));
        window.location.href = 'resultaten.html';
    } catch (e) {
        console.error('Cannot store results:', e);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Initialize quiz page if we're on quiz.html
    if (window.location.pathname.includes('quiz.html')) {
        initializeQuizPage();
    }
});

// Word management functions
function markWordKnown() {
  const currentWord = JSON.parse(localStorage.getItem('currentWord') || '{}');
  if (currentWord.word) {
    const knownWords = JSON.parse(localStorage.getItem('knownWords') || '[]');
    if (!knownWords.includes(currentWord.word)) {
      knownWords.push(currentWord.word);
      localStorage.setItem('knownWords', JSON.stringify(knownWords));
    }
    
    // Remove from study words if present
    const studyWords = JSON.parse(localStorage.getItem('studyWords') || '[]');
    const updatedStudyWords = studyWords.filter(w => w !== currentWord.word);
    localStorage.setItem('studyWords', JSON.stringify(updatedStudyWords));
    
    // Update stats
    updateWordStats();
    
    // Show next word
    nextWord();
  }
}

function studyWord() {
  const currentWord = JSON.parse(localStorage.getItem('currentWord') || '{}');
  if (currentWord.word) {
    const studyWords = JSON.parse(localStorage.getItem('studyWords') || '[]');
    if (!studyWords.includes(currentWord.word)) {
      studyWords.push(currentWord.word);
      localStorage.setItem('studyWords', JSON.stringify(studyWords));
    }
    
    // Show next word
    nextWord();
  }
}

function nextWord() {
  // Load next word from daily words
  const dailyWords = JSON.parse(localStorage.getItem('dailyWords') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentWordIndex') || '0');
  
  if (currentIndex < dailyWords.length - 1) {
    const nextIndex = currentIndex + 1;
    localStorage.setItem('currentWordIndex', nextIndex.toString());
    
    const nextWord = dailyWords[nextIndex];
    localStorage.setItem('currentWord', JSON.stringify(nextWord));
    
    // Update display
    showCurrentWord();
  } else {
    // All words completed
    alert('Alle woorden van vandaag zijn voltooid!');
    window.location.href = 'taal.html';
  }
}

function showCurrentWord() {
  const currentWord = JSON.parse(localStorage.getItem('currentWord') || '{}');
  if (currentWord.word) {
    const wordMain = document.querySelector('.word-main');
    if (wordMain) {
      wordMain.innerHTML = `
        <div class="word-text">${currentWord.word}</div>
        <div class="word-type">${currentWord.type || 'zelfstandig naamwoord'}</div>
        <div class="word-meaning">${currentWord.betekenis || 'Betekenis niet beschikbaar'}</div>
        <div class="word-example">${currentWord.voorbeeld || 'Voorbeeld niet beschikbaar'}</div>
      `;
    }
  }
}

function updateWordStats() {
  const knownWords = JSON.parse(localStorage.getItem('knownWords') || '[]');
  const studyWords = JSON.parse(localStorage.getItem('studyWords') || '[]');
  
  // Update display if elements exist
  const knownCount = document.querySelector('.known-count');
  const studyCount = document.querySelector('.study-count');
  
  if (knownCount) knownCount.textContent = knownWords.length;
  if (studyCount) studyCount.textContent = studyWords.length;
}

// Quiz functions
function beoordeel(button, isCorrect) {
  // Remove previous selections
  document.querySelectorAll('#quiz-options button').forEach(btn => {
    btn.classList.remove('selected', 'correct', 'incorrect');
  });
  
  // Mark selected button
  button.classList.add('selected');
  
  if (isCorrect) {
    button.classList.add('correct');
    // Add to score
    const currentScore = parseInt(localStorage.getItem('currentQuizScore') || '0');
    localStorage.setItem('currentQuizScore', (currentScore + 1).toString());
  } else {
    button.classList.add('incorrect');
  }
  
  // Show next question after delay
  setTimeout(() => {
    nextQuizQuestion();
  }, 1500);
}

function nextQuizQuestion() {
  const currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex') || '0');
  const totalQuestions = parseInt(localStorage.getItem('totalQuestions') || '0');
  
  if (currentQuestionIndex < totalQuestions - 1) {
    localStorage.setItem('currentQuestionIndex', (currentQuestionIndex + 1).toString());
    renderQuiz();
  } else {
    // Quiz completed
    endQuiz();
  }
}

function endQuiz() {
  const score = parseInt(localStorage.getItem('currentQuizScore') || '0');
  const total = parseInt(localStorage.getItem('totalQuestions') || '0');
  const percentage = Math.round((score / total) * 100);
  
  // Save result
  const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
  quizResults.push({
    score: score,
    total: total,
    percentage: percentage,
    date: new Date().toISOString(),
    category: localStorage.getItem('quizCategory') || 'general'
  });
  localStorage.setItem('quizResults', JSON.stringify(quizResults));
  
  // Show results
  alert(`Quiz voltooid! Score: ${score}/${total} (${percentage}%)`);
  
  // Redirect to results page
  window.location.href = 'resultaten.html';
}

// Calendar navigation functions
function previousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateActivityCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateActivityCalendar();
}

// Stats tab functions
function showStatsTab(period) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked tab
  event.target.classList.add('active');
  
  // Update stats based on period
  updateDetailedStats(period);
}

// ===== QUIZ FUNCTIONS =====

// Quiz state
let quizState = {
  questions: [],
  selectedQuestions: [],
  currentIndex: 0,
  score: 0,
  answered: 0
};

// Load quiz data
async function loadQuiz() {
  try {
    const response = await fetch('data/quiz.json');
    if (!response.ok) throw new Error('Failed to load quiz data');
    
    const data = await response.json();
    quizState.questions = data.questions || [];
    
    if (quizState.questions.length === 0) {
      showError('Geen quiz vragen beschikbaar');
      return;
    }
    
    // Select 5 random questions
    quizState.selectedQuestions = shuffleArray(quizState.questions).slice(0, 5);
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.answered = 0;
    
    renderQuestion();
  } catch (error) {
    console.error('Error loading quiz:', error);
    showError('Fout bij het laden van de quiz: ' + error.message);
  }
}

// Render current question
function renderQuestion() {
  const container = document.getElementById('quiz-container');
  const question = quizState.selectedQuestions[quizState.currentIndex];
  
  if (!question) return;

  container.innerHTML = `
    <div class="question-container">
      <div class="question-text">
        <h3>Vraag ${quizState.currentIndex + 1} van ${quizState.selectedQuestions.length}</h3>
        <p>${question.vraag}</p>
      </div>
      <div class="question-options">
        ${question.opties.map((option, index) => `
          <button class="option-btn" onclick="selectAnswer(this, ${index === question.antwoord})">
            ${option}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Hide end button initially
  const endBtn = document.getElementById('end-quiz-btn');
  if (endBtn) endBtn.style.display = 'none';
}

// Handle answer selection
function selectAnswer(button, isCorrect) {
  const allButtons = button.parentNode.querySelectorAll('.option-btn');
  
  // Disable all buttons
  allButtons.forEach(btn => btn.disabled = true);
  
  // Mark correct/incorrect
  if (isCorrect) {
    button.classList.add('correct');
    quizState.score++;
  } else {
    button.classList.add('incorrect');
  }
  
  quizState.answered++;
  
  // Wait then move to next question or show end button
  setTimeout(() => {
    if (quizState.currentIndex === quizState.selectedQuestions.length - 1) {
      // Last question - show end button
      const endBtn = document.getElementById('end-quiz-btn');
      if (endBtn) endBtn.style.display = 'inline-block';
    } else {
      // Move to next question
      quizState.currentIndex++;
      renderQuestion();
    }
  }, 1000);
}

// End quiz early
function endQuizEarly() {
  const percentage = quizState.answered > 0 ? Math.round((quizState.score / quizState.answered) * 100) : 0;
  
  const result = {
    type: 'daily-quiz',
    score: quizState.score,
    total: quizState.answered,
    percentage: percentage,
    questions: quizState.selectedQuestions.slice(0, quizState.answered),
    date: new Date().toISOString()
  };
  
  // Save result
  localStorage.setItem('lastQuizResult', JSON.stringify(result));
  
  // Redirect to results page
  window.location.href = 'resultaten.html';
}

// Utility function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Show error message
function showError(message) {
  const container = document.getElementById('quiz-container');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <h3>❌ Fout</h3>
        <p>${message}</p>
        <button class="control-btn primary" onclick="loadQuiz()">Opnieuw proberen</button>
      </div>
    `;
  }
}

// ===== AUTHENTICATION FUNCTIONS =====

// Handle login for scenarios and other pages
function handleLogin() {
  const username = document.getElementById('bb-username').value.trim();
  if (username) {
    bbAuth.login(username);
    alert('Ingelogd als: ' + username);
  } else {
    alert('Voer een gebruikersnaam in');
  }
}

// ===== SCENARIO FUNCTIONS =====

// Start a specific scenario
function startScenario(scenarioType) {
  alert('Scenario gestart: ' + scenarioType);
  // Here comes the scenario logic
  // TODO: Implement full scenario functionality
}

// ===== INTERVIEW FUNCTIONS =====

// Start a specific interview training
function startInterview(interviewType) {
  alert('Interview training gestart: ' + interviewType);
  // Here comes the interview logic
  // TODO: Implement full interview functionality
}
