// Cognitieve test JavaScript
let currentCognitiveTest = null;
let currentQuestionIndex = 0;
let cognitiveAnswers = [];
let cognitiveScore = 0;
let testStartTime = null;
let testCategory = '';

// Cognitieve test data laden
async function loadCognitiveData() {
    try {
        const [numeriek, verbaal, abstract] = await Promise.all([
            fetch('data/cognitief_numeriek.json').then(res => res.json()),
            fetch('data/cognitief_verbaal.json').then(res => res.json()),
            fetch('data/cognitief_abstract.json').then(res => res.json())
        ]);
        
        return { numeriek, verbaal, abstract };
    } catch (error) {
        console.error('Error loading cognitive data:', error);
        return null;
    }
}

// Start cognitieve test
async function startCognitiveTest(category) {
    const data = await loadCognitiveData();
    if (!data) {
        alert('Kon testdata niet laden. Probeer het opnieuw.');
        return;
    }

    // Reset test state
    currentQuestionIndex = 0;
    cognitiveAnswers = [];
    cognitiveScore = 0;
    testCategory = category;
    testStartTime = new Date();

    // Get questions for category
    currentCognitiveTest = shuffleArray(data[category] || []).slice(0, 10);
    
    if (currentCognitiveTest.length === 0) {
        alert('Geen vragen beschikbaar voor deze categorie.');
        return;
    }

    // Hide overview and show test interface
    document.querySelector('.test-categories').style.display = 'none';
    document.querySelector('.tips-section').style.display = 'none';
    document.getElementById('test-interface').style.display = 'block';
    
    // Update test title
    document.getElementById('test-title').textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Redeneren Test`;
    
    // Start first question
    showCognitiveQuestion();
    startTestTimer();
}

// Show current question
function showCognitiveQuestion() {
    const question = currentCognitiveTest[currentQuestionIndex];
    const questionContainer = document.getElementById('current-question');
    const optionsContainer = document.getElementById('question-options');
    const counter = document.getElementById('question-counter');
    const progressFill = document.getElementById('test-progress-fill');

    // Update question counter and progress
    counter.textContent = `Vraag ${currentQuestionIndex + 1} van ${currentCognitiveTest.length}`;
    const progressPercent = ((currentQuestionIndex + 1) / currentCognitiveTest.length) * 100;
    progressFill.style.width = progressPercent + '%';

    // Display question
    questionContainer.innerHTML = `
        <h4>Vraag ${currentQuestionIndex + 1}</h4>
        <p>${question.vraag}</p>
    `;

    // Display options
    optionsContainer.innerHTML = '';
    question.opties.forEach((optie, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = optie;
        button.onclick = () => selectCognitiveAnswer(index);
        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    updateCognitiveNavButtons();
}

// Select answer
function selectCognitiveAnswer(selectedIndex) {
    // Remove previous selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected
    document.querySelectorAll('.option-btn')[selectedIndex].classList.add('selected');
    
    // Store answer
    cognitiveAnswers[currentQuestionIndex] = selectedIndex;
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < currentCognitiveTest.length - 1) {
        currentQuestionIndex++;
        showCognitiveQuestion();
    } else {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('finish-btn').style.display = 'block';
    }
}

// Navigate to previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showCognitiveQuestion();
    }
}

// Update navigation buttons
function updateCognitiveNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = cognitiveAnswers[currentQuestionIndex] === undefined;
    
    if (currentQuestionIndex === currentCognitiveTest.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = cognitiveAnswers[currentQuestionIndex] !== undefined ? 'block' : 'none';
    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
    }
}

// Finish test
function finishTest() {
    // Calculate score
    cognitiveScore = 0;
    const results = [];
    
    currentCognitiveTest.forEach((question, index) => {
        const userAnswer = cognitiveAnswers[index];
        const correct = userAnswer === question.antwoord;
        if (correct) cognitiveScore++;
        
        results.push({
            question: question.vraag,
            userAnswer: question.opties[userAnswer],
            correctAnswer: question.opties[question.antwoord],
            correct: correct,
            explanation: question.uitleg
        });
    });
    
    // Hide test interface and show results
    document.getElementById('test-interface').style.display = 'none';
    document.getElementById('test-results').style.display = 'block';
    
    showCognitiveResults(results);
    saveCognitiveResults();
}

// Show test results
function showCognitiveResults(results) {
    const finalScore = document.getElementById('final-score');
    const percentageScore = document.getElementById('percentage-score');
    const performanceRating = document.getElementById('performance-rating');
    const categoryBreakdown = document.getElementById('category-breakdown');
    const improvementSuggestions = document.getElementById('improvement-suggestions');

    const percentage = Math.round((cognitiveScore / currentCognitiveTest.length) * 100);
    
    finalScore.textContent = cognitiveScore;
    percentageScore.textContent = percentage + '%';
    
    // Performance rating
    if (percentage >= 80) {
        performanceRating.textContent = 'Uitstekend!';
        performanceRating.className = 'performance-rating excellent';
    } else if (percentage >= 60) {
        performanceRating.textContent = 'Goed gedaan!';
        performanceRating.className = 'performance-rating good';
    } else {
        performanceRating.textContent = 'Blijf oefenen!';
        performanceRating.className = 'performance-rating needs-improvement';
    }
    
    // Category breakdown
    categoryBreakdown.innerHTML = `
        <p><strong>${testCategory.charAt(0).toUpperCase() + testCategory.slice(1)}:</strong> ${cognitiveScore}/${currentCognitiveTest.length} (${percentage}%)</p>
    `;
    
    // Improvement suggestions
    const suggestions = getCognitiveImprovementSuggestions(percentage, testCategory);
    improvementSuggestions.innerHTML = suggestions.map(tip => `<p>• ${tip}</p>`).join('');
}

// Get improvement suggestions
function getCognitiveImprovementSuggestions(percentage, category) {
    const suggestions = [];
    
    if (category === 'numeriek') {
        if (percentage < 60) {
            suggestions.push('Oefen dagelijks met hoofdrekenen');
            suggestions.push('Leer de rekenvolgorde (haakjes, machten, vermenigvuldigen/delen, optellen/aftrekken)');
            suggestions.push('Train met percentageberekeningen');
        } else if (percentage < 80) {
            suggestions.push('Focus op complexere vraagstukken');
            suggestions.push('Oefen met tijddruk');
        } else {
            suggestions.push('Uitstekend! Blijf regelmatig oefenen om scherp te blijven');
        }
    } else if (category === 'verbaal') {
        if (percentage < 60) {
            suggestions.push('Lees meer Nederlandse teksten');
            suggestions.push('Oefen met synoniemen en antoniemen');
            suggestions.push('Train tekstbegrip met korte artikelen');
        } else if (percentage < 80) {
            suggestions.push('Focus op logische redeneringen');
            suggestions.push('Oefen met complexere teksten');
        } else {
            suggestions.push('Zeer goed! Blijf je woordenschat uitbreiden');
        }
    } else if (category === 'abstract') {
        if (percentage < 60) {
            suggestions.push('Train met eenvoudige patronen');
            suggestions.push('Oefen met logische reeksen');
            suggestions.push('Werk aan ruimtelijk inzicht');
        } else if (percentage < 80) {
            suggestions.push('Focus op complexere patronen');
            suggestions.push('Oefen met tijddruk');
        } else {
            suggestions.push('Perfect! Je hebt uitstekend abstract denkvermogen');
        }
    }
    
    return suggestions;
}

// Save results to localStorage
function saveCognitiveResults() {
    const testTime = Math.round((new Date() - testStartTime) / 1000);
    const percentage = Math.round((cognitiveScore / currentCognitiveTest.length) * 100);
    
    const result = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('nl-NL'),
        category: testCategory,
        score: cognitiveScore,
        total: currentCognitiveTest.length,
        percentage: percentage,
        duration: testTime
    };
    
    // Save to cognitive results
    let cognitiveResults = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
    cognitiveResults.unshift(result);
    cognitiveResults = cognitiveResults.slice(0, 100); // Keep last 100 results
    localStorage.setItem('cognitiveResults', JSON.stringify(cognitiveResults));
    
    // Update progress
    updateCognitiveProgress();
    
    // Update activity log
    addToActivityHistory('cognitief', `${testCategory} test`, cognitiveScore, currentCognitiveTest.length);
}

// Update progress bars
function updateCognitiveProgress() {
    const results = JSON.parse(localStorage.getItem('cognitiveResults') || '[]');
    
    ['numeriek', 'verbaal', 'abstract'].forEach(category => {
        const categoryResults = results.filter(r => r.category === category);
        if (categoryResults.length > 0) {
            const avgPercentage = categoryResults.reduce((sum, r) => sum + r.percentage, 0) / categoryResults.length;
            const progressBar = document.getElementById(`${category}-progress`);
            const progressText = document.getElementById(`${category}-progress-text`);
            
            if (progressBar) {
                progressBar.style.width = Math.round(avgPercentage) + '%';
            }
            if (progressText) {
                progressText.textContent = Math.round(avgPercentage) + '% voltooid';
            }
        }
    });
    
    // Update overall stats
    const totalCompleted = results.length;
    const overallAvg = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0;
    
    const completedElement = document.getElementById('cognitief-completed');
    const scoreElement = document.getElementById('cognitief-score');
    const levelElement = document.getElementById('cognitief-level');
    
    if (completedElement) completedElement.textContent = totalCompleted;
    if (scoreElement) scoreElement.textContent = overallAvg + '%';
    if (levelElement) {
        if (overallAvg >= 80) levelElement.textContent = 'Expert';
        else if (overallAvg >= 60) levelElement.textContent = 'Gevorderd';
        else levelElement.textContent = 'Beginner';
    }
}

// Retry test
function retryTest() {
    document.getElementById('test-results').style.display = 'none';
    startCognitiveTest(testCategory);
}

// Back to overview
function backToOverview() {
    document.getElementById('test-results').style.display = 'none';
    document.getElementById('test-interface').style.display = 'none';
    document.querySelector('.test-categories').style.display = 'block';
    document.querySelector('.tips-section').style.display = 'block';
    
    // Update progress displays
    updateCognitiveProgress();
}

// Go to dashboard
function goToDashboard() {
    window.location.href = 'index.html';
}

// Start test timer
function startTestTimer() {
    const timerElement = document.getElementById('test-timer');
    
    setInterval(() => {
        if (testStartTime) {
            const elapsed = Math.floor((new Date() - testStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCognitiveProgress();
});