// Voortgang tracking JavaScript
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize progress page
document.addEventListener('DOMContentLoaded', function() {
    updateOverallProgress();
    generateActivityCalendar();
    updateDetailedStats();
    updateRecentAchievements();
    loadActivityLog();
});

// Update overall progress statistics
function updateOverallProgress() {
    const cognitiveResults = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
    const languageResults = JSON.parse(localStorage.getItem('languageResults') || '[]');
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    
    // Calculate overall statistics
    const totalStudyDays = calculateStudyDays();
    const overallAverage = calculateOverallAverage();
    const currentStreak = calculateCurrentStreak();
    
    // Update main stats
    document.getElementById('total-study-days').textContent = totalStudyDays;
    document.getElementById('overall-average').textContent = overallAverage + '%';
    document.getElementById('current-streak').textContent = currentStreak;
    
    // Update cognitive progress
    updateCategoryProgress('cognitief', cognitiveResults);
    
    // Update language progress
    updateCategoryProgress('taal', languageResults);
    
    // Update scenario progress (mock data for now)
    updateScenarioProgress();
}

// Update category progress
function updateCategoryProgress(category, results) {
    const overallElement = document.getElementById(`${category}-overall`);
    const overallBarElement = document.getElementById(`${category}-overall-bar`);
    
    if (results.length > 0) {
        const avgPercentage = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length);
        overallElement.textContent = avgPercentage + '%';
        overallBarElement.style.width = avgPercentage + '%';
        
        // Update subcategories for cognitive tests
        if (category === 'cognitief') {
            ['numeriek', 'verbaal', 'abstract'].forEach(subcat => {
                const subcatResults = results.filter(r => r.category === subcat);
                if (subcatResults.length > 0) {
                    const subcatAvg = Math.round(subcatResults.reduce((sum, r) => sum + r.percentage, 0) / subcatResults.length);
                    const miniBar = document.getElementById(`${subcat}-mini`);
                    if (miniBar) miniBar.style.width = subcatAvg + '%';
                    
                    const scoreElement = miniBar?.parentElement?.querySelector('.mini-score');
                    if (scoreElement) scoreElement.textContent = subcatAvg + '%';
                }
            });
        }
        
        // Update subcategories for language tests
        if (category === 'taal') {
            ['lezen', 'woorden', 'grammatica'].forEach(subcat => {
                const subcatResults = results.filter(r => r.category === subcat);
                if (subcatResults.length > 0) {
                    const subcatAvg = Math.round(subcatResults.reduce((sum, r) => sum + r.percentage, 0) / subcatResults.length);
                    const miniBar = document.getElementById(`${subcat}-mini`);
                    if (miniBar) miniBar.style.width = subcatAvg + '%';
                    
                    const scoreElement = miniBar?.parentElement?.querySelector('.mini-score');
                    if (scoreElement) scoreElement.textContent = subcatAvg + '%';
                }
            });
        }
    }
}

// Update scenario progress (mock data)
function updateScenarioProgress() {
    const scenariosElement = document.getElementById('scenarios-overall');
    const scenariosBarElement = document.getElementById('scenarios-overall-bar');
    const scenariosSolvedElement = document.getElementById('scenarios-solved');
    const avgTimeElement = document.getElementById('avg-time');
    
    // Mock data
    const mockProgress = 42;
    const mockSolved = 23;
    const mockAvgTime = '2:15';
    
    if (scenariosElement) scenariosElement.textContent = mockProgress + '%';
    if (scenariosBarElement) scenariosBarElement.style.width = mockProgress + '%';
    if (scenariosSolvedElement) scenariosSolvedElement.textContent = mockSolved;
    if (avgTimeElement) avgTimeElement.textContent = mockAvgTime;
}

// Calculate total study days
function calculateStudyDays() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    const uniqueDates = new Set(allResults.map(r => r.date));
    return uniqueDates.size;
}

// Calculate overall average
function calculateOverallAverage() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    if (allResults.length === 0) return 0;
    
    return Math.round(allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length);
}

