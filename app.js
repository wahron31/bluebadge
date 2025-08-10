// Global variables
let quizData = [];
let woordenData = [];
let cognitiefData = [];
let languagesData = {};
let currentLanguage = 'nl'; // Default language
let userData = {
    totalQuestions: 156,
    successRate: 78,
    streakDays: 7,
    goals: { questionsPerDay: 50, wordsPerDay: 20, readingsPerDay: 1 },
    premium: false,
    progress: {
        cognitief: 65,
        taal: 42,
        scenarios: 28,
        gesprek: 15
    }
};

// Language and mobile menu functions
function toggleLanguageMenu() {
    const langMenu = document.getElementById('lang-menu');
    langMenu.classList.toggle('active');
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('active');
}

function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('selectedLanguage', langCode);
    
    // Update language button
    const langFlags = {
        'nl': '🇳🇱 VL',
        'fr': '🇫🇷 FR', 
        'de': '🇩🇪 DE',
        'tr': '🇹🇷 TR'
    };
    
    document.getElementById('current-lang').textContent = langFlags[langCode];
    
    // Close language menu
    document.getElementById('lang-menu').classList.remove('active');
    
    // Update all translatable elements
    updatePageLanguage();
}

function updatePageLanguage() {
    if (!languagesData[currentLanguage]) return;
    
    const lang = languagesData[currentLanguage];
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });
    
    // Update page title
    document.title = `BlueBadge – ${lang.police_selection_training}`;
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

