/**
 * Beauty Words Cup 2026 - Master Class Landing Page Logic
 * Contains: Canvas particles, Countdown Timer, Scroll Reveal, Timeline tracker, Points simulator, and WhatsApp Form.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CANVAS GOLD DUST PARTICLES
    // ==========================================================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 20 : 45;

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 1; // Size 1px to 5px
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * -0.5 - 0.1; // Float upwards
                this.opacity = Math.random() * 0.5 + 0.1;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
                this.pulseDir = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset position if particle goes off screen
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }

                // Opacity pulse (shimmer effect)
                this.opacity += this.pulseSpeed * this.pulseDir;
                if (this.opacity > 0.75 || this.opacity < 0.1) {
                    this.pulseDir *= -1;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(223, 186, 115, ${this.opacity})`;
                // Gold glowing shadow effect
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = '#dfba73';
                ctx.fill();
            }
        }

        // Initialize particles
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw background glow
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            gradient.addColorStop(0, '#120f0a');
            gradient.addColorStop(0.8, '#050505');
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 0; // Disable shadow for background fill
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================================================
    // 2. DYNAMIC COUNTDOWN TIMER
    // ==========================================================================
    // Event Date: June 21, 2026 at 9:00 AM
    const targetDate = new Date('June 21, 2026 09:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = '00';
            if (minsEl) minsEl.innerText = '00';
            if (secsEl) secsEl.innerText = '00';
            const label = document.querySelector('.countdown-label');
            if (label) label.innerText = '¡EVENTO EN CURSO O FINALIZADO!';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minsEl) minsEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secsEl) secsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    // Run countdown immediately and then update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-revealHighlight');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: window.innerWidth < 768 ? 0.05 : 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Specific behavior for timeline items
                    if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('active');
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Scroll Header effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 4. TIMELINE PROGRESS FILLER
    // ==========================================================================
    const timeline = document.querySelector('.timeline-container');
    const timelineFill = document.getElementById('timeline-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineScroll() {
        if (!timeline || !timelineFill) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const timelineHeight = timelineRect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate the scroll position relative to the timeline start and end
        // Trigger start when the top of timeline reaches middle of viewport
        const startPoint = windowHeight / 2;
        const currentPos = startPoint - timelineRect.top;
        
        let scrollPercent = (currentPos / timelineHeight) * 100;
        scrollPercent = Math.max(0, Math.min(100, scrollPercent));
        
        timelineFill.style.height = `${scrollPercent}%`;

        // Highlight dots as fill progress passes them
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            // If dot position (item top + offset) is above the viewport scroll threshold, mark active
            if (itemRect.top < startPoint) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateTimelineScroll);
    updateTimelineScroll();

});
