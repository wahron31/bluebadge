// Taal test JavaScript
let currentLanguageTest = null;
let currentLanguageQuestionIndex = 0;
let languageAnswers = [];
let languageScore = 0;
let languageTestStartTime = null;
let languageTestCategory = '';
let languageWordsLearned = [];

// Taal test data laden
async function loadLanguageData() {
    try {
        const [lezen, luisteren, woorden, grammatica] = await Promise.all([
            fetch('data/taal_lezen.json').then(res => res.json()).catch(() => []),
            fetch('data/taal_luisteren.json').then(res => res.json()).catch(() => []),
            fetch('data/taal_woorden.json').then(res => res.json()).catch(() => []),
            fetch('data/taal_grammatica.json').then(res => res.json()).catch(() => [])
        ]);
        const samples = generateSampleLanguageData();
        const imported = {
            lezen: JSON.parse(localStorage.getItem('import_lezen') || '[]'),
            woorden: JSON.parse(localStorage.getItem('import_woorden') || '[]'),
            grammatica: JSON.parse(localStorage.getItem('import_grammatica') || '[]')
        };
        return {
            lezen: (imported.lezen.length ? imported.lezen : (lezen && lezen.length ? lezen : samples.lezen)),
            luisteren: (luisteren && luisteren.length ? luisteren : samples.luisteren),
            woorden: (imported.woorden.length ? imported.woorden : (woorden && woorden.length ? woorden : samples.woorden)),
            grammatica: (imported.grammatica.length ? imported.grammatica : (grammatica && grammatica.length ? grammatica : samples.grammatica))
        };
    } catch (error) {
        console.error('Error loading language data:', error);
        return generateSampleLanguageData();
    }
}

// Generate sample data if files don't exist
function generateSampleLanguageData() {
    return {
        lezen: [
            {
                type: "lezen",
                passage: "De politie kreeg een melding van een inbraak in een woning aan de Hoofdstraat. Agenten troffen ter plaatse een opengebroken achterdeur aan. Van de woning werd onder andere sieraden en elektronica gestolen. Er zijn nog geen verdachten aangehouden.",
                vraag: "Wat was de toegangsweg van de inbrekers?",
                opties: ["Voordeur", "Achterdeur", "Raam", "Onbekend"],
                antwoord: 1,
                uitleg: "In de tekst staat: 'Agenten troffen ter plaatse een opengebroken achterdeur aan'",
                niveau: "basis"
            }
        ],
        luisteren: [
            {
                type: "luisteren",
                audioText: "Meldkamer naar eenheid 23. Er is een melding van een verkeersongeval op de kruising Kerkstraat-Dorpsweg. Er zijn twee voertuigen betrokken en mogelijk gewonden. Kunt u ter plaatse gaan?",
                vraag: "Waar heeft het ongeval plaatsgevonden?",
                opties: ["Hoofdstraat", "Kerkstraat-Dorpsweg", "Marktplein", "Schoolstraat"],
                antwoord: 1,
                uitleg: "Het ongeval is op de kruising Kerkstraat-Dorpsweg",
                niveau: "basis"
            }
        ],
        woorden: [
            {
                type: "woorden",
                vraag: "Wat betekent 'handhaving'?",
                opties: ["Arrestatie", "Toezicht op naleving", "Onderzoek", "Strafvervolging"],
                antwoord: 1,
                uitleg: "Handhaving betekent het toezien op de naleving van regels en wetten",
                niveau: "gevorderd"
            }
        ],
        grammatica: [
            {
                type: "grammatica",
                vraag: "Welke zin is grammaticaal correct?",
                opties: ["Hij word morgen verhoord", "Hij wordt morgen verhoord", "Hij werd morgen verhoord", "Hij worden morgen verhoord"],
                antwoord: 1,
                uitleg: "'Hij wordt' is de correcte vorm (dt-regel)",
                niveau: "basis"
            }
        ]
    };
}