// Calculate current streak
function calculateCurrentStreak() {
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    if (allResults.length === 0) return 0;
    
    // Get unique dates and sort them
    const uniqueDates = [...new Set(allResults.map(r => r.date))].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();
    
    // Check if there was activity today or yesterday
    if (uniqueDates[0] === today) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
    } else if (uniqueDates[0] === new Date(checkDate.getTime() - 24*60*60*1000).toISOString().split('T')[0]) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 2);
    } else {
        return 0;
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

// Generate activity calendar
function generateActivityCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('current-month');
    
    const monthNames = [
        'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
        'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
    ];
    
    monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header-day';
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        dayElement.style.textAlign = 'center';
        dayElement.style.padding = '0.5rem';
        dayElement.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = lastDay.getDate();
    
    // Get activity data
    const allResults = [
        ...JSON.parse(localStorage.getItem('cognitiveResults') || '[]'),
        ...JSON.parse(localStorage.getItem('languageResults') || '[]'),
        ...JSON.parse(localStorage.getItem('quizResults') || '[]')
    ];
    
    const activityData = {};
    allResults.forEach(result => {
        const date = result.date;
        if (!activityData[date]) {
            activityData[date] = [];
        }
        activityData[date].push(result);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstWeekday; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        // Check if it's today
        if (dateString === todayString) {
            dayElement.classList.add('today');
        }
        
        // Check activity level
        if (activityData[dateString]) {
            const activityCount = activityData[dateString].length;
            dayElement.classList.add('has-activity');
            
            if (activityCount >= 5) {
                dayElement.classList.add('high-activity');
            } else if (activityCount >= 3) {
                dayElement.classList.add('medium-activity');
            } else {
                dayElement.classList.add('low-activity');
            }
            
            dayElement.title = `${activityCount} activiteiten op ${day}/${currentMonth + 1}`;
        }
        
        dayElement.onclick = () => showDayDetails(dateString, activityData[dateString] || []);
        calendarGrid.appendChild(dayElement);
    }
}

// Navigate to previous month
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateActivityCalendar();
}

// Navigate to next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateActivityCalendar();
}

// Show day details
function showDayDetails(date, activities) {
    if (activities.length === 0) {
        alert(`Geen activiteiten op ${date}`);
        return;
    }
    
    const details = activities.map(activity => 
        `${activity.time}: ${activity.category} test - ${activity.score}/${activity.total} (${activity.percentage}%)`
    ).join('\n');
    
    alert(`Activiteiten op ${date}:\n\n${details}`);
}

// Update detailed statistics based on period
function updateDetailedStats(period = 'week') {
  // Filter results based on period
  let filteredResults = [];
  const now = new Date();
  
  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredResults = getAllResults().filter(result => 
      new Date(result.date) >= weekAgo
    );
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredResults = getAllResults().filter(result => 
      new Date(result.date) >= monthAgo
    );
  } else {
    // 'all' period
    filteredResults = getAllResults();
  }
  
  // Update charts and stats
  generateScoreChart(filteredResults);
  updateTimeBreakdown(filteredResults);
  
  // Update activity log
  loadActivityLog(filteredResults);
}

// Get all results from localStorage
function getAllResults() {
  const cognitiveResults = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
  const languageResults = JSON.parse(localStorage.getItem('languageResults') || '[]');
  const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
  const scenarioResults = JSON.parse(localStorage.getItem('scenarioResults') || '[]');
  const interviewResults = JSON.parse(localStorage.getItem('interviewResults') || '[]');
  
  return [
    ...cognitiveResults.map(r => ({ ...r, type: 'cognitief' })),
    ...languageResults.map(r => ({ ...r, type: 'taal' })),
    ...quizResults.map(r => ({ ...r, type: 'quiz' })),
    ...scenarioResults.map(r => ({ ...r, type: 'scenario' })),
    ...interviewResults.map(r => ({ ...r, type: 'interview' }))
  ];
}