// Close menus when clicking outside
document.addEventListener('click', function(event) {
    const langMenu = document.getElementById('lang-menu');
    const langBtn = document.getElementById('lang-btn');
    try {
        if (langMenu && langBtn && !langBtn.contains(event.target) && !langMenu.contains(event.target)) {
            langMenu.classList.remove('open');
        }
    } catch (e) {
        // no-op
    }
    
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
        const [quiz, woorden, abstractRed, verbaalRed, numeriekRed, languages] = await Promise.all([
            fetch('data/quiz_questions.json').then(res => res.json()).catch(() => []),
            fetch('data/woorden.json').then(res => res.json()).catch(() => []),
            fetch('data/abstract_redeneren.json').then(res => res.json()).catch(() => []),
            fetch('data/verbaal_redeneren.json').then(res => res.json()).catch(() => []),
            fetch('data/numeriek_redeneren.json').then(res => res.json()).catch(() => []),
            fetch('data/languages.json').then(res => res.json()).catch(() => {})
        ]);
        
        const importQuiz = JSON.parse(localStorage.getItem('import_quiz')||'[]');
        quizData = Array.isArray(importQuiz) && importQuiz.length ? importQuiz : quiz;
        woordenData = woorden;
        // Cognitieve soruları birleştir
        cognitiefData = [...abstractRed, ...verbaalRed, ...numeriekRed];
        languagesData = languages;
        
        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && languagesData[savedLanguage]) {
            currentLanguage = savedLanguage;
            updatePageLanguage();
        }
        
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

    // Goals section
    renderGoals();
    // Mini chart
    renderDashboardBars();
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

    // Smart suggestions and badges
    renderSmartSuggestions();
    renderBadges();

    // Theme init
    applyTheme(localStorage.getItem('bbTheme')||'dark');
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

// Goals
function renderGoals(){
    const saved = JSON.parse(localStorage.getItem('bbGoals')||'null');
    if (saved){ userData.goals = { ...userData.goals, ...saved }; }
    // set inputs and targets
    document.getElementById('goal-q-input')?.setAttribute('value', userData.goals.questionsPerDay);
    document.getElementById('goal-w-input')?.setAttribute('value', userData.goals.wordsPerDay);
    document.getElementById('goal-r-input')?.setAttribute('value', userData.goals.readingsPerDay);
    document.getElementById('goal-q-target')?.innerText = userData.goals.questionsPerDay;
    document.getElementById('goal-w-target')?.innerText = userData.goals.wordsPerDay;
    document.getElementById('goal-r-target')?.innerText = userData.goals.readingsPerDay;
    // today counters
    const today = new Date().toISOString().split('T')[0];
    const all = [
        ...JSON.parse(localStorage.getItem('cognitiveResults')||'[]'),
        ...JSON.parse(localStorage.getItem('languageResults')||'[]'),
        ...JSON.parse(localStorage.getItem('quizResults')||'[]')
    ].filter(r=>r.date===today);
    const questionsToday = all.reduce((s,r)=> s + (r.total||0), 0);
    // words known/study increments
    const known = JSON.parse(localStorage.getItem('knownWords')||'[]');
    const study = JSON.parse(localStorage.getItem('studyWords')||'[]');
    const wordsToday = Math.min(known.length + Math.floor(study.length*0.5), userData.goals.wordsPerDay); // rough proxy
    // readings from languageResults lezen today
    const readingsToday = all.filter(r=> (r.category==='lezen' || r.type==='lezen')).length;
    document.getElementById('goal-q-today')?.innerText = questionsToday;
    document.getElementById('goal-w-today')?.innerText = wordsToday;
    document.getElementById('goal-r-today')?.innerText = readingsToday;
    // bars
    const qPerc = Math.min(100, Math.round((questionsToday / Math.max(1,userData.goals.questionsPerDay))*100));
    const wPerc = Math.min(100, Math.round((wordsToday / Math.max(1,userData.goals.wordsPerDay))*100));
    const rPerc = Math.min(100, Math.round((readingsToday / Math.max(1,userData.goals.readingsPerDay))*100));
    const qBar = document.getElementById('goal-q-bar'); if(qBar) qBar.style.width = qPerc+'%';
    const wBar = document.getElementById('goal-w-bar'); if(wBar) wBar.style.width = wPerc+'%';
    const rBar = document.getElementById('goal-r-bar'); if(rBar) rBar.style.width = rPerc+'%';
    // save handlers
    document.getElementById('goal-q-save')?.addEventListener('click', ()=>{ userData.goals.questionsPerDay = parseInt(document.getElementById('goal-q-input').value||'50'); localStorage.setItem('bbGoals', JSON.stringify(userData.goals)); renderGoals(); });
    document.getElementById('goal-w-save')?.addEventListener('click', ()=>{ userData.goals.wordsPerDay = parseInt(document.getElementById('goal-w-input').value||'20'); localStorage.setItem('bbGoals', JSON.stringify(userData.goals)); renderGoals(); });
    document.getElementById('goal-r-save')?.addEventListener('click', ()=>{ userData.goals.readingsPerDay = parseInt(document.getElementById('goal-r-input').value||'1'); localStorage.setItem('bbGoals', JSON.stringify(userData.goals)); renderGoals(); });
}

// Dashboard 7-day mini bars
function renderDashboardBars(){
    const el = document.getElementById('dash-bars'); if(!el) return;
    const all = [
        ...JSON.parse(localStorage.getItem('cognitiveResults')||'[]'),
        ...JSON.parse(localStorage.getItem('languageResults')||'[]'),
        ...JSON.parse(localStorage.getItem('quizResults')||'[]')
    ];
    const days=[]; for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(d.toISOString().split('T')[0]); }
    el.innerHTML='';
    days.forEach(day=>{
        const f = all.filter(r=>r.date===day); const v = f.length? Math.round(f.reduce((s,r)=>s+r.percentage,0)/f.length):0;
        const b=document.createElement('div'); b.style.height=v+'%'; b.style.width='12%'; b.style.background=v>=80?'#16a34a':v>=60?'#f59e0b':'#dc2626'; b.title=`${day}: ${v}%`;
        el.appendChild(b);
    });
}

