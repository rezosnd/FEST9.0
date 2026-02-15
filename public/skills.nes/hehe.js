function initDuckHunt() {
    if (window.__duckHuntInitialized) return;

    const bird = document.querySelector('.bird');
    const duckhuntBg = document.querySelector('.duckhunt-bg');
    const gameEndBg = document.querySelector('.gameend-bg');
    const gameContainer = document.querySelector('.game-container');
    const wordBox = document.querySelector('.word-box');
    const wordBox2 = document.querySelector('.word-box-2');
    const startButton = document.getElementById('start-button');
    if (!bird || !duckhuntBg || !gameEndBg || !gameContainer || !wordBox || !wordBox2 || !startButton) {
        console.warn('DuckHunt: missing elements, init skipped');
        return;
    }

    // Ensure we only wire handlers once (React StrictMode mounts effects twice in dev)
    window.__duckHuntInitialized = true;
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

    // Retro-styled modal for end-of-round stats
    const modal = document.createElement('div');
    modal.className = 'duck-modal-backdrop hidden';
    modal.innerHTML = `
        <div class="duck-modal-card headingfont">
            <button class="duck-modal-close nes-pointer" id="duck-modal-close" aria-label="Close">×</button>
            <div class="duck-modal-title" id="duck-modal-title">Game Over</div>
            <p class="duck-modal-message" id="duck-modal-message">Nice aim!</p>
            <div class="duck-modal-stats">
                <div class="duck-modal-stat"><span>Score</span><span id="duck-modal-score">0</span></div>
                <div class="duck-modal-stat"><span>Hits</span><span id="duck-modal-hits">0</span></div>
                <div class="duck-modal-stat"><span>Misses</span><span id="duck-modal-misses">0</span></div>
                <div class="duck-modal-stat"><span>Shots</span><span id="duck-modal-shots">0</span></div>
            </div>
            <div class="duck-modal-actions">
                <button class="bulbula medium nes-pointer" id="duck-modal-restart">Play Again</button>
                <div class="duck-share-grid">
                    <button class="bulbula small nes-pointer" data-share="wa">WhatsApp</button>
                    <button class="bulbula small nes-pointer" data-share="ig">Instagram</button>
                    <button class="bulbula small nes-pointer" data-share="li">LinkedIn</button>
                    <button class="bulbula small nes-pointer" data-share="copy">Copy</button>
                </div>
            </div>
            <div class="duck-modal-footnote">Share your score and make this fest more joyful!</div>
        </div>
    `;
    gameContainer.appendChild(modal);

    const modalTitle = modal.querySelector('#duck-modal-title');
    const modalMessage = modal.querySelector('#duck-modal-message');
    const modalScore = modal.querySelector('#duck-modal-score');
    const modalHits = modal.querySelector('#duck-modal-hits');
    const modalMisses = modal.querySelector('#duck-modal-misses');
    const modalShots = modal.querySelector('#duck-modal-shots');
    const modalRestart = modal.querySelector('#duck-modal-restart');
    const modalClose = modal.querySelector('#duck-modal-close');
    const modalShareButtons = modal.querySelectorAll('[data-share]');
    let shareImageCache;
    let shareImagePromise;

    function showModal({ title, message }) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalScore.textContent = score;
        modalHits.textContent = hits;
        modalMisses.textContent = misses;
        modalShots.textContent = shots;
        modal.classList.remove('hidden');
        // Pre-build share image so click handlers remain a user gesture
        shareImagePromise = buildShareImage();
    }

    function hideModal() {
        modal.classList.add('hidden');
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function buildShareImage() {
        if (shareImageCache) return shareImageCache;

        const canvas = document.createElement('canvas');
        const size = 900;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        try {
            const bg = await loadImage('/indexbg/9.0_fest.png');
            ctx.drawImage(bg, 0, 0, size, size);
        } catch (err) {
            // fallback solid background
            ctx.fillStyle = '#0b1021';
            ctx.fillRect(0, 0, size, size);
        }

        // overlay tint for legibility
        const gradient = ctx.createLinearGradient(0, 0, 0, size);
        gradient.addColorStop(0, 'rgba(0,0,0,0.55)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#ffef12';
        ctx.font = 'bold 48px "Press Start 2P", "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('KIITFEST 9.0', size / 2, 120);

        ctx.fillStyle = '#3cfffd';
        ctx.font = '28px "Press Start 2P", "Courier New", monospace';
        ctx.fillText('Duck Hunt Scorecard', size / 2, 190);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px "Press Start 2P", "Courier New", monospace';

        const lines = [
            `Score: ${score}`,
            `Hits: ${hits}`,
            `Misses: ${misses}`,
            `Shots: ${shots}`,
            'Beat my score and make',
            'this fest more joyful!'
        ];

        lines.forEach((line, idx) => {
            ctx.fillText(line, 120, 280 + idx * 60);
        });

        ctx.fillStyle = '#ff3300';
        ctx.fillRect(120, size - 200, size - 240, 100);
        ctx.strokeStyle = '#ffef12';
        ctx.lineWidth = 6;
        ctx.strokeRect(120, size - 200, size - 240, 100);
        ctx.fillStyle = '#ffef12';
        ctx.font = '26px "Press Start 2P", "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('KIITFEST ARCADE OS', size / 2, size - 140);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = blob ? new File([blob], 'kiitfest-score.png', { type: 'image/png' }) : null;
                const dataUrl = canvas.toDataURL('image/png');
                shareImageCache = { blob, file, dataUrl };
                resolve(shareImageCache);
            }, 'image/png');
        });
    }

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

        if (misses >= 3) {
            endGame({ title: 'Mission Failed', message: 'You lost! Share your score and try again.' });
            return;
        }
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
            wordBoxElement.classList.add('word-container', 'bulbula', 'medium', 'word');
            if (wordIndex < words1.length) {
                wordBoxElement.textContent = words1[wordIndex++];
                wordBox.appendChild(wordBoxElement);
            } else {
                wordBoxElement.textContent = words2[wordIndex++ - words1.length];
                wordBox2.appendChild(wordBoxElement);
            }
        } else {
            endGame({ title: 'Run Complete', message: 'Nice aim! Share your score!' });
        }
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
        hideModal();
        resetBird();
        wordIndex = 0;
        wordBox.innerHTML = '';
        wordBox2.innerHTML = '';
        duckhuntBg.classList.remove('hidden');
        gameEndBg.classList.add('hidden');
        startButton.textContent = 'Start Game';
        resetHud();
        isGameRunning = false;
    }

    function endGame({ title, message }) {
        resetBird();
        duckhuntBg.classList.add('hidden');
        gameEndBg.classList.remove('hidden');
        startButton.textContent = 'Restart';
        startButton.classList.remove('hidden');
        isGameRunning = false;
        gameEndSound.play();
        showModal({ title, message });
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
        hideModal();
        resetGame();
        loopSound.pause();
        loopSound.currentTime = 0;
        startButton.classList.add('hidden');
        startBirdMovement();
    });

    modalRestart.addEventListener('click', () => {
        hideModal();
        resetGame();
        startButton.classList.add('hidden');
        startBirdMovement();
    });

    modalClose.addEventListener('click', () => {
        hideModal();
    });

    modalShareButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const shareUrl = (typeof window !== 'undefined' && window.location ? window.location.origin : 'https://kiitfest.example');
            const shareText = `KIIT Fest Duck Hunt — Score: ${score}, Hits: ${hits}, Misses: ${misses}, Shots: ${shots}. Beat my score and make the fest more joyful! Play at ${shareUrl}`;
            const encodedText = encodeURIComponent(`${shareText}`);
            const type = btn.getAttribute('data-share');
            try {
                const shareImg = shareImageCache || (shareImagePromise ? await shareImagePromise : await buildShareImage());

                // Prefer native share with image if supported
                if (shareImg?.file && navigator.canShare && navigator.canShare({ files: [shareImg.file] })) {
                    await navigator.share({ text: shareText, files: [shareImg.file] });
                    return;
                }

                if (type === 'wa') {
                    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
                    return;
                }

                if (type === 'li') {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                    return;
                }

                if (type === 'ig') {
                    window.open(shareImg?.dataUrl || '/indexbg/9.0_fest.png', '_blank');
                    return;
                }

                if (type === 'copy') {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareText);
                    }
                    if (shareImg?.blob && navigator.clipboard && navigator.clipboard.write) {
                        const items = [new ClipboardItem({ 'image/png': shareImg.blob })];
                        await navigator.clipboard.write(items);
                    }
                    return;
                }

                if (navigator.share) {
                    await navigator.share({ text: shareText });
                    return;
                }

                // Fallback: open image in new tab for manual save/share
                if (shareImg?.dataUrl) {
                    window.open(shareImg.dataUrl, '_blank');
                }
            } catch (err) {
                console.warn('Share failed', err);
            }
        });
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuckHunt);
} else {
    initDuckHunt();
}