// Generate simple score chart
function generateScoreChart(results) {
    const chartBars = document.getElementById('score-bars');
    if (!chartBars) return;
    
    // Group by date and get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }
    
    chartBars.innerHTML = '';
    
    last7Days.forEach(date => {
        const dayResults = results.filter(r => r.date === date);
        const avgScore = dayResults.length > 0 
            ? Math.round(dayResults.reduce((sum, r) => sum + r.percentage, 0) / dayResults.length)
            : 0;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = avgScore + '%';
        bar.style.width = '12%';
        bar.style.backgroundColor = avgScore >= 80 ? '#16a34a' : avgScore >= 60 ? '#f59e0b' : '#dc2626';
        bar.style.margin = '0 1%';
        bar.style.display = 'inline-block';
        bar.style.verticalAlign = 'bottom';
        bar.style.borderRadius = '4px 4px 0 0';
        bar.title = `${date}: ${avgScore}% (${dayResults.length} tests)`;
        
        chartBars.appendChild(bar);
    });
    
    // Set container height
    chartBars.style.height = '200px';
    chartBars.style.display = 'flex';
    chartBars.style.alignItems = 'end';
    chartBars.style.padding = '1rem';
    chartBars.style.backgroundColor = 'rgba(26, 26, 46, 0.6)';
    chartBars.style.borderRadius = '8px';
    chartBars.style.border = '1px solid rgba(74, 144, 226, 0.3)';
}

// Update time breakdown
function updateTimeBreakdown(results) {
    const cognitiveResults = results.filter(r => r.type === 'cognitief');
    const languageResults = results.filter(r => r.type === 'taal');
    const quizResults = results.filter(r => r.type === 'quiz');
    
    // Calculate total time spent (mock calculation based on number of tests)
    const cognitiveTime = cognitiveResults.length * 8; // 8 minutes per test average
    const languageTime = languageResults.length * 7; // 7 minutes per test average
    const scenarioTime = quizResults.length * 5; // 5 minutes per quiz average
    
    const totalTime = cognitiveTime + languageTime + scenarioTime;
    
    // Update time bars
    const cognitivePercent = totalTime > 0 ? Math.round((cognitiveTime / totalTime) * 100) : 0;
    const languagePercent = totalTime > 0 ? Math.round((languageTime / totalTime) * 100) : 0;
    const scenarioPercent = totalTime > 0 ? Math.round((scenarioTime / totalTime) * 100) : 0;
    
    updateTimeBar('cognitief', cognitivePercent, Math.floor(cognitiveTime / 60), cognitiveTime % 60);
    updateTimeBar('taal', languagePercent, Math.floor(languageTime / 60), languageTime % 60);
    updateTimeBar('scenarios', scenarioPercent, Math.floor(scenarioTime / 60), scenarioTime % 60);
}

// Update individual time bar
function updateTimeBar(category, percentage, hours, minutes) {
    const fill = document.querySelector(`.time-fill.${category}`);
    const value = document.querySelector(`.time-item:has(.${category}) .time-value`);
    
    if (fill) fill.style.width = percentage + '%';
    if (value) value.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

// Update recent achievements
function updateRecentAchievements() {
    const achievements = calculateAchievements();
    const achievementsList = document.querySelector('.achievements-list');
    
    if (!achievementsList) return;
    
    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item ${achievement.earned ? 'earned' : ''}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
                ${achievement.earned 
                    ? `<span class="achievement-date">${achievement.date}</span>`
                    : `<span class="achievement-progress">${achievement.progress}</span>`
                }
            </div>
        </div>
    `).join('');
}

// Calculate achievements
function calculateAchievements() {
    const cognitiveResults = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
    const languageResults = JSON.parse(localStorage.getItem('languageResults') || '[]');
    const vocabulary = JSON.parse(localStorage.getItem('learnedVocabulary') || '[]');
    const streak = calculateCurrentStreak();
    
    const achievements = [
        {
            icon: '🎯',
            title: 'Perfecte Score',
            description: 'Behaald een 100% score op een test',
            earned: [...cognitiveResults, ...languageResults].some(r => r.percentage === 100),
            date: '2 dagen geleden'
        },
        {
            icon: '🔥',
            title: '7-dagen Streak',
            description: '7 dagen achtereen geoefend',
            earned: streak >= 7,
            date: streak >= 7 ? 'Vandaag' : null,
            progress: streak >= 7 ? null : `${streak}/7 dagen`
        },
        {
            icon: '📚',
            title: 'Woordenschat Master',
            description: '100 nieuwe woorden geleerd',
            earned: vocabulary.length >= 100,
            progress: vocabulary.length >= 100 ? null : `${vocabulary.length}/100`
        },
        {
            icon: '🚀',
            title: 'Snelle Leerling',
            description: 'Alle tests met 80%+ score',
            earned: [...cognitiveResults, ...languageResults].length > 0 && 
                    [...cognitiveResults, ...languageResults].every(r => r.percentage >= 80),
            progress: 'In voortgang'
        }
    ];
    
    return achievements;
}

// Show stats tab
function showStatsTab(period) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn:nth-child(${period === 'week' ? 1 : period === 'month' ? 2 : 3})`).classList.add('active');
    
    // Update chart based on period
    updateDetailedStats(period);
}