// Smart suggestions based on weakest categories and streak/goals
function renderSmartSuggestions(){
    const el = document.getElementById('bb-suggestions'); if(!el) return;
    const all = [
        ...JSON.parse(localStorage.getItem('cognitiveResults')||'[]'),
        ...JSON.parse(localStorage.getItem('languageResults')||'[]'),
        ...JSON.parse(localStorage.getItem('quizResults')||'[]')
    ];
    const byCat = {};
    all.forEach(r=>{ const k=r.category||r.type||'genel'; (byCat[k]=byCat[k]||[]).push(r.percentage); });
    const ranking = Object.entries(byCat).map(([k,arr])=>({k,avg:Math.round(arr.reduce((s,v)=>s+v,0)/arr.length)})).sort((a,b)=>a.avg-b.avg);
    const tips = [];
    if (ranking.length){ const w = ranking[0]; tips.push(`Zayıf alan: ${w.k} • Bugün 10 soru çöz.`); }
    const streak = calculateStreakDays?.() || 0;
    if (streak<3) tips.push('Streak başlat: bugün en az 1 test çöz.'); else tips.push(`Streak ${streak} gün — devam!`);
    const goals = JSON.parse(localStorage.getItem('bbGoals')||'null') || userData.goals;
    tips.push(`Günlük hedef: ${goals.questionsPerDay} soru, ${goals.wordsPerDay} kelime, ${goals.readingsPerDay} okuma.`);
    el.innerHTML = tips.map(t=>`<li>${t}</li>`).join('');
    // weak tags quick buttons from lastQuizResult.tagsBreakdown lowest
    try{
      const last = JSON.parse(localStorage.getItem('lastQuizResult')||'null');
      const tb = last && last.tagsBreakdown ? last.tagsBreakdown : null;
      const quick = document.getElementById('bb-quick-tags'); if(quick){
        if(tb){
          const items = Object.entries(tb).sort((a,b)=>a[1].percentage-b[1].percentage).slice(0,3);
          quick.innerHTML = items.map(([tag])=>`<button class="module-btn" onclick="bbQuickStart(['${tag}'])">#${tag}</button>`).join('');
        } else {
          quick.innerHTML = '';
        }
      }
    } catch(e){}
}

// Badges
function renderBadges(){
    const el = document.getElementById('bb-badges'); if(!el) return;
    const badges = computeBadges();
    localStorage.setItem('bbBadges', JSON.stringify(badges));
    el.innerHTML = badges.map(b=>`<div title="${b.title}\n${b.desc}" style="padding:8px 12px; border:1px solid var(--glass-border); border-radius:999px; background:${b.earned?'#16a34a33':'rgba(26,26,46,0.6)'}; color:${b.earned?'#16a34a':'var(--text-secondary)'};">${b.icon} ${b.title}</div>`).join('');
}

function computeBadges(){
    const all = [
        ...JSON.parse(localStorage.getItem('cognitiveResults')||'[]'),
        ...JSON.parse(localStorage.getItem('languageResults')||'[]'),
        ...JSON.parse(localStorage.getItem('quizResults')||'[]')
    ];
    const perfect = all.some(r=>r.percentage===100);
    const streak = calculateStreakDays?.() || 0;
    const known = JSON.parse(localStorage.getItem('knownWords')||'[]');
    const avg = all.length? Math.round(all.reduce((s,r)=>s+r.percentage,0)/all.length):0;
    const badgeList = [
        { key:'perfect', icon:'🎯', title:'Perfect', desc:'Bir testte %100', earned: perfect },
        { key:'streak7', icon:'🔥', title:'7-Gün Serisi', desc:'7 gün üst üste çalışma', earned: streak>=7 },
        { key:'words100', icon:'📚', title:'100 Kelime', desc:'100+ kelime işaretli', earned: known.length>=100 },
        { key:'avg80', icon:'🚀', title:'Ustalık', desc:'Genel ortalama %80+', earned: avg>=80 }
    ];
    return badgeList;
}

// Premium
function requirePremium(feature){ if(userData.premium) return true; showAchievementNotification('🔒 Premium özellik: '+feature); return false; }

// Theme toggle
function applyTheme(mode){ document.documentElement.dataset.theme = mode; localStorage.setItem('bbTheme', mode); }
function toggleTheme(){ const cur = localStorage.getItem('bbTheme')||'dark'; applyTheme(cur==='dark'?'light':'dark'); }

// Sayfa yüklendikende
document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı verilerini yükle
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        userData = { ...userData, ...JSON.parse(savedUserData) };
    }
    
    // Verileri yükle
    loadData();
    
    // Re-render goals and mini bars on focus (data may change)
    window.addEventListener('focus', ()=>{ renderGoals(); renderDashboardBars(); });

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
