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
        initializeGoals();
        loadRecentActivity();
        updateDashboardBars();
        loadSmartSuggestions();
        loadBadges();
        updateDailyWord();
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

// Update daily word
function updateDailyWord() {
    if (woordenData.length === 0) return;
    
    // Get today's date as seed for consistent daily word
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Use seed to select consistent word for the day
    const wordIndex = seed % woordenData.length;
    const dailyWord = woordenData[wordIndex];
    
    if (dailyWord) {
        document.getElementById('daily-word').textContent = dailyWord.woord;
        document.getElementById('word-meaning').innerHTML = `<span data-i18n="meaning">Betekenis</span>: ${dailyWord.betekenis}`;
        document.getElementById('word-example').textContent = dailyWord.voorbeeld;
        
        // Add practice button functionality
        const practiceBtn = document.querySelector('.word-practice-btn');
        if (practiceBtn) {
            practiceBtn.onclick = () => {
                localStorage.setItem('practiceWord', JSON.stringify(dailyWord));
                location.href = 'taal.html';
            };
        }
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
            <span class="activity-score ${getScoreClass(activity.score, activity.total)}">${activity.percentage}%</span>
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

// Format activity date
function formatActivityDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Gisteren';
    if (diffDays === 2) return '2 gün önce';
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('nl-NL', { 
        day: 'numeric', 
        month: 'short' 
    });
}

// Get score class for styling
function getScoreClass(score, total) {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
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
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
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
    // Attach roles to main landmarks for accessibility
    try { document.querySelectorAll('nav.top-nav').forEach(n=> n.setAttribute('role','navigation')); document.querySelector('main')?.setAttribute('role','main'); } catch {}
    // Dropdown keyboard navigation
    try {
      document.querySelectorAll('.nav-dropdown .dropdown-btn').forEach(btn=>{
        btn.setAttribute('aria-haspopup','true'); btn.setAttribute('aria-expanded','false');
        const menu = btn.parentElement.querySelector('.dropdown-menu');
        btn.addEventListener('keydown', (e)=>{
          if(e.key==='Enter' || e.key===' '){ e.preventDefault(); const open = menu.style.display==='block'; menu.style.display = open? 'none':'block'; btn.setAttribute('aria-expanded', String(!open)); if(!open) menu.querySelector('a')?.focus(); }
          if(e.key==='ArrowDown'){ e.preventDefault(); menu.querySelector('a')?.focus(); }
        });
        menu?.addEventListener('keydown',(e)=>{
          const links=[...menu.querySelectorAll('a')]; const idx=links.indexOf(document.activeElement);
          if(e.key==='ArrowDown'){ e.preventDefault(); (links[idx+1]||links[0])?.focus(); }
          if(e.key==='ArrowUp'){ e.preventDefault(); (links[idx-1]||links[links.length-1])?.focus(); }
          if(e.key==='Escape'){ e.preventDefault(); menu.style.display='none'; btn.setAttribute('aria-expanded','false'); btn.focus(); }
        });
      });
    } catch {}
    // Basic analytics
    try { const evts = JSON.parse(localStorage.getItem('bbAnalytics')||'[]'); evts.unshift({ t:Date.now(), path:location.pathname }); localStorage.setItem('bbAnalytics', JSON.stringify(evts.slice(0,500))); } catch {}
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

// Initialize goals system
function initializeGoals() {
    // Load saved goals from localStorage
    const savedGoals = JSON.parse(localStorage.getItem('bbGoals') || '{}');
    
    // Set default goals if none exist
    if (!savedGoals.questions) {
        savedGoals.questions = { target: 50, today: 0 };
        savedGoals.words = { target: 20, today: 0 };
        savedGoals.reading = { target: 1, today: 0 };
    }
    
    // Update UI
    updateGoalDisplay(savedGoals);
    
    // Add event listeners
    document.getElementById('goal-q-save')?.addEventListener('click', () => saveGoal('questions'));
    document.getElementById('goal-w-save')?.addEventListener('click', () => saveGoal('words'));
    document.getElementById('goal-r-save')?.addEventListener('click', () => saveGoal('reading'));
}

// Save goal
function saveGoal(type) {
    const input = document.getElementById(`goal-${type.charAt(0)}-input`);
    const target = parseInt(input.value);
    
    if (target > 0) {
        const goals = JSON.parse(localStorage.getItem('bbGoals') || '{}');
        goals[type] = { ...goals[type], target };
        localStorage.setItem('bbGoals', JSON.stringify(goals));
        
        updateGoalDisplay(goals);
        showAchievementNotification(`🎯 ${type} hedefi güncellendi: ${target}`);
    }
}

// Update goal display
function updateGoalDisplay(goals) {
    Object.keys(goals).forEach(type => {
        const goal = goals[type];
        const shortType = type.charAt(0);
        
        document.getElementById(`goal-${shortType}-target`).textContent = goal.target;
        document.getElementById(`goal-${shortType}-today`).textContent = goal.today;
        
        const percentage = Math.min((goal.today / goal.target) * 100, 100);
        document.getElementById(`goal-${shortType}-bar`).style.width = `${percentage}%`;
    });
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const activities = JSON.parse(localStorage.getItem('bbActivityHistory') || '[]');
    const recentActivities = activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-desc">Henüz aktivite yok</div>
                <div class="activity-date">Başlamak için bir test çözün</div>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-desc">${activity.description}</div>
            <div class="activity-date">${formatActivityDate(activity.date)}</div>
            <div class="activity-score ${getScoreClass(activity.score, activity.total)}">
                ${activity.score}/${activity.total} (${Math.round((activity.score / activity.total) * 100)}%)
            </div>
        </div>
    `).join('');
}

// Update dashboard bars (last 7 days)
function updateDashboardBars() {
    const dashBars = document.getElementById('dash-bars');
    if (!dashBars) return;
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayActivities = JSON.parse(localStorage.getItem(`bbDay_${dateStr}`) || '[]');
        const totalScore = dayActivities.reduce((sum, act) => sum + act.score, 0);
        const totalQuestions = dayActivities.reduce((sum, act) => sum + act.total, 0);
        
        last7Days.push({
            date: dateStr,
            score: totalScore,
            total: totalQuestions,
            percentage: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0
        });
    }
    
    const maxPercentage = Math.max(...last7Days.map(d => d.percentage));
    
    dashBars.innerHTML = last7Days.map(day => {
        const height = maxPercentage > 0 ? (day.percentage / maxPercentage) * 100 : 0;
        const color = day.percentage >= 80 ? '#22c55e' : day.percentage >= 60 ? '#eab308' : '#ef4444';
        
        return `
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <div style="width:20px; height:${height}px; background:${color}; border-radius:4px; transition:height 0.3s ease;"></div>
                <small style="font-size:10px; color:var(--text-secondary);">${new Date(day.date).getDate()}</small>
            </div>
        `;
    }).join('');
}

// Load smart suggestions
function loadSmartSuggestions() {
    const suggestionsList = document.getElementById('bb-suggestions');
    const quickTags = document.getElementById('bb-quick-tags');
    
    if (!suggestionsList || !quickTags) return;
    
    const userProgress = getUserProgress();
    const suggestions = generateSuggestions(userProgress);
    
    suggestionsList.innerHTML = suggestions.map(suggestion => 
        `<li>${suggestion}</li>`
    ).join('');
    
    const tags = ['Hızlı Test', 'Kelime Çalışması', 'Senaryo', 'Mülakat'];
    quickTags.innerHTML = tags.map(tag => 
        `<button class="module-btn" onclick="bbQuickStart(['${tag}'])">${tag}</button>`
    ).join('');
}

// Generate smart suggestions based on user progress
function generateSuggestions(progress) {
    const suggestions = [];
    
    if (progress.cognitief < 50) {
        suggestions.push('🧠 Cognitieve vaardigheden oefenen - düşük ilerleme');
    }
    if (progress.taal < 40) {
        suggestions.push('💬 Taalvaardigheid geliştirmek için daha fazla kelime çalışın');
    }
    if (progress.scenarios < 30) {
        suggestions.push('👮 Politie scenario\'s pratik yapmak için zaman ayırın');
    }
    if (progress.gesprek < 20) {
        suggestions.push('📋 Gesprekstraining ile mülakat becerilerinizi geliştirin');
    }
    
    if (suggestions.length === 0) {
        suggestions.push('🎯 Mükemmel ilerleme! Bugün yeni bir zorluk deneyin');
    }
    
    return suggestions;
}

// Load badges
function loadBadges() {
    const badgesContainer = document.getElementById('bb-badges');
    if (!badgesContainer) return;
    
    const badges = computeBadges();
    
    badgesContainer.innerHTML = badges.map(badge => `
        <div class="badge-item" title="${badge.description}">
            <span style="font-size:24px;">${badge.icon}</span>
            <span style="font-size:12px; color:var(--text-secondary);">${badge.name}</span>
        </div>
    `).join('');
}

// Compute user badges
function computeBadges() {
    const badges = [];
    const userProgress = getUserProgress();
    
    if (userProgress.cognitief >= 80) {
        badges.push({ icon: '🧠', name: 'Logic Master', description: 'Cognitieve vaardigheden tamamlandı' });
    }
    if (userProgress.taal >= 70) {
        badges.push({ icon: '💬', name: 'Language Expert', description: 'Taalvaardigheid geliştirildi' });
    }
    if (userProgress.scenarios >= 60) {
        badges.push({ icon: '👮', name: 'Scenario Pro', description: 'Politie scenario\'s başarıyla tamamlandı' });
    }
    if (userProgress.gesprek >= 50) {
        badges.push({ icon: '📋', name: 'Interview Ready', description: 'Gesprekstraining tamamlandı' });
    }
    
    return badges;
}

// Get user progress
function getUserProgress() {
    return {
        cognitief: 65,
        taal: 42,
        scenarios: 28,
        gesprek: 15
    };
}

// Language test functions
let currentLanguageTest = null;
let languageQuestions = [];
let currentLanguageQuestionIndex = 0;
let languageAnswers = [];

function startLanguageTest(type) {
    currentLanguageTest = type;
    currentLanguageQuestionIndex = 0;
    languageAnswers = [];
    
    // Load questions based on type
    switch(type) {
        case 'lezen':
            loadReadingQuestions();
            break;
        case 'luisteren':
            loadListeningQuestions();
            break;
        case 'woorden':
            loadVocabularyQuestions();
            break;
        case 'grammatica':
            loadGrammarQuestions();
            break;
        default:
            console.error('Unknown language test type:', type);
            return;
    }
    
    // Show test interface
    document.getElementById('language-test-section').style.display = 'block';
    document.getElementById('language-overview-section').style.display = 'none';
    
    renderLanguageQuestion();
}

function loadReadingQuestions() {
    // Load from data/taal_lezen.json
    fetch('data/taal_lezen.json')
        .then(res => res.json())
        .then(data => {
            languageQuestions = data.questions || [];
            if (languageQuestions.length === 0) {
                showLanguageError('Leesvaardigheid vragen bulunamadı');
            }
        })
        .catch(err => {
            console.error('Error loading reading questions:', err);
            showLanguageError('Leesvaardigheid vragen yüklenemedi');
        });
}

function loadListeningQuestions() {
    // Load from data/taal_luisteren.json
    fetch('data/taal_luisteren.json')
        .then(res => res.json())
        .then(data => {
            languageQuestions = data.questions || [];
            if (languageQuestions.length === 0) {
                showLanguageError('Luistervaardigheid vragen bulunamadı');
            }
        })
        .catch(err => {
            console.error('Error loading listening questions:', err);
            showLanguageError('Luistervaardigheid vragen yüklenemedi');
        });
}

function loadVocabularyQuestions() {
    // Use woorden data for vocabulary test
    if (woordenData.length > 0) {
        languageQuestions = woordenData.slice(0, 20).map(word => ({
            question: `Wat betekent "${word.woord}"?`,
            options: [
                word.betekenis,
                word.betekenis + ' (alternatief)',
                'Geen van bovenstaande',
                'Ik weet het niet'
            ],
            correct: 0,
            explanation: word.voorbeeld
        }));
    } else {
        showLanguageError('Woordenschat data bulunamadı');
    }
}

function loadGrammarQuestions() {
    // Basic grammar questions
    languageQuestions = [
        {
            question: 'Welke vorm is correct? "Ik ___ naar school."',
            options: ['ga', 'gaan', 'gaat', 'gaten'],
            correct: 0,
            explanation: 'Eerste persoon enkelvoud gebruikt "ga"'
        },
        {
            question: 'Vul in: "Hij ___ een boek."',
            options: ['leest', 'lezen', 'lees', 'leest'],
            correct: 0,
            explanation: 'Derde persoon enkelvoud gebruikt "leest"'
        }
    ];
}

function renderLanguageQuestion() {
    if (currentLanguageQuestionIndex >= languageQuestions.length) {
        finishLanguageTest();
        return;
    }
    
    const question = languageQuestions[currentLanguageQuestionIndex];
    const questionContainer = document.getElementById('language-question-container');
    
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="question-header">
                <h3>Vraag ${currentLanguageQuestionIndex + 1} van ${languageQuestions.length}</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentLanguageQuestionIndex + 1) / languageQuestions.length) * 100}%"></div>
                </div>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="selectLanguageAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    updateLanguageNavigation();
}

function selectLanguageAnswer(answerIndex) {
    languageAnswers[currentLanguageQuestionIndex] = answerIndex;
    
    // Mark selected answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
    
    // Enable next button
    document.getElementById('lang-next-btn').disabled = false;
}

function nextLanguageQuestion() {
    if (currentLanguageQuestionIndex < languageQuestions.length - 1) {
        currentLanguageQuestionIndex++;
        renderLanguageQuestion();
    } else {
        // Show finish button
        document.getElementById('lang-finish-btn').style.display = 'inline-block';
        document.getElementById('lang-next-btn').style.display = 'none';
    }
}

function previousLanguageQuestion() {
    if (currentLanguageQuestionIndex > 0) {
        currentLanguageQuestionIndex--;
        renderLanguageQuestion();
    }
}

function finishLanguageTest() {
    const score = calculateLanguageScore();
    showLanguageResults(score);
}

function calculateLanguageScore() {
    let correct = 0;
    languageAnswers.forEach((answer, index) => {
        if (answer === languageQuestions[index].correct) {
            correct++;
        }
    });
    
    return {
        correct,
        total: languageQuestions.length,
        percentage: Math.round((correct / languageQuestions.length) * 100)
    };
}

function showLanguageResults(score) {
    const resultsContainer = document.getElementById('language-results-section');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Test Resultaten</h2>
                <div class="score-display">
                    <span class="score-number">${score.correct}/${score.total}</span>
                    <span class="score-percentage">${score.percentage}%</span>
                </div>
            </div>
            <div class="results-details">
                <p>Je hebt ${score.correct} van de ${score.total} vragen correct beantwoord.</p>
                <p>Score: ${score.percentage}%</p>
            </div>
            <div class="results-actions">
                <button class="challenge-btn" onclick="retryLanguageTest()">Test Opnieuw</button>
                <button class="module-btn" onclick="backToLanguageOverview()">Terug naar Overzicht</button>
            </div>
        `;
        
        resultsContainer.style.display = 'block';
        document.getElementById('language-test-section').style.display = 'none';
    }
    
    // Save to activity history
    saveLanguageActivity(score);
}

function saveLanguageActivity(score) {
    const activity = {
        type: 'language',
        test: currentLanguageTest,
        score: score.correct,
        total: score.total,
        percentage: score.percentage,
        date: new Date().toISOString(),
        description: `${currentLanguageTest} test - ${score.percentage}%`
    };
    
    const history = JSON.parse(localStorage.getItem('bbActivityHistory') || '[]');
    history.unshift(activity);
    localStorage.setItem('bbActivityHistory', JSON.stringify(history.slice(0, 100)));
}

function retryLanguageTest() {
    startLanguageTest(currentLanguageTest);
}

function backToLanguageOverview() {
    document.getElementById('language-overview-section').style.display = 'block';
    document.getElementById('language-test-section').style.display = 'none';
    document.getElementById('language-results-section').style.display = 'none';
}

function endGlobalLanguageResults() {
    location.href = 'index.html';
}

function showLanguageError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.getElementById('language-overview-section').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function updateLanguageNavigation() {
    document.getElementById('lang-prev-btn').disabled = currentLanguageQuestionIndex === 0;
    document.getElementById('lang-next-btn').disabled = !languageAnswers[currentLanguageQuestionIndex];
}

// Cognitive test functions
let currentCognitiveTest = null;
let cognitiveQuestions = [];
let currentCognitiveQuestionIndex = 0;
let cognitiveAnswers = [];

function startCognitiveTest(type) {
    currentCognitiveTest = type;
    currentCognitiveQuestionIndex = 0;
    cognitiveAnswers = [];
    
    // Load questions based on type
    switch(type) {
        case 'numeriek':
            loadNumericalQuestions();
            break;
        case 'verbaal':
            loadVerbalQuestions();
            break;
        case 'abstract':
            loadAbstractQuestions();
            break;
        default:
            console.error('Unknown cognitive test type:', type);
            return;
    }
    
    // Show test interface
    document.getElementById('cognitive-test-section').style.display = 'block';
    document.getElementById('cognitive-overview-section').style.display = 'none';
    
    renderCognitiveQuestion();
}

function loadNumericalQuestions() {
    // Load from data/cognitief_numeriek.json
    fetch('data/cognitief_numeriek.json')
        .then(res => res.json())
        .then(data => {
            cognitiveQuestions = data.questions || [];
            if (cognitiveQuestions.length === 0) {
                showCognitiveError('Numerieke vragen bulunamadı');
            }
        })
        .catch(err => {
            console.error('Error loading numerical questions:', err);
            showCognitiveError('Numerieke vragen yüklenemedi');
        });
}

function loadVerbalQuestions() {
    // Load from data/cognitief_verbaal.json
    fetch('data/cognitief_verbaal.json')
        .then(res => res.json())
        .then(data => {
            cognitiveQuestions = data.questions || [];
            if (cognitiveQuestions.length === 0) {
                showCognitiveError('Verbale vragen bulunamadı');
            }
        })
        .catch(err => {
            console.error('Error loading verbal questions:', err);
            showCognitiveError('Verbale vragen yüklenemedi');
        });
}

function loadAbstractQuestions() {
    // Load from data/cognitief_abstract.json
    fetch('data/cognitief_abstract.json')
        .then(res => res.json())
        .then(data => {
            cognitiveQuestions = data.questions || [];
            if (cognitiveQuestions.length === 0) {
                showCognitiveError('Abstracte vragen bulunamadı');
            }
        })
        .catch(err => {
            console.error('Error loading abstract questions:', err);
            showCognitiveError('Abstracte vragen yüklenemedi');
        });
}

function renderCognitiveQuestion() {
    if (currentCognitiveQuestionIndex >= cognitiveQuestions.length) {
        finishCognitiveTest();
        return;
    }
    
    const question = cognitiveQuestions[currentCognitiveQuestionIndex];
    const questionContainer = document.getElementById('cognitive-question-container');
    
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="question-header">
                <h3>Vraag ${currentCognitiveQuestionIndex + 1} van ${cognitiveQuestions.length}</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentCognitiveQuestionIndex + 1) / cognitiveQuestions.length) * 100}%"></div>
                </div>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="selectCognitiveAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    updateCognitiveNavigation();
}

function selectCognitiveAnswer(answerIndex) {
    cognitiveAnswers[currentCognitiveQuestionIndex] = answerIndex;
    
    // Mark selected answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === answerIndex) {
            btn.classList.add('selected');
        }
    });
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    if (currentCognitiveQuestionIndex < cognitiveQuestions.length - 1) {
        currentCognitiveQuestionIndex++;
        renderCognitiveQuestion();
    } else {
        // Show finish button
        document.getElementById('finish-btn').style.display = 'inline-block';
        document.getElementById('next-btn').style.display = 'none';
    }
}

function previousQuestion() {
    if (currentCognitiveQuestionIndex > 0) {
        currentCognitiveQuestionIndex--;
        renderCognitiveQuestion();
    }
}

function finishTest() {
    const score = calculateCognitiveScore();
    showCognitiveResults(score);
}

function calculateCognitiveScore() {
    let correct = 0;
    cognitiveAnswers.forEach((answer, index) => {
        if (answer === cognitiveQuestions[index].correct) {
            correct++;
        }
    });
    
    return {
        correct,
        total: cognitiveQuestions.length,
        percentage: Math.round((correct / cognitiveQuestions.length) * 100)
    };
}

function showCognitiveResults(score) {
    const resultsContainer = document.getElementById('cognitive-results-section');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Test Resultaten</h2>
                <div class="score-display">
                    <span class="score-number">${score.correct}/${score.total}</span>
                    <span class="score-percentage">${score.percentage}%</span>
                </div>
            </div>
            <div class="results-details">
                <p>Je hebt ${score.correct} van de ${score.total} vragen correct beantwoord.</p>
                <p>Score: ${score.percentage}%</p>
            </div>
            <div class="results-actions">
                <button class="challenge-btn" onclick="retryTest()">Test Opnieuw Doen</button>
                <button class="module-btn" onclick="backToOverview()">Terug naar Overzicht</button>
                <button class="challenge-btn" onclick="goToDashboard()">Dashboard</button>
            </div>
        `;
        
        resultsContainer.style.display = 'block';
        document.getElementById('cognitive-test-section').style.display = 'none';
    }
    
    // Save to activity history
    saveCognitiveActivity(score);
}

function saveCognitiveActivity(score) {
    const activity = {
        type: 'cognitive',
        test: currentCognitiveTest,
        score: score.correct,
        total: score.total,
        percentage: score.percentage,
        date: new Date().toISOString(),
        description: `${currentCognitiveTest} test - ${score.percentage}%`
    };
    
    const history = JSON.parse(localStorage.getItem('bbActivityHistory') || '[]');
    history.unshift(activity);
    localStorage.setItem('bbActivityHistory', JSON.stringify(history.slice(0, 100)));
}

function retryTest() {
    startCognitiveTest(currentCognitiveTest);
}

function backToOverview() {
    document.getElementById('cognitive-overview-section').style.display = 'block';
    document.getElementById('cognitive-test-section').style.display = 'none';
    document.getElementById('cognitive-results-section').style.display = 'none';
}

function goToDashboard() {
    location.href = 'index.html';
}

function endGlobalResults() {
    location.href = 'index.html';
}

function showCognitiveError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.getElementById('cognitive-overview-section').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function updateCognitiveNavigation() {
    document.getElementById('prev-btn').disabled = currentCognitiveQuestionIndex === 0;
    document.getElementById('next-btn').disabled = !cognitiveAnswers[currentCognitiveQuestionIndex];
}

// Progress tracking functions
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateProgressCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateProgressCalendar();
}

function showStatsTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Show corresponding content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    const activeContent = document.getElementById(`${tab}-stats`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
    
    // Load stats for the selected tab
    loadStatsForTab(tab);
}

function loadStatsForTab(tab) {
    switch(tab) {
        case 'week':
            loadWeeklyStats();
            break;
        case 'month':
            loadMonthlyStats();
            break;
        case 'all':
            loadAllTimeStats();
            break;
    }
}

function loadWeeklyStats() {
    const weekStats = document.getElementById('week-stats');
    if (!weekStats) return;
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayActivities = JSON.parse(localStorage.getItem(`bbDay_${dateStr}`) || '[]');
        const totalScore = dayActivities.reduce((sum, act) => sum + act.score, 0);
        const totalQuestions = dayActivities.reduce((sum, act) => sum + act.total, 0);
        
        last7Days.push({
            date: dateStr,
            score: totalScore,
            total: totalQuestions,
            percentage: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0
        });
    }
    
    const totalScore = last7Days.reduce((sum, day) => sum + day.score, 0);
    const totalQuestions = last7Days.reduce((sum, day) => sum + day.total, 0);
    const averagePercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    weekStats.innerHTML = `
        <div class="stats-summary">
            <div class="stat-card">
                <h4>Toplam Score</h4>
                <div class="stat-value">${totalScore}/${totalQuestions}</div>
            </div>
            <div class="stat-card">
                <h4>Gemiddelde</h4>
                <div class="stat-value">${averagePercentage.toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <h4>Actieve Dagen</h4>
                <div class="stat-value">${last7Days.filter(day => day.total > 0).length}/7</div>
            </div>
        </div>
        <div class="daily-breakdown">
            <h4>Dagelijkse Uitsplitsing</h4>
            <div class="daily-chart">
                ${last7Days.map(day => `
                    <div class="daily-bar">
                        <div class="bar-label">${new Date(day.date).getDate()}</div>
                        <div class="bar-fill" style="height: ${day.percentage}%"></div>
                        <div class="bar-value">${day.percentage.toFixed(0)}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function loadMonthlyStats() {
    const monthStats = document.getElementById('month-stats');
    if (!monthStats) return;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthActivities = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayActivities = JSON.parse(localStorage.getItem(`bbDay_${dateStr}`) || '[]');
        
        if (dayActivities.length > 0) {
            const totalScore = dayActivities.reduce((sum, act) => sum + act.score, 0);
            const totalQuestions = dayActivities.reduce((sum, act) => sum + act.total, 0);
            
            monthActivities.push({
                day,
                score: totalScore,
                total: totalQuestions,
                percentage: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0
            });
        }
    }
    
    const totalScore = monthActivities.reduce((sum, day) => sum + day.score, 0);
    const totalQuestions = monthActivities.reduce((sum, day) => sum + day.total, 0);
    const averagePercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    monthStats.innerHTML = `
        <div class="stats-summary">
            <div class="stat-card">
                <h4>Maandelijkse Score</h4>
                <div class="stat-value">${totalScore}/${totalQuestions}</div>
            </div>
            <div class="stat-card">
                <h4>Gemiddelde</h4>
                <div class="stat-value">${averagePercentage.toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <h4>Actieve Dagen</h4>
                <div class="stat-value">${monthActivities.length}/${daysInMonth}</div>
            </div>
        </div>
        <div class="monthly-chart">
            <h4>Maandelijkse Prestatie</h4>
            <div class="calendar-grid">
                ${Array.from({length: daysInMonth}, (_, i) => {
                    const day = i + 1;
                    const dayData = monthActivities.find(d => d.day === day);
                    const percentage = dayData ? dayData.percentage : 0;
                    const colorClass = percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : percentage >= 40 ? 'average' : 'needs-improvement';
                    
                    return `
                        <div class="calendar-day ${colorClass}" title="Dag ${day}: ${percentage.toFixed(0)}%">
                            <span class="day-number">${day}</span>
                            <span class="day-score">${percentage.toFixed(0)}%</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function loadAllTimeStats() {
    const allStats = document.getElementById('all-stats');
    if (!allStats) return;
    
    const allActivities = JSON.parse(localStorage.getItem('bbActivityHistory') || '[]');
    const totalScore = allActivities.reduce((sum, act) => sum + act.score, 0);
    const totalQuestions = allActivities.reduce((sum, act) => sum + act.total, 0);
    const averagePercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    // Group by type
    const typeStats = {};
    allActivities.forEach(activity => {
        if (!typeStats[activity.type]) {
            typeStats[activity.type] = { count: 0, totalScore: 0, totalQuestions: 0 };
        }
        typeStats[activity.type].count++;
        typeStats[activity.type].totalScore += activity.score;
        typeStats[activity.type].totalQuestions += activity.total;
    });
    
    allStats.innerHTML = `
        <div class="stats-summary">
            <div class="stat-card">
                <h4>Totale Score</h4>
                <div class="stat-value">${totalScore}/${totalQuestions}</div>
            </div>
            <div class="stat-card">
                <h4>Gemiddelde</h4>
                <div class="stat-value">${averagePercentage.toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <h4>Totale Tests</h4>
                <div class="stat-value">${allActivities.length}</div>
            </div>
        </div>
        <div class="type-breakdown">
            <h4>Uitsplitsing per Type</h4>
            <div class="type-stats">
                ${Object.entries(typeStats).map(([type, stats]) => {
                    const avg = stats.totalQuestions > 0 ? (stats.totalScore / stats.totalQuestions) * 100 : 0;
                    return `
                        <div class="type-stat">
                            <div class="type-name">${type}</div>
                            <div class="type-score">${stats.totalScore}/${stats.totalQuestions}</div>
                            <div class="type-avg">${avg.toFixed(1)}%</div>
                            <div class="type-count">${stats.count} tests</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function updateProgressCalendar() {
    const calendarTitle = document.getElementById('calendar-title');
    if (calendarTitle) {
        const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 
                           'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Update calendar grid
    const calendarGrid = document.getElementById('calendar-grid');
    if (calendarGrid) {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        let calendarHTML = '';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayActivities = JSON.parse(localStorage.getItem(`bbDay_${dateStr}`) || '[]');
            
            let dayClass = 'calendar-day';
            let dayContent = `<span class="day-number">${day}</span>`;
            
            if (dayActivities.length > 0) {
                const totalScore = dayActivities.reduce((sum, act) => sum + act.score, 0);
                const totalQuestions = dayActivities.reduce((sum, act) => sum + act.total, 0);
                const percentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
                
                if (percentage >= 80) dayClass += ' excellent';
                else if (percentage >= 60) dayClass += ' good';
                else if (percentage >= 40) dayClass += ' average';
                else dayClass += ' needs-improvement';
                
                dayContent += `<span class="day-score">${percentage.toFixed(0)}%</span>`;
            }
            
            calendarHTML += `<div class="${dayClass}">${dayContent}</div>`;
        }
        
        calendarGrid.innerHTML = calendarHTML;
    }
}
