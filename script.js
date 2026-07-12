/* ==========================================================================
   PARTICLES BACKGROUND SYSTEM (Neural Network Effect)
   ========================================================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 120
};

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Track mouse position
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Clear mouse coordinates when leaving screen
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Particle collision with mouse (push back)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 3;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 3;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 3;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 3;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    
    // Adjust density based on screen size
    let numberOfParticles = (canvas.width * canvas.height) / 14000;
    numberOfParticles = Math.min(numberOfParticles, 85); // Cap to preserve CPU performance

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        // Subtle drift speeds
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Deep space palette colors
        const colors = [
            'rgba(0, 242, 254, 0.4)',  // Cyan
            'rgba(79, 172, 254, 0.4)',  // Blue
            'rgba(127, 0, 255, 0.3)'    // Purple
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect lines between nearby particles (Neural Network structure)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Connect if close enough
            if (distance < 130) {
                opacityValue = 1 - (distance / 130);
                ctx.strokeStyle = `rgba(79, 172, 254, ${opacityValue * 0.12})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Initialize particles system
initParticles();
animateParticles();


/* ==========================================================================
   TYPEWRITER SUBTITLE EFFECT
   ========================================================================== */
const typedTextElement = document.getElementById('typed-text');
const roles = [
    'Artificial Intelligence Systems.',
    'Machine Learning Models.',
    'Data Science Analytics.',
    'Robust Software Solutions.'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        // Erase character
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deleting is faster
    } else {
        // Type character
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at the end of typing
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start Typewriter
setTimeout(typeWriter, 1000);


/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
});

// Close mobile navigation when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
    });
});


/* ==========================================================================
   STICKY NAVBAR & ACTIVE NAV LINK ON SCROLL (SCROLL SPY)
   ========================================================================== */
const header = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Add sticky class on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll spy: highlight current section in navigation
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120; // offset for navbar
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});


/* ==========================================================================
   SKILLS FILTER SYSTEM
   ========================================================================== */
const skillTabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Toggle active tab class
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');

        skillCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                // Trigger quick visual reload effect
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
            }
        });
    });
});


/* ==========================================================================
   INTERSECTION OBSERVER FOR FADE-IN & SKILL PROGRESS BARS
   ========================================================================== */
// Observe skills progress bars for loading animation when viewed
const skillsSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.skill-bar-fill');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            progressBars.forEach(bar => {
                const targetProgress = bar.getAttribute('data-progress');
                bar.style.width = targetProgress;
            });
            skillsObserver.unobserve(entry.target); // Trigger only once
        }
    });
}, { threshold: 0.15 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Observe fade-in animations on scroll
const fadeInElements = document.querySelectorAll('.fade-in');

const scrollFadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollFadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeInElements.forEach(element => {
    scrollFadeObserver.observe(element);
});


/* ==========================================================================
   PROJECT DETAILS MODAL SYSTEM
   ========================================================================== */
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body-content');

// Project Data Details
const projectDetails = {
    'stock-predict': {
        meta: '2023 • AI & Linear/Polynomial Regression',
        title: 'Investigating the Efficiency of Artificial Intelligence in Predicting Stock Prices',
        tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Regression'],
        content: `
            <h4>Project Abstract & Problem Statement</h4>
            <p>Predicting stock market valuations is a classic yet highly complex financial problem due to high volatility and market sentiment. This research project investigates the mathematical performance and accuracy limits of linear regression algorithms when forecasting closing share values using historical datasets.</p>
            
            <div class="metric-highlight">
                <i class="fa-solid fa-square-poll-vertical"></i>
                <span><strong>Key Result:</strong> Successfully evaluated historical trends on TCS and Amazon, reaching a validation score (R² score) of 80% to 85% after optimization.</span>
            </div>

            <h4>Core Methodologies & Architecture</h4>
            <ul>
                <li><strong>Data Mining & Preprocessing:</strong> Gathered and parsed high-volume historical market records (open, high, low, volume, and close metrics). Standardized data ranges and addressed missing records.</li>
                <li><strong>Feature Engineering:</strong> Constructed moving averages, historical variances, and volume indexes as predictors. Applied feature ranking techniques using Scikit-learn to remove redundant variables.</li>
                <li><strong>Model Development:</strong> Implemented and cross-validated multiple regression forms (Linear, Ridge, and Lasso) to fit lines and prevent overfitting.</li>
                <li><strong>Visualization Analysis:</strong> Plotted predictive projections alongside true price values using Matplotlib to demonstrate variance patterns clearly.</li>
            </ul>

            <h4>Key Technical Insights</h4>
            <p>The study demonstrated that while baseline linear models perform highly in steady trend patterns, polynomial enhancements or regularizations are necessary to prevent error accumulation during abrupt market pivots. Feature selection increased prediction speed by 35% without losing predictive precision.</p>
        `
    },
    'car-predict': {
        meta: '2023 • Predictive Analytics & Comparative Evaluation',
        title: 'Comparing Regression Analysis and Market Analysis in Predicting Car Prices',
        tags: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Feature Engineering', 'Market Analysis'],
        content: `
            <h4>Project Abstract & Problem Statement</h4>
            <p>Evaluating secondhand automobile values is a complex multi-factor problem. Traditional appraisal processes are slow and subjective. This project automates valuation by contrasting structured regression modeling directly with general market analysis heuristics.</p>
            
            <div class="metric-highlight">
                <i class="fa-solid fa-gauge-high"></i>
                <span><strong>Key Result:</strong> Modeled a dataset of 5,000+ car listings, improving predictions by 20% compared to baseline pricing models.</span>
            </div>

            <h4>Core Methodologies & Architecture</h4>
            <ul>
                <li><strong>Dataset Extraction:</strong> Cleaned a massive dataset representing 5,000+ individual listings containing attributes such as manufacturer, manufacturing year, mileage, engine volume, fuel type, and transmission.</li>
                <li><strong>Categorical Encoding & Pipeline Construction:</strong> Applied One-Hot Encoding to categorical variables (fuel types, brand classes) and applied robust MinMax scaling to numerical metrics (mileage, engine size).</li>
                <li><strong>Feature Selection Techniques:</strong> Utilized recursive feature elimination (RFE) to identify mileage, fuel efficiency, and vehicle age as the top three predictors of depreciation velocity.</li>
                <li><strong>Model Fitting & Tuning:</strong> Tuned hyper-parameters of Decision Tree Regressors and Ridge Regression to match pricing models against standard vehicle market price charts.</li>
            </ul>

            <h4>Key Technical Insights</h4>
            <p>Integrating feature selection techniques effectively countered multi-collinearity (e.g., between age and mileage). The study confirmed that automated regression pricing reduces human appraisal duration by 95% while keeping errors within a tight ±7% margin relative to market listing rates.</p>
        `
    }
};

function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    // Inject content
    let tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');
    
    modalBody.innerHTML = `
        <div class="modal-header-meta">${data.meta}</div>
        <h3 class="modal-title">${data.title}</h3>
        <div class="modal-tags">${tagsHtml}</div>
        <div class="modal-body">${data.content}</div>
    `;

    // Open Modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
}

function closeProjectModal() {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scrolling
}

// Close modal when clicking outside contents
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Close modal on Escape keypress
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
    }
});


/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    
    // Basic field reads
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    // Show processing animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Sending...';

    // Simulate network latency (1.5 seconds)
    setTimeout(() => {
        // Simulate successful email submission
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        feedback.className = 'form-feedback-message success';
        feedback.innerHTML = `<strong>Success, ${name}!</strong> Your message has been received. Bharath will get back to you shortly.`;
        
        // Reset fields
        form.reset();

        // Fade out message after 5 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
        
    }, 1500);
}

// CSS injection for loader spin
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
        display: inline-block;
    }
`;
document.head.appendChild(style);