// Load activity log
function loadActivityLog(results = null) {
  const timeline = document.getElementById('activity-timeline');
  if (!timeline) return;
  
  // If no results provided, get all results
  if (!results) {
    results = getAllResults();
  }
  
  // Sort by date and time (most recent first)
  const sortedResults = results.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  // Take last 20 activities
  const recentActivities = sortedResults.slice(0, 20);
  
  timeline.innerHTML = recentActivities.map(activity => `
    <div class="activity-log-item">
      <div class="activity-icon">${getActivityIcon(activity.type)}</div>
      <div class="activity-details">
        <div class="activity-title">${getActivityTitle(activity)}</div>
        <div class="activity-meta">
          <span class="activity-date">${formatDate(activity.date)}</span>
          <span class="activity-score ${getScoreClass(activity.percentage)}">${activity.percentage}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Get activity icon based on type
function getActivityIcon(type) {
  const icons = {
    'cognitief': '🧠',
    'taal': '📚',
    'quiz': '❓',
    'scenario': '👮',
    'interview': '🎤'
  };
  return icons[type] || '📊';
}

// Get activity title based on type and category
function getActivityTitle(activity) {
  const titles = {
    'cognitief': `Cognitieve Test - ${activity.category || 'Algemeen'}`,
    'taal': `Taaltest - ${activity.category || 'Algemeen'}`,
    'quiz': `Dagelijkse Quiz`,
    'scenario': `Politie Scenario - ${activity.scenario || 'Algemeen'}`,
    'interview': `Interview Training - ${activity.interview || 'Algemeen'}`
  };
  return titles[activity.type] || 'Activiteit';
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Vandaag';
  } else if (diffDays === 2) {
    return 'Gisteren';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} dagen geleden`;
  } else {
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
}

// Get activity description
function getActivityDescription(activity) {
    const categoryNames = {
        numeriek: 'Numeriek Redeneren',
        verbaal: 'Verbaal Redeneren',
        abstract: 'Abstract Redeneren',
        lezen: 'Begrijpend Lezen',
        woorden: 'Woordenschat',
        grammatica: 'Grammatica',
        luisteren: 'Luistervaardigheid'
    };
    
    return `${categoryNames[activity.category] || activity.category} - ${activity.score}/${activity.total} vragen correct`;
}

// Get score class for styling
function getScoreClass(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    return 'needs-improvement';
}

// Filter activities
function filterActivities() {
    const filter = document.getElementById('activity-filter').value;
    const timeline = document.getElementById('activity-timeline');
    const items = timeline.querySelectorAll('.activity-log-item');
    
    items.forEach(item => {
        const description = item.querySelector('.activity-description').textContent.toLowerCase();
        
        if (filter === 'all') {
            item.style.display = 'flex';
        } else {
            const showItem = 
                (filter === 'cognitief' && (description.includes('numeriek') || description.includes('verbaal') || description.includes('abstract'))) ||
                (filter === 'taal' && (description.includes('lezen') || description.includes('woorden') || description.includes('grammatica') || description.includes('luistervaardigheid'))) ||
                (filter === 'scenario' && description.includes('scenario')) ||
                (filter === 'quiz' && description.includes('quiz'));
            
            item.style.display = showItem ? 'flex' : 'none';
        }
    });
}