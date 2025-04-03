// 游戏状态
let currentQuestionIndex = 0;
let health = 100;
let role = null;

// 角色图片配置
const roleImages = {
    kusukaze: {
        normal: 'img/kusukaze.png',
        critical: 'img/kusukaze_critical.png'
    },
    kokome: {
        normal: 'img/kokome.png',
        critical: 'img/kokome_critical.png'
    },
    hikari: {
        normal: 'img/hikari.png',
        critical: 'img/hikari_critical.png'
    }
};

// 常数
const initScore = 180;
const passScore = 100;
const questionNumber = questions.length;
// 基础扣分，错三分之一卡线及格
const basicPoint = (initScore - passScore) / questionNumber * 3;

// 计时器相关变量
let timerInterval;
const timeLimit = 60; // 每题限时60秒
// 音效：时钟滴答声
const tickSound = new Audio('sound/th_timeout.mp3');

// 获取元素
const mainPage = document.getElementById('main-page');
const rolePage = document.getElementById('role-page');
const quizPage = document.getElementById('quiz-page');
const gameOverPage = document.getElementById('game-over-page');
const successPage = document.getElementById('success-page');
const healthValue = document.getElementById('health-value');
const healthBar = document.getElementById('health-bar');
const roleThumbnail = document.getElementById('role-thumbnail');
const successRoleThumbnail = document.getElementById('success-role-thumbnail');
const failureRoleThumbnail = document.getElementById('failure-role-thumbnail');
const questionElement = document.getElementById('question');
const currentQuestionElement = document.getElementById('current-question');
const timeLeftElement = document.getElementById('time-left');
const options = document.querySelectorAll('.option');
const clickSound = document.getElementById('click-sound');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

// 初始化角色缩略图片
function initRoleThumbnail() {
    roleThumbnail.src = roleImages[role].normal;
}

// 技能
function useSkill(damage) {
    if(role == 'kusukaze') { // E = 0.7875
        if(damage > basicPoint) {
            damage = Math.floor(0.9 * basicPoint);
        }
        damage = Math.min(damage,basicPoint);
    }
    else if(role == 'kokome') { // E = 0.8
        damage = basicPoint;
        let randomNumber = Math.random();
        if(randomNumber < 0.1) {
            damage *= 2;
        }
        else if(randomNumber < 0.3) {
            damage *= 1.5
        }
        else if(randomNumber >= 0.8) {
            damage = 0;
        }
        else if(randomNumber >= 0.4) {
            damage /= 2;
        }
    }
    else if(role == 'hikari') { // E = 0.8
        if(Math.random() < 0.2) {
            damage = 0;
        }
    }
    return Math.floor(damage + 0.5);
}

// 更新血量
function updateHealth() {
    let damage = basicPoint;
    let randomNumber = Math.random();
    // E = 1.025
    if(randomNumber < 0.1) {
        damage *= 2;
    }
    else if(randomNumber < 0.3) {
        damage *= 1.5
    }
    else if(randomNumber >= 0.95) {
        damage = 0;
    }
    else if(randomNumber >= 0.7) {
        damage /= 2;
    }
    damage = useSkill(damage);
    health -= damage;
    let healthPercent = (health-passScore) / (initScore-passScore) * 100
    healthValue.textContent = health;
    healthBar.style.width = `${Math.max(0,0.3*healthPercent)}%`;

    // 血量低于20时，血条变为红色，角色图片切换为濒死状态
    if (healthPercent <= 20) {
        healthBar.classList.add('low-health');
        roleThumbnail.src = roleImages[role].critical;
    } else {
        healthBar.classList.remove('low-health');
        roleThumbnail.src = roleImages[role].normal;
    }

    // 血量低于0时，游戏结束
    if (health < passScore) {
        loseSound.play();
    }
}

// 启动计时器
function startTimer() {
    let timeLeft = timeLimit;
    timeLeftElement.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        // 剩余时间小于等于5秒时，样式变红并播放时钟音效
        if (timeLeft <= 5) {
            document.getElementById('timer').classList.add('low-time');
            if (timeLeft > 0) {
                tickSound.play();
            }
        }

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
    updateHealth();

    // 3秒后进入下一题或结束游戏
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length && health >= passScore) {
            loadQuestion();
        } else if (health >= passScore) {
            showSuccessPage();
        }
    }, 3000);
}

// 加载题目
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    currentQuestionElement.textContent = currentQuestionIndex + 1 + ' / ' + questionNumber; // 更新题号
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.classList.remove('correct', 'wrong', 'disabled');
        option.disabled = false; // 启用所有选项
    });

    // 重置计时器样式
    document.getElementById('timer').classList.remove('low-time');

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
        updateHealth();
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
        if (currentQuestionIndex < questions.length && health >= passScore) {
            loadQuestion();
        } else if (health >= passScore) {
            showSuccessPage();
        } else {
            showGameOverPage(); // 血量低于0时，等待3秒后显示游戏结束页面
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
    failureRoleThumbnail.src = roleImages[role].critical;
    gameOverPage.classList.remove('hidden');
    stopTimer();
}

// 显示挑战成功页面
function showSuccessPage() {
    hideAllPages();
    successRoleThumbnail.src = roleImages[role].normal;
    successPage.classList.remove('hidden');
    document.getElementById('final-score').textContent = health;
    stopTimer();
    winSound.play();
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
    health = initScore;
    healthValue.textContent = health;
    healthBar.style.width = '30%';
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
    health = initScore;
    healthValue.textContent = health;
    healthBar.style.width = '100%';
    healthBar.classList.remove('low-health');
}

// 初始化
showMainPage();