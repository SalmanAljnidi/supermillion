// المتغيرات العامة
let currentLevel = 0;
let correctAnswerIndex = 0;
let isGameActive = false;
let moneyList = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

// الأصوات
const soundIntro = document.getElementById('sound-intro');
const soundWait = document.getElementById('sound-wait');
const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');

// PWA Install
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', () => {
    installBtn.classList.add('hidden');
    deferredPrompt.prompt();
});

function startGame() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    currentLevel = 0;
    
    // تشغيل الموسيقى
    soundIntro.pause();
    soundWait.currentTime = 0;
    soundWait.play();

    loadQuestion();
}

function loadQuestion() {
    isGameActive = true;
    document.getElementById('q-num').innerText = currentLevel + 1;
    document.getElementById('q-prize').innerText = moneyList[currentLevel];
    
    // إعادة تعيين الأزرار
    for(let i=0; i<4; i++) {
        let btn = document.getElementById(`btn${i}`);
        btn.className = 'ans-btn';
        btn.style.visibility = 'visible';
    }

    // --- المنطق الحسابي الجديد (سلمان الجنيدي) ---
    let num1, num2, correctAns, operator;
    
    // 50% ضرب، 50% قسمة
    if (Math.random() > 0.5) {
        // الضرب: الأعداد من 2 إلى 12
        num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
        num2 = Math.floor(Math.random() * 11) + 2; // 2 to 12
        correctAns = num1 * num2;
        operator = '×';
        document.getElementById('question').innerText = `${num2} ${operator} ${num1} = ؟`;
    } else {
        // القسمة: المقسوم عليه (2-12) والناتج (2-12)
        let divisor = Math.floor(Math.random() * 11) + 2;
        let result = Math.floor(Math.random() * 11) + 2;
        
        num2 = divisor; // المقسوم عليه
        num1 = divisor * result; // المقسوم (العدد الكبير)
        correctAns = result;
        operator = '÷';
        document.getElementById('question').innerText = `${num1} ${operator} ${num2} = ؟`;
    }

    // توليد الخيارات
    let answers = new Set();
    answers.add(correctAns);
    
    while(answers.size < 4) {
        let offset = Math.floor(Math.random() * 5) + 1;
        let sign = Math.random() > 0.5 ? 1 : -1;
        let wrong = correctAns + (offset * sign);
        if (wrong > 0 && wrong !== correctAns) answers.add(wrong);
        else answers.add(Math.floor(Math.random() * 100) + 1);
    }
    
    let ansArray = Array.from(answers).sort(() => Math.random() - 0.5);
    
    for(let i=0; i<4; i++) {
        document.getElementById(`opt${i}`).innerText = ansArray[i];
        if (ansArray[i] === correctAns) correctAnswerIndex = i;
    }
}

function checkAnswer(idx) {
    if (!isGameActive) return;
    isGameActive = false;
    soundWait.pause();

    let selectedBtn = document.getElementById(`btn${idx}`);
    selectedBtn.classList.add('selected'); // اللون البرتقالي أولاً

    setTimeout(() => {
        if (idx === correctAnswerIndex) {
            // إجابة صحيحة
            selectedBtn.classList.remove('selected');
            selectedBtn.classList.add('correct');
            soundCorrect.play();
            
            setTimeout(() => {
                if (currentLevel < 14) {
                    currentLevel++;
                    soundWait.play();
                    loadQuestion();
                } else {
                    endGame(true);
                }
            }, 3000);
        } else {
            // إجابة خاطئة
            selectedBtn.classList.remove('selected');
            selectedBtn.classList.add('wrong');
            document.getElementById(`btn${correctAnswerIndex}`).classList.add('correct');
            soundWrong.play();
            
            setTimeout(() => {
                endGame(false);
            }, 3000);
        }
    }, 2000); // انتظار التشويق
}

function endGame(win) {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('end-screen').classList.add('active');
    
    let msg = win ? "أنت عبقري الرياضيات!" : "حظاً أوفر المرة القادمة";
    let prize = 0;
    
    if (win) prize = moneyList[14];
    else {
        // حساب نقاط الأمان
        if (currentLevel >= 10) prize = 32000;
        else if (currentLevel >= 5) prize = 1000;
        else prize = 0;
    }

    document.getElementById('end-msg').innerText = msg;
    document.getElementById('final-money').innerText = prize;
}

// وسائل المساعدة
function use5050() {
    let btn = document.getElementById('btn-50');
    if(btn.disabled) return;
    btn.disabled = true;
    
    let removed = 0;
    let options = [0,1,2,3].filter(i => i !== correctAnswerIndex);
    options.sort(() => Math.random() - 0.5);
    
    document.getElementById(`btn${options[0]}`).style.visibility = 'hidden';
    document.getElementById(`btn${options[1]}`).style.visibility = 'hidden';
}

function useAudience() {
    let btn = document.getElementById('btn-audience');
    if(btn.disabled) return;
    btn.disabled = true;
    alert("الجمهور يصوت للإجابة الصحيحة بنسبة 85%!");
}

function useFriend() {
    let btn = document.getElementById('btn-call');
    if(btn.disabled) return;
    btn.disabled = true;
    let ansText = document.getElementById(`opt${correctAnswerIndex}`).innerText;
    alert(`صديقك المعلم سلمان يقول: أعتقد أن الإجابة هي ${ansText}`);
}
