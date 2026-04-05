// Confetti Animation
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
        this.speedY += 0.2; // gravity
        this.speedX *= 0.99; // air resistance
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

        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        // Start animation loop
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

        // Update and draw pieces
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

// Initialize confetti manager
const confettiManager = new ConfettiManager('confetti-canvas');

// Celebrate button function
function celebrateBirthday() {
    // Create multiple bursts of confetti
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confettiManager.createConfetti(60);
            playAudio();
        }, i * 200);
    }

    // Add celebration animation
    const button = event.target;
    button.style.animation = 'none';
    setTimeout(() => {
        button.style.animation = 'buttonGlow 2s ease-in-out infinite';
    }, 10);

    // Show celebration message
    showCelebrationMessage();
}

// Simple audio celebration (using Web Audio API)
function playAudio() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        // Create a simple cheerful sound
        const notes = [523, 659, 784]; // C, E, G notes
        
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
        console.log('Audio not available, but confetti is still animated!');
    }
}

// Show celebration message
function showCelebrationMessage() {
    const messages = [
        '🎉 Awesome! Have a blast! 🎉',
        '🎊 Make a wish! 🎊',
        '🌟 You\'re amazing! 🌟',
        '💝 Enjoy every moment! 💝',
        '🎈 Happy Birthday! 🎈'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create floating message
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

// Add animation for floating message
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

// Auto-play confetti on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        confettiManager.createConfetti(40);
    }, 800);
});

// Create ambient confetti throughout the page
setInterval(() => {
    if (Math.random() > 0.7) {
        confettiManager.createConfetti(5);
    }
}, 3000);

// Easter egg: press 'c' for instant confetti
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
        confettiManager.createConfetti(100);
        playAudio();
    }
});

// Touch/click celebratory response on the page
document.addEventListener('click', (e) => {
    if (e.target.id !== 'confetti-canvas' && !e.target.classList.contains('birthday-btn')) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Create small confetti burst at click location
        const piece = new ConfettiPiece(confettiManager.canvas);
        piece.x = x;
        piece.y = y;
        confettiManager.pieces.push(piece);
    }
});