// Start language test
async function startLanguageTest(category) {
    const data = await loadLanguageData();
    
    // Reset test state
    currentLanguageQuestionIndex = 0;
    languageAnswers = [];
    languageScore = 0;
    languageTestCategory = category;
    languageTestStartTime = new Date();
    languageWordsLearned = [];

    // Get questions for category
    currentLanguageTest = shuffleArray(data[category] || []).slice(0, 10);
    
    if (currentLanguageTest.length === 0) {
        alert('Geen vragen beschikbaar voor deze categorie.');
        return;
    }

    // Hide overview and show test interface
    document.querySelector('.language-categories').style.display = 'none';
    document.querySelector('.word-learning').style.display = 'none';
    document.querySelector('.language-tips').style.display = 'none';
    document.getElementById('language-test-interface').style.display = 'block';
    
    // Update test title
    const titles = {
        lezen: 'Begrijpend Lezen Test',
        luisteren: 'Luistervaardigheid Test',
        woorden: 'Woordenschat Test',
        grammatica: 'Grammatica Test'
    };
    document.getElementById('language-test-title').textContent = titles[category] || 'Taaltest';
    
    // Start first question
    showLanguageQuestion();
    startLanguageTestTimer();
}

// Show current question
function showLanguageQuestion() {
    const question = currentLanguageTest[currentLanguageQuestionIndex];
    const questionContainer = document.getElementById('lang-current-question');
    const optionsContainer = document.getElementById('lang-question-options');
    const counter = document.getElementById('lang-question-counter');
    const progressFill = document.getElementById('lang-test-progress-fill');
    const passageContainer = document.getElementById('reading-passage');
    const audioContainer = document.getElementById('audio-player');

    // Update question counter and progress
    counter.textContent = `Vraag ${currentLanguageQuestionIndex + 1} van ${currentLanguageTest.length}`;
    const progressPercent = ((currentLanguageQuestionIndex + 1) / currentLanguageTest.length) * 100;
    progressFill.style.width = progressPercent + '%';

    // Handle reading passage
    if (question.type === 'lezen' && question.passage) {
        passageContainer.style.display = 'block';
        passageContainer.innerHTML = `
            <div class="passage-content">
                <h4>Lees de volgende tekst:</h4>
                <div class="passage-text">${question.passage}</div>
            </div>
        `;
    } else {
        passageContainer.style.display = 'none';
    }

    // Handle audio for listening comprehension
    if (question.type === 'luisteren' && question.audioText) {
        audioContainer.style.display = 'block';
        audioContainer.innerHTML = `
            <div class="audio-content">
                <h4>Luister naar het volgende fragment:</h4>
                <div class="audio-text">${question.audioText}</div>
                <button class="audio-btn" onclick="readAudioText('${question.audioText}')">🔊 Beluister fragment</button>
                <p class="audio-note"><em>In een echte test zou dit een audio-opname zijn. Voor deze demo tonen we de tekst.</em></p>
            </div>
        `;
    } else {
        audioContainer.style.display = 'none';
    }

    // Display question
    questionContainer.innerHTML = `
        <h4>Vraag ${currentLanguageQuestionIndex + 1}</h4>
        <p>${question.vraag}</p>
    `;

    // Display options
    optionsContainer.innerHTML = '';
    question.opties.forEach((optie, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = optie;
        button.onclick = () => selectLanguageAnswer(index);
        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    updateLanguageNavButtons();
}

// Read audio text (text-to-speech simulation)
function readAudioText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech wordt niet ondersteund in deze browser.');
    }
}

