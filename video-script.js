// Confetti Animation (same as main page)
class ConfettiPiece {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 5 + 3;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 5 + 3;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 8 - 4;
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', '#ff9a56', '#a8edea', '#ff6ec7', '#ffeaa7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.2;
        this.speedX *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isDead() {
        return this.y > this.canvas.height;
    }
}

class ConfettiManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pieces = [];
        this.isAnimating = false;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        this.animate();
    }

    createConfetti(count = 50) {
        for (let i = 0; i < count; i++) {
            this.pieces.push(new ConfettiPiece(this.canvas));
        }
        this.isAnimating = true;
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.pieces.length - 1; i >= 0; i--) {
            this.pieces[i].update();
            this.pieces[i].draw(this.ctx);

            if (this.pieces[i].isDead()) {
                this.pieces.splice(i, 1);
            }
        }

        requestAnimationFrame(this.animate);
    };
}

// Initialize confetti
const confettiManager = new ConfettiManager('confetti-canvas');

// Navigation functions
function goBack() {
    window.location.href = 'index.html';
}

// Celebrate on video page
function celebrateVideo() {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confettiManager.createConfetti(60);
            playAudio();
        }, i * 200);
    }

    showMessage();
}

// Simple audio celebration
function playAudio() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        const notes = [523, 659, 784];
        
        notes.forEach((frequency, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.frequency.value = frequency;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.3, now + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);

            osc.start(now + index * 0.1);
            osc.stop(now + index * 0.1 + 0.2);
        });
    } catch (e) {
        console.log('Audio not available');
    }
}

// Show celebration message
function showMessage() {
    const messages = [
        '💖 You rock! 💖',
        '🌟 So special! 🌟',
        '🎉 Keep celebrating! 🎉',
        '💝 You deserve it! 💝',
        '✨ Amazing! ✨'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 32px;
        font-weight: bold;
        color: white;
        text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        pointer-events: none;
        animation: floatMessage 2s ease-out forwards;
    `;
    messageEl.textContent = randomMessage;
    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 2000);
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes floatMessage {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Auto confetti on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        confettiManager.createConfetti(30);
    }, 600);
});

// Hide loading spinner when video loads
function hideLoading() {
    const loadingEl = document.querySelector('.video-loading');
    if (loadingEl) {
        loadingEl.style.opacity = '0';
        loadingEl.style.pointerEvents = 'none';
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 300);
    }
}

// Set timeout to hide loading if video takes too long
setTimeout(() => {
    hideLoading();
}, 8000);

// Press 'c' for confetti
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
        confettiManager.createConfetti(100);
        playAudio();
    }
});
