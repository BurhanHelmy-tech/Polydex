// Data Models
const polygons = [
    { id: 1, formatId: "#001", name: "Triangle", image: "assets/Triangle_(3_sides)_nobg.png", sides: 3, vertices: 3, diagonals: 0, angles: 180 },
    { id: 2, formatId: "#002", name: "Quadrilateral", image: "assets/Quadrilateral_Square_(4_sides)_nobg.png", sides: 4, vertices: 4, diagonals: 2, angles: 360 },
    { id: 3, formatId: "#003", name: "Pentagon", image: "assets/Pentagon_(5_sides)_nobg.png", sides: 5, vertices: 5, diagonals: 5, angles: 540 },
    { id: 4, formatId: "#004", name: "Hexagon", image: "assets/Hexagon_(6_sides)_nobg.png", sides: 6, vertices: 6, diagonals: 9, angles: 720 },
    { id: 5, formatId: "#005", name: "Heptagon", image: "assets/Septagon_(7_sides)_nobg.png", sides: 7, vertices: 7, diagonals: 14, angles: 900 },
    { id: 6, formatId: "#006", name: "Octagon", image: "assets/Octagon_(8_sides)_nobg.png", sides: 8, vertices: 8, diagonals: 20, angles: 1080 },
    { id: 7, formatId: "#007", name: "Nonagon", image: "assets/Nonagon_(9_sides)_nobg.png", sides: 9, vertices: 9, diagonals: 27, angles: 1260 },
    { id: 8, formatId: "#008", name: "Decagon", image: "assets/Decagon_(10_sides)_nobg.png", sides: 10, vertices: 10, diagonals: 35, angles: 1440 }
];

// DOM Elements
const viewPolydex = document.getElementById('polydex-view');
const viewQuiz = document.getElementById('quiz-view');
const navBtn = document.getElementById('nav-btn');
const cardsGrid = document.getElementById('cards-grid');

// Display Elements
const dispId = document.getElementById('poly-id');
const dispName = document.getElementById('poly-name');
const dispStage = document.getElementById('hologram-stage');
const dispImgWrap = document.getElementById('poly-image-container');
const dispSides = document.getElementById('stat-sides');
const dispVertices = document.getElementById('stat-vertices');
const dispDiagonals = document.getElementById('stat-diagonals');
const dispAngles = document.getElementById('stat-angles');

// State
let currentPolyId = 1;
let inQuizMode = false;
let quizScore = 0;
let currentQuestion = null;
let currentQuestionNumber = 0;
const MAX_QUESTIONS = 5;

// Initialize
function init() {
    document.getElementById('record-count').textContent = polygons.length.toString().padStart(3, '0');
    renderGrid();
    selectPolygon(1);
    
    navBtn.addEventListener('click', toggleView);
}

function renderGrid() {
    cardsGrid.innerHTML = '';
    polygons.forEach(p => {
        const card = document.createElement('div');
        card.className = `poly-card ${p.id === currentPolyId ? 'active' : ''}`;
        card.dataset.id = p.id;
        
        card.innerHTML = `
            <div class="card-image"><img src="${p.image}" alt="${p.name}"></div>
            <div class="card-id-strip"><span class="icon"></span>${p.id.toString().padStart(3, '0')}</div>
        `;
        
        card.addEventListener('click', () => {
            selectPolygon(p.id);
        });
        
        cardsGrid.appendChild(card);
    });
}

function selectPolygon(id) {
    if (currentPolyId === id && dispId.textContent !== '#000') return;
    currentPolyId = id;
    const p = polygons.find(x => x.id === id);
    if (!p) return;
    
    // Update active class in grid
    document.querySelectorAll('.poly-card').forEach(card => {
        card.classList.toggle('active', parseInt(card.dataset.id) === id);
    });
    
    // Animate display container
    dispStage.style.opacity = 0;
    setTimeout(() => {
        dispId.textContent = p.id.toString().padStart(3, '0');
        dispName.textContent = p.name;
        dispSides.textContent = p.sides;
        dispVertices.textContent = p.vertices;
        dispDiagonals.textContent = p.diagonals;
        dispAngles.textContent = `${p.angles}°`;
        dispImgWrap.innerHTML = `<img src="${p.image}" class="poly-image" alt="${p.name}">`;
        
        dispStage.style.opacity = 1;
    }, 150);
}

// Layout / View Switching
function toggleView() {
    inQuizMode = !inQuizMode;
    if (inQuizMode) {
        viewPolydex.classList.add('hidden');
        viewQuiz.classList.remove('hidden');
        navBtn.querySelector('.btn-content').textContent = "RETURN TO POLYDEX";
        
        // Reset Quiz State
        quizScore = 0;
        currentQuestionNumber = 0;
        document.getElementById('score-val').textContent = quizScore;
        document.getElementById('quiz-results').classList.add('hidden');
        document.getElementById('quiz-content').classList.remove('hidden');
        
        startQuizRound();
    } else {
        viewQuiz.classList.add('hidden');
        viewPolydex.classList.remove('hidden');
        navBtn.querySelector('.btn-content').textContent = "TAKE THE QUIZ!";
    }
}

// QUIZ LOGIC
function startQuizRound() {
    currentQuestionNumber++;
    
    if (currentQuestionNumber > MAX_QUESTIONS) {
        showResultsScreen();
        return;
    }
    
    document.getElementById('q-current').textContent = currentQuestionNumber;

    // Hide feedback
    document.getElementById('feedback-area').classList.add('hidden');
    document.getElementById('options-grid').innerHTML = '';
    
    // Generate a question
    const qTypes = ['sides', 'angles', 'diagonals'];
    const type = qTypes[Math.floor(Math.random() * qTypes.length)];
    
    const targetPoly = polygons[Math.floor(Math.random() * polygons.length)];
    
    let questionStr = "";
    let correctAns = "";
    let options = [];
    
    if (type === 'sides') {
        questionStr = `How many sides does a ${targetPoly.name} have?`;
        correctAns = targetPoly.sides.toString();
        options = generateNumericOptions(targetPoly.sides, 4).map(String);
    } else if (type === 'angles') {
        questionStr = `What is the sum of interior angles for a ${targetPoly.name}?`;
        correctAns = `${targetPoly.angles}°`;
        options = generateOptions(polygons.map(p => `${p.angles}°`), correctAns, 4);
    } else if (type === 'diagonals') {
        questionStr = `Which polygon has ${targetPoly.diagonals} diagonals?`;
        correctAns = targetPoly.name;
        // Since many polygons have unique diagonals, we generate numeric options around correct
        options = generateOptions(polygons.map(p => p.name), correctAns, 4);
    }
    
    document.getElementById('question-text').textContent = questionStr;
    
    currentQuestion = {
        correct: correctAns
    };
    
    const optionsGrid = document.getElementById('options-grid');
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleQuizAnswer(opt, btn));
        optionsGrid.appendChild(btn);
    });
}

function handleQuizAnswer(selected, btnElement) {
    if (document.getElementById('feedback-area').classList.contains('hidden') === false) return; // already answered
    
    const fbArea = document.getElementById('feedback-area');
    const fbMsg = document.getElementById('feedback-message');
    const allBtns = document.querySelectorAll('.option-btn');
    
    fbArea.classList.remove('hidden');
    
    if (selected === currentQuestion.correct) {
        btnElement.classList.add('correct');
        fbMsg.textContent = "CORRECT";
        fbMsg.className = "feedback-text success";
        quizScore += 100;
        document.getElementById('score-val').textContent = quizScore;
    } else {
        btnElement.classList.add('wrong');
        fbMsg.textContent = "INCORRECT";
        fbMsg.className = "feedback-text error";
        
        // highlight correct
        allBtns.forEach(b => {
            if (b.textContent === currentQuestion.correct) {
                b.classList.add('correct');
            }
        });
    }
    
    if (currentQuestionNumber === MAX_QUESTIONS) {
        document.getElementById('next-q-btn').querySelector('.btn-content').textContent = "See Results";
    } else {
        document.getElementById('next-q-btn').querySelector('.btn-content').textContent = "Next Question";
    }
}

function showResultsScreen() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('final-score-val').textContent = quizScore;
}

document.getElementById('next-q-btn').addEventListener('click', startQuizRound);
document.getElementById('retry-btn').addEventListener('click', () => {
    quizScore = 0;
    currentQuestionNumber = 0;
    document.getElementById('score-val').textContent = quizScore;
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    startQuizRound();
});
document.getElementById('back-polydex-btn').addEventListener('click', toggleView);

// Utility
function generateOptions(pool, correct, count) {
    let opts = new Set([correct]);
    while(opts.size < count) {
        opts.add(pool[Math.floor(Math.random() * pool.length)]);
    }
    let arr = Array.from(opts);
    return arr.sort(() => Math.random() - 0.5); // shuffle
}

function generateNumericOptions(correct, count) {
    let opts = new Set([correct]);
    while(opts.size < count) {
        // Generate a plausible wrong answer near the correct one (or standard formulas)
        let wrong = Math.max(0, correct + (Math.floor(Math.random() * 10) - 5));
        if (wrong !== correct) opts.add(wrong);
    }
    let arr = Array.from(opts);
    return arr.sort(() => Math.random() - 0.5);
}

// Example of the first two rows in script.js:
const polygons = [
    { id: 1, formatId: "#001", name: "Segi tiga", image: "Assets/Triangle_(3_sides)_nobg.png", sides: 3, vertices: 3, diagonals: 0, angles: 180 },
    { id: 2, formatId: "#002", name: "Sisi empat", image: "Assets/Quadrilateral_Square_(4_sides)_nobg.png", sides: 4, vertices: 4, diagonals: 2, angles: 360 },
    // ... update the rest to "Assets/..." as well!
];
// Start app
init();