// Select answer for language test
function selectLanguageAnswer(selectedIndex) {
    // Remove previous selection
    document.querySelectorAll('#lang-question-options .option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected
    document.querySelectorAll('#lang-question-options .option-btn')[selectedIndex].classList.add('selected');
    
    // Store answer
    languageAnswers[currentLanguageQuestionIndex] = selectedIndex;
    
    // Enable next button
    document.getElementById('lang-next-btn').disabled = false;
}

// Navigate to next language question
function nextLanguageQuestion() {
    if (currentLanguageQuestionIndex < currentLanguageTest.length - 1) {
        currentLanguageQuestionIndex++;
        showLanguageQuestion();
    } else {
        document.getElementById('lang-next-btn').style.display = 'none';
        document.getElementById('lang-finish-btn').style.display = 'block';
    }
}

// Navigate to previous language question
function previousLanguageQuestion() {
    if (currentLanguageQuestionIndex > 0) {
        currentLanguageQuestionIndex--;
        showLanguageQuestion();
    }
}

// Update language navigation buttons
function updateLanguageNavButtons() {
    const prevBtn = document.getElementById('lang-prev-btn');
    const nextBtn = document.getElementById('lang-next-btn');
    const finishBtn = document.getElementById('lang-finish-btn');
    const endBtn = document.getElementById('lang-end-global-btn');
    
    prevBtn.disabled = currentLanguageQuestionIndex === 0;
    nextBtn.disabled = languageAnswers[currentLanguageQuestionIndex] === undefined;
    
    const onLast = currentLanguageQuestionIndex === currentLanguageTest.length - 1;
    if (onLast) {
        nextBtn.style.display = 'none';
        const canFinish = languageAnswers[currentLanguageQuestionIndex] !== undefined;
        finishBtn.style.display = canFinish ? 'block' : 'none';
        endBtn.style.display = canFinish ? 'block' : 'none';
    } else {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
        endBtn.style.display = 'none';
    }
}

function endGlobalLanguageResults() {
    finishLanguageTest();
    window.location.href = 'resultaten.html';
}

// Finish language test
function finishLanguageTest() {
    // Calculate score
    languageScore = 0;
    const results = [];
    
    currentLanguageTest.forEach((question, index) => {
        const userAnswer = languageAnswers[index];
        const correct = userAnswer === question.antwoord;
        if (correct) languageScore++;
        
        results.push({
            vraag: question.vraag,
            opties: question.opties,
            userIndex: userAnswer,
            correctIndex: question.antwoord,
            correct: correct,
            uitleg: question.uitleg || ''
        });
    });
    
    // Persist summary for global results page
    try {
        const payload = {
            type: 'taal',
            category: languageTestCategory,
            score: languageScore,
            total: currentLanguageTest.length,
            percentage: Math.round((languageScore / currentLanguageTest.length) * 100),
            questions: results
        };
        localStorage.setItem('lastQuizResult', JSON.stringify(payload));
    } catch (e) {}
    
    // Hide test interface and show results
    document.getElementById('language-test-interface').style.display = 'none';
    document.getElementById('language-test-results').style.display = 'block';
    
    showLanguageResults(results);
    saveLanguageResults();
}

// Show language test results
function showLanguageResults(results) {
    const finalScore = document.getElementById('lang-final-score');
    const percentageScore = document.getElementById('lang-percentage-score');
    const performanceRating = document.getElementById('lang-performance-rating');
    const newVocabulary = document.getElementById('new-vocabulary');

    const percentage = Math.round((languageScore / currentLanguageTest.length) * 100);
    
    finalScore.textContent = languageScore;
    percentageScore.textContent = percentage + '%';
    
    // Performance rating
    if (percentage >= 80) {
        performanceRating.textContent = 'Uitstekend taalgevoel!';
        performanceRating.className = 'performance-rating excellent';
    } else if (percentage >= 60) {
        performanceRating.textContent = 'Goed bezig!';
        performanceRating.className = 'performance-rating good';
    } else {
        performanceRating.textContent = 'Blijf oefenen met Nederlands!';
        performanceRating.className = 'performance-rating needs-improvement';
    }
    
    // Show new vocabulary learned
    if (languageWordsLearned.length > 0) {
        newVocabulary.innerHTML = languageWordsLearned.map(word => 
            `<div class="vocab-item">
                <strong>${word.word}</strong><br>
                <span>${word.meaning}</span>
            </div>`
        ).join('');
    } else {
        newVocabulary.innerHTML = '<p>Alle woorden correct! Geen nieuwe woorden om te leren.</p>';
    }
}

// Save language results
function saveLanguageResults() {
    const testTime = Math.round((new Date() - languageTestStartTime) / 1000);
    const percentage = Math.round((languageScore / currentLanguageTest.length) * 100);
    
    const result = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('nl-NL'),
        category: languageTestCategory,
        score: languageScore,
        total: currentLanguageTest.length,
        percentage: percentage,
        duration: testTime,
        wordsLearned: languageWordsLearned.length
    };
    
    // Save to language results
    let languageResults = JSON.parse(localStorage.getItem('languageResults') || '[]');
    languageResults.unshift(result);
    languageResults = languageResults.slice(0, 100); // Keep last 100 results
    localStorage.setItem('languageResults', JSON.stringify(languageResults));
    
    // Save new vocabulary
    let vocabulary = JSON.parse(localStorage.getItem('learnedVocabulary') || '[]');
    languageWordsLearned.forEach(word => {
        if (!vocabulary.find(v => v.word === word.word)) {
            vocabulary.push({
                ...word,
                dateAdded: new Date().toISOString().split('T')[0]
            });
        }
    });
    localStorage.setItem('learnedVocabulary', JSON.stringify(vocabulary));
    
    // Update progress
    updateLanguageProgress();
    
    // Update activity log
    addToActivityHistory('taal', `${languageTestCategory} test`, languageScore, currentLanguageTest.length);
}

// Update language progress
function updateLanguageProgress() {
    const results = JSON.parse(localStorage.getItem('languageResults') || '[]');
    
    ['lezen', 'luisteren', 'woorden', 'grammatica'].forEach(category => {
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
    const vocabulary = JSON.parse(localStorage.getItem('learnedVocabulary') || '[]');
    
    const completedElement = document.getElementById('taal-completed');
    const scoreElement = document.getElementById('taal-score');
    const wordsElement = document.getElementById('words-learned');
    
    if (completedElement) completedElement.textContent = totalCompleted;
    if (scoreElement) scoreElement.textContent = overallAvg + '%';
    if (wordsElement) wordsElement.textContent = vocabulary.length;
}

// Retry language test
function retryLanguageTest() {
    document.getElementById('language-test-results').style.display = 'none';
    startLanguageTest(languageTestCategory);
}

// Back to language overview
function backToLanguageOverview() {
    document.getElementById('language-test-results').style.display = 'none';
    document.getElementById('language-test-interface').style.display = 'none';
    document.querySelector('.language-categories').style.display = 'block';
    document.querySelector('.word-learning').style.display = 'block';
    document.querySelector('.language-tips').style.display = 'block';
    
    // Update progress displays
    updateLanguageProgress();
}

// Word learning functions
let currentWordIndex = 0;
let dailyWords = [];

// Load daily words
async function loadDailyWords() {
    try {
        const response = await fetch('data/woorden.json');
        const words = await response.json();
        return words;
    } catch (error) {
        console.error('Error loading words:', error);
        return [];
    }
}

// Initialize daily word
async function initializeDailyWord() {
    const words = await loadDailyWords();
    if (words.length > 0) {
        dailyWords = shuffleArray(words);
        currentWordIndex = 0;
        showCurrentWord();
    }
}

// Show current word
function showCurrentWord() {
    if (dailyWords.length === 0) return;
    
    const word = dailyWords[currentWordIndex];
    
    document.getElementById('current-word').textContent = word.woord;
    document.getElementById('word-difficulty').textContent = word.niveau;
    document.getElementById('word-meaning').textContent = word.betekenis;
    document.getElementById('word-example').textContent = `"${word.voorbeeld}"`;
    document.getElementById('word-type').textContent = word.type;
    document.getElementById('word-origin').textContent = 'Politie terminologie';
    
    // Update difficulty badge color
    const badge = document.getElementById('word-difficulty');
    badge.className = 'difficulty-badge';
    if (word.niveau === 'expert') {
        badge.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
        badge.style.color = 'white';
    } else if (word.niveau === 'gevorderd') {
        badge.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
        badge.style.color = '#1a1a1a';
    } else {
        badge.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
        badge.style.color = 'white';
    }
}

// Mark word as known
function markWordKnown() {
    const word = dailyWords[currentWordIndex];
    let knownWords = JSON.parse(localStorage.getItem('knownWords') || '[]');
    
    if (!knownWords.find(w => w.woord === word.woord)) {
        knownWords.push({
            ...word,
            dateKnown: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('knownWords', JSON.stringify(knownWords));
        updateWordStats();
    }
    
    nextWord();
}

// Study word (mark for further study)
function studyWord() {
    const word = dailyWords[currentWordIndex];
    let studyWords = JSON.parse(localStorage.getItem('studyWords') || '[]');
    
    if (!studyWords.find(w => w.woord === word.woord)) {
        studyWords.push({
            ...word,
            dateAdded: new Date().toISOString().split('T')[0],
            studyCount: 1
        });
        localStorage.setItem('studyWords', JSON.stringify(studyWords));
    }
    
    nextWord();
}

// Next word
function nextWord() {
    currentWordIndex = (currentWordIndex + 1) % dailyWords.length;
    showCurrentWord();
    updateWordStats();
}

// Update word statistics
function updateWordStats() {
    const knownWords = JSON.parse(localStorage.getItem('knownWords') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const wordsToday = knownWords.filter(w => w.dateKnown === today).length;
    const wordsThisWeek = knownWords.filter(w => new Date(w.dateKnown) >= thisWeek).length;
    const totalWords = knownWords.length;
    
    document.getElementById('words-today').textContent = wordsToday;
    document.getElementById('words-week').textContent = wordsThisWeek;
    document.getElementById('words-total').textContent = totalWords;
}

// Start language test timer
function startLanguageTestTimer() {
    const timerElement = document.getElementById('lang-test-timer');
    
    setInterval(() => {
        if (languageTestStartTime) {
            const elapsed = Math.floor((new Date() - languageTestStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Initialize language page
document.addEventListener('DOMContentLoaded', function() {
    updateLanguageProgress();
    initializeDailyWord();
    updateWordStats();

    const rules = [
        'Werkwoordspelling: stam, tegenwoordige/verleden tijd, voltooid deelwoord',
        'd/t-regel: jij/hij/zij-vormen, gebiedende wijs',
        'De/Het: geslacht van zelfstandige naamwoorden, verkleinwoorden',
        'Meervouden: -en/-s, uitzonderingen',
        'Voorzetsels: vaste combinaties (rekening houden met, afhankelijk van)',
        'Woordvolgorde: bijzin-hoofdzin, inversie, plaats van niet/geen',
        'Naamvallen in uitdrukkingen: ter plaatse, in het belang van',
        'Voornaamwoorden: persoonlijk, bezittelijk, wederkerend',
        'Vergelijkingen: stellende, vergrotende, overtreffende trap',
        'Zinsontleding: onderwerp, gezegde, lijdend/meewerkend voorwerp',
        'Tijdsbepalingen en volgorde: toen/wanneer, voordat/nadat',
        'Samentrekkingen en congruentie: onderwerp-werkwoord',
        'Leestekens: komma’s, dubbele punt, puntkomma, aanhalingstekens',
        'Samenstellingen en koppelteken: streepjesregels',
        'Modaliteit: kunnen, moeten, mogen, willen',
        'Passieve vorm: worden/zijn + voltooid deelwoord'
    ];
    const container = document.getElementById('grammar-rules-container');
    if (container) {
        container.innerHTML = rules.map(r => `<div class="overview-card" style="padding:1rem;">${r}</div>`).join('');
    }
});

window.handleImportFile = function(evt, kind) {
    const file = evt.target.files && evt.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            if (file.type === 'text/csv') {
                // very simple CSV -> array parser (expects vraag;optie1;optie2;optie3;optie4;antwoordIndex;uitleg)
                const lines = reader.result.split(/\r?\n/).filter(Boolean);
                const parsed = lines.map(line => {
                    const parts = line.split(';');
                    return {
                        type: kind,
                        vraag: parts[0],
                        opties: parts.slice(1,5),
                        antwoord: parseInt(parts[5], 10) || 0,
                        uitleg: parts[6] || ''
                    };
                });
                localStorage.setItem('import_'+kind, JSON.stringify(parsed));
                alert('Geïmporteerd: '+parsed.length+' items ('+kind+')');
            } else {
                const json = JSON.parse(reader.result);
                localStorage.setItem('import_'+kind, JSON.stringify(json));
                alert('Geïmporteerd: '+(Array.isArray(json) ? json.length : 1)+' items ('+kind+')');
            }
        } catch (e) {
            alert('Bestand kon niet worden gelezen: '+e.message);
        }
    };
    reader.readAsText(file);
};