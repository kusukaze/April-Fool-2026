// 游戏状态
let currentQuestionIndex = 0;
let health = 100;
let role = null;

// 角色图片配置
const roleImages = {
    warrior: {
        normal: 'warrior.png',
        critical: 'warrior_critical.png'
    },
    mage: {
        normal: 'mage.png',
        critical: 'mage_critical.png'
    },
    archer: {
        normal: 'archer.png',
        critical: 'archer_critical.png'
    }
};

// 计时器相关变量
let timerInterval;
const timeLimit = 30; // 每题限时30秒

// 获取元素
const mainPage = document.getElementById('main-page');
const rolePage = document.getElementById('role-page');
const quizPage = document.getElementById('quiz-page');
const gameOverPage = document.getElementById('game-over-page');
const successPage = document.getElementById('success-page');
const healthValue = document.getElementById('health-value');
const healthBar = document.getElementById('health-bar');
const roleThumbnail = document.getElementById('role-thumbnail');
const questionElement = document.getElementById('question');
const currentQuestionElement = document.getElementById('current-question');
const timeLeftElement = document.getElementById('time-left');
const options = document.querySelectorAll('.option');
const clickSound = document.getElementById('click-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// 初始化角色缩略图片
function initRoleThumbnail() {
    roleThumbnail.src = roleImages[role].normal;
}

// 更新血量
function updateHealth(damage) {
    health -= damage;
    healthValue.textContent = health;
    healthBar.style.width = `${health}%`;

    // 血量低于20时，血条变为红色，角色图片切换为濒死状态
    if (health <= 20) {
        healthBar.classList.add('low-health');
        roleThumbnail.src = roleImages[role].critical;
    } else {
        healthBar.classList.remove('low-health');
        roleThumbnail.src = roleImages[role].normal;
    }

    // 血量低于0时，游戏结束
    if (health <= 0) {
        showGameOverPage();
    }
}

// 启动计时器
function startTimer() {
    let timeLeft = timeLimit;
    timeLeftElement.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        // 超时处理
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// 停止计时器
function stopTimer() {
    clearInterval(timerInterval);
}

// 超时处理
function handleTimeout() {
    // 禁用所有选项
    options.forEach(option => {
        option.disabled = true;
    });

    // 播放答错音效
    wrongSound.play();

    // 扣除血量
    updateHealth(20);

    // 3秒后进入下一题或结束游戏
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && health > 0) {
            loadQuestion();
        } else if (health > 0) {
            showSuccessPage();
        }
    }, 3000);
}

// 加载题目
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    currentQuestionElement.textContent = currentQuestionIndex + 1; // 更新题号
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.classList.remove('correct', 'wrong', 'disabled');
        option.disabled = false; // 启用所有选项
    });

    // 启动计时器
    startTimer();
}

// 处理选项点击
function handleOptionClick(index) {
    // 停止计时器
    stopTimer();

    const question = questions[currentQuestionIndex];

    // 禁用所有选项
    options.forEach(option => {
        option.disabled = true;
    });

    // 判断用户选择是否正确
    if (index === question.answer) {
        options[index].classList.add('correct');
        correctSound.play();
    } else {
        options[index].classList.add('wrong');
        wrongSound.play();
        updateHealth(20);
    }

    // 将其他选项置灰
    options.forEach((option, i) => {
        if (i !== index) {
            option.classList.add('disabled');
        }
    });

    // 3秒后进入下一题或结束游戏
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && health > 0) {
            loadQuestion();
        } else if (health > 0) {
            showSuccessPage();
        }
    }, 3000);
}

// 显示主页面
function showMainPage() {
    hideAllPages();
    mainPage.classList.remove('hidden');
}

// 显示角色选择页面
function showRolePage() {
    hideAllPages();
    rolePage.classList.remove('hidden');
}

// 显示答题页面
function showQuizPage() {
    hideAllPages();
    quizPage.classList.remove('hidden');
    loadQuestion();
}

// 显示游戏结束页面
function showGameOverPage() {
    hideAllPages();
    gameOverPage.classList.remove('hidden');
}

// 显示挑战成功页面
function showSuccessPage() {
    hideAllPages();
    successPage.classList.remove('hidden');
}

// 隐藏所有页面
function hideAllPages() {
    mainPage.classList.add('hidden');
    rolePage.classList.add('hidden');
    quizPage.classList.add('hidden');
    gameOverPage.classList.add('hidden');
    successPage.classList.add('hidden');
}

// 初始化游戏
function initGame() {
    currentQuestionIndex = 0;
    health = 100;
    healthValue.textContent = health;
    healthBar.style.width = '100%';
    healthBar.classList.remove('low-health');
    initRoleThumbnail();
}

// 事件监听
document.getElementById('start-game').addEventListener('click', () => {
    clickSound.play();
    showRolePage();
});

document.querySelectorAll('.role').forEach(roleButton => {
    roleButton.addEventListener('click', () => {
        clickSound.play();
        role = roleButton.dataset.role;
        initGame(); // 初始化游戏状态
        showQuizPage();
    });
});

options.forEach(option => {
    option.addEventListener('click', () => {
        clickSound.play();
        handleOptionClick(parseInt(option.dataset.index));
    });
});

document.getElementById('confirm-end').addEventListener('click', () => {
    clickSound.play();
    resetGame();
    showMainPage();
});

document.getElementById('confirm-success').addEventListener('click', () => {
    clickSound.play();
    resetGame();
    showMainPage();
});

// 重置游戏
function resetGame() {
    currentQuestionIndex = 0;
    health = 100;
    healthValue.textContent = health;
    healthBar.style.width = '100%';
    healthBar.classList.remove('low-health');
}

// 初始化
showMainPage();