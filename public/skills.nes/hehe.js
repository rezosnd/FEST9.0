document.addEventListener('DOMContentLoaded', () => {
    const bird = document.querySelector('.bird');
    const duckhuntBg = document.querySelector('.duckhunt-bg');
    const gameEndBg = document.querySelector('.gameend-bg');
    const gameContainer = document.querySelector('.game-container');
    const wordBox = document.querySelector('.word-box');
    const wordBox2 = document.querySelector('.word-box-2');
    const startButton = document.getElementById('start-button');
    const skipButton = document.getElementById('skip-button');
    const loopSound = document.getElementById('loop-sound');
    const clickSound = document.getElementById('click-sound');
    const duckInit = document.getElementById('duckinit-sound');
    const flySound = document.getElementById('fly-sound');
    const shotSound = document.getElementById('shot-sound');
    const fallSound = document.getElementById('fall-sound');
    const gameEndSound = document.getElementById('game-end-sound');
    let moveInterval;
    let wordIndex = 0;
    let score = 0;
    let hits = 0;
    let misses = 0;
    let shots = 0;
    let isGameRunning = false;
    const scoreEl = document.getElementById('score-value');
    const hitsEl = document.getElementById('hits-value');
    const missesEl = document.getElementById('misses-value');
    const shotsEl = document.getElementById('shots-value');
    const words1 = ['Hackathons', 'Workshops', 'Gaming', 'Cultural', 'Proshows', 'Food Arena', 'Treasure Hunt', 'Robotics'];
    const words2 = ['Tech Arena', 'Gaming Arena', 'Cultural Arena', 'Night Shows', 'Workshops', 'Startup Expo', 'Creator Zone'];
    const defaultBirdImage = 'skills.nes/flyduck.gif';
    const shotBirdImage = 'skills.nes/shotduck.png';
    const deadBirdImage = 'skills.nes/deadduck.gif';

    function updateHud() {
        if (scoreEl) scoreEl.textContent = score;
        if (hitsEl) hitsEl.textContent = hits;
        if (missesEl) missesEl.textContent = misses;
        if (shotsEl) shotsEl.textContent = shots;
    }

    function resetHud() {
        score = 0;
        hits = 0;
        misses = 0;
        shots = 0;
        updateHud();
    }

    function registerShot({ hit }) {
        shots += 1;
        if (hit) {
            hits += 1;
            score += 100;
        } else {
            misses += 1;
            score = Math.max(0, score - 25);
        }
        updateHud();
    }

    function getRandomYPosition() {
        const bgRect = duckhuntBg.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();
        const skyHeight = bgRect.height * 0.6;
        const maxY = skyHeight - birdRect.height;
        const y = Math.random() * maxY;
        return y;
    }

    function startBirdMovement() {
        isGameRunning = true;
        flySound.play();

        const gameContainerRect = gameContainer.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();

        const maxX = gameContainerRect.width - birdRect.width;
        const maxY = gameContainerRect.height / 2;

        const birdX = 0;
        const birdY = Math.random() * maxY;

        bird.style.left = `${birdX}px`;
        bird.style.top = `${birdY}px`;

        bird.classList.remove('hidden');

        moveInterval = setInterval(() => {
            const currentX = parseFloat(bird.style.left) || 0;
            bird.style.left = `${currentX + 5}px`;

            if (parseFloat(bird.style.left) > maxX) {
                registerShot({ hit: false });
                bird.style.left = `-${birdRect.width}px`;
                bird.style.top = `${Math.random() * maxY}px`;
            }
        }, 50);
    }

    function resetBird() {
        clearInterval(moveInterval);
        isGameRunning = false;
        bird.classList.add('hidden');
        flySound.pause();
        flySound.currentTime = 0;
    }

    function displayNextWord() {
        if (wordIndex < words1.length + words2.length) {
            const wordBoxElement = document.createElement('div');
            skipButton.classList.add("hidden")
            wordBoxElement.classList.add('word-container', 'bulbula', 'medium', 'word');
            if (wordIndex < words1.length) {
                wordBoxElement.textContent = words1[wordIndex++];
                wordBox.appendChild(wordBoxElement);
            } else {
                wordBoxElement.textContent = words2[wordIndex++ - words1.length];
                wordBox2.appendChild(wordBoxElement);
            }
        } else {
            resetBird();
            duckhuntBg.classList.add('hidden');
            gameEndBg.classList.remove('hidden');
            startButton.textContent = 'Restart';
            startButton.classList.remove('hidden');
            skipButton.classList.add('hidden');
            isGameRunning = false;
            gameEndSound.play();
        }
    }

    function displayAllWords() {
        wordBox.innerHTML = '';
        wordBox2.innerHTML = '';

        words1.forEach(word => {
            const wordBoxElement = document.createElement('div');
            wordBoxElement.classList.add('word-container', 'bulbula', 'medium', 'word');
            wordBoxElement.textContent = word;
            wordBox.appendChild(wordBoxElement);
        });

        words2.forEach(word => {
            const wordBoxElement = document.createElement('div');
            wordBoxElement.classList.add('word-container', 'bulbula', 'medium', 'word');
            wordBoxElement.textContent = word;
            wordBox2.appendChild(wordBoxElement);
        });

        resetBird();
        duckhuntBg.classList.add('hidden');
        startButton.textContent = 'Restart';
        startButton.classList.remove('hidden');
        gameEndBg.classList.remove('hidden');
        skipButton.classList.add('hidden');
        isGameRunning = false;
        gameEndSound.play();
    }


    function birdShot() {
        clearInterval(moveInterval);
        flySound.pause();

        bird.src = shotBirdImage;
        shotSound.play();

        setTimeout(() => {
            bird.src = deadBirdImage;
            bird.classList.add('fall');
            const gameContainerRect = gameContainer.getBoundingClientRect();
            const birdRect = bird.getBoundingClientRect();
            const distanceToBottom = gameContainerRect.bottom - birdRect.bottom;
            bird.style.transform = `translateY(${distanceToBottom}px)`;
            fallSound.play();

            setTimeout(() => {
                bird.classList.remove('fall');
                bird.style.transform = 'none';
                bird.src = defaultBirdImage;
                displayNextWord();
                if (wordIndex < words1.length + words2.length) {
                    startBirdMovement();
                }
            }, 1400);
        }, 1000);
    }

    function resetGame() {
        resetBird();
        wordIndex = 0;
        wordBox.innerHTML = '';
        wordBox2.innerHTML = '';
        duckhuntBg.classList.remove('hidden');
        gameEndBg.classList.add('hidden');
        startButton.textContent = 'Start Game';
        skipButton.classList.remove('hidden');
        resetHud();
    }

    bird.addEventListener('click', (e) => {
        if (!isGameRunning) return;
        e.stopPropagation();
        registerShot({ hit: true });
        birdShot();
    });

    duckhuntBg.addEventListener('click', () => {
        if (!isGameRunning) return;
        registerShot({ hit: false });
        clickSound.play();
    });

    startButton.addEventListener('click', () => {
        loopSound.pause();
        loopSound.currentTime = 0;
        resetGame();
        startButton.classList.add('hidden');
        startBirdMovement();
    });

    skipButton.addEventListener('click', () => {
        displayAllWords();
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loopSound.play();
            } else {
                loopSound.pause();
                loopSound.currentTime = 0;
            }
        });
    });

    observer.observe(gameContainer);

    // initialize HUD on load
    updateHud();
});
