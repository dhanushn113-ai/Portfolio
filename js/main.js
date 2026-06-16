document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER HIDE LOGIC
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 500); // Small delay for visual transitions
    });

    /* ==========================================================================
       2. MOBILE NAVBAR MENU TOGGLE
       ========================================================================== */
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close mobile menu on resize if switching to desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    /* ==========================================================================
       3. STICKY NAVBAR & BACK TO TOP BUTTON
       ========================================================================== */
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Header Class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top opacity toggle
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       4. HERO CANVAS PARTICLE SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let numParticles = 60;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.45)' : 'rgba(139, 92, 246, 0.45)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Dynamically scale particles count with screen width
            numParticles = window.innerWidth < 768 ? 30 : 60;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections first for overlay aesthetics
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    /* ==========================================================================
       5. HERO TYPEWRITER ANIMATION
       ========================================================================== */
    const roleEl = document.getElementById('role-text');
    const roles = [
        'Java Full Stack Developer',
        'Spring Boot Developer',
        'Backend Developer',
        'AI/ML Enthusiast'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;
    let eraseDelay = 50;
    let wordDelay = 2000;

    const typeRoles = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let dynamicSpeed = isDeleting ? eraseDelay : typeDelay;

        if (!isDeleting && charIndex === currentRole.length) {
            dynamicSpeed = wordDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            dynamicSpeed = 500; // Small rest before typing next role
        }

        setTimeout(typeRoles, dynamicSpeed);
    };

    if (roleEl) {
        setTimeout(typeRoles, 800); // Initial delay
    }

    /* ==========================================================================
       6. REVEAL-ON-SCROLL & STICKY NAV ACTIVE INDICATORS
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section[id]');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is a skills tab content, trigger progress bars fill animation
                if (entry.target.id === 'skills') {
                    animateSkillsProgress();
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => scrollObserver.observe(el));

    // Nav active highlights on scroll
    const highlightNavMenu = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (header.offsetHeight + 50);
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavMenu);

    /* ==========================================================================
       7. STATS NUMERICAL COUNTER ANIMATION
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.getAttribute('data-decimal') === 'true';
            const duration = 2000; // ms
            const stepTime = 30; // ms
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            let stepCount = 0;

            const updateCounter = () => {
                current += increment;
                stepCount++;
                
                if (stepCount >= steps) {
                    stat.textContent = isDecimal ? target.toFixed(2) : Math.round(target);
                } else {
                    stat.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
                    setTimeout(updateCounter, stepTime);
                }
            };

            updateCounter();
        });
    };

    // Trigger stats counter on scroll
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       8. SKILLS TAB CONTROLS & PROGRESS BARS
       ========================================================================== */
    const tabs = document.querySelectorAll('.skill-tab');
    const tabContents = document.querySelectorAll('.skills-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tab.classList.add('active');
            const activeContent = document.getElementById(target);
            if (activeContent) {
                activeContent.classList.add('active');
                // Re-trigger progress bar fill anim for the visible tab
                const progressBars = activeContent.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const percent = bar.style.getPropertyValue('--percent') || '0%';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = percent;
                    }, 50);
                });
            }
        });
    });

    const animateSkillsProgress = () => {
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const percent = bar.style.getPropertyValue('--percent');
            bar.style.width = percent;
        });
    };

    /* ==========================================================================
       9. GITHUB API INTEGRATION (LIVE DATA FETCH)
       ========================================================================== */
    const reposGrid = document.getElementById('github-repos-grid');
    const githubUsername = 'dhanushn113-ai';
    
    // Mapping language colors for dynamic cards
    const langColors = {
        Java: '#b07219',
        Python: '#3572A5',
        JavaScript: '#f1e05a',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Flask: '#000000',
        Shell: '#89e051'
    };

    // Static project fallbacks if GitHub rate-limit or API fails
    const staticProjects = [
        {
            name: 'Migraine-Prediction',
            description: 'AI-powered solution forecasting migraine attack onset patterns using environmental triggers & lifestyle tracking.',
            language: 'Python',
            updated_at: '2026-05-15T00:00:00Z',
            html_url: 'https://github.com/dhanushn113-ai'
        },
        {
            name: 'AgroServe-Agriculture',
            description: 'CNN and Random Forest integrated platform for yield prediction, disease diagnostic reports and crop optimization recommendation engine.',
            language: 'Python',
            updated_at: '2026-04-10T00:00:00Z',
            html_url: 'https://github.com/dhanushn113-ai'
        },
        {
            name: 'Employee-Management-System',
            description: 'Enterprise RESTful services built using Java and Spring Boot. Backed by MySQL with secure token authentication schemas.',
            language: 'Java',
            updated_at: '2026-03-22T00:00:00Z',
            html_url: 'https://github.com/dhanushn113-ai'
        }
    ];

    const fetchGitHubRepos = async () => {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
            if (!response.ok) {
                throw new Error('Failed to load live repositories');
            }
            const data = await response.json();
            
            // Clean grid skeleton templates
            reposGrid.innerHTML = '';
            
            if (data.length === 0) {
                renderMockRepos(staticProjects);
                return;
            }

            // Exclude fork repositories & sort by updated date
            const filteredRepos = data
                .filter(repo => !repo.fork)
                .slice(0, 3); // Display top 3 active repos

            if (filteredRepos.length === 0) {
                renderMockRepos(staticProjects);
            } else {
                renderRepos(filteredRepos);
            }
        } catch (error) {
            console.warn('GitHub API Fetch failed. Gracefully falling back to static projects details.', error);
            renderMockRepos(staticProjects);
        }
    };

    const renderRepos = (repos) => {
        reposGrid.innerHTML = '';
        repos.forEach(repo => {
            const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const lang = repo.language || 'Code';
            const dotColor = langColors[lang] || '#ffffff';

            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'github-card glass-card reveal active';
            card.innerHTML = `
                <div class="github-repo-title">
                    <h4>${repo.name}</h4>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
                <p class="github-repo-desc">${repo.description || 'No description provided. Explore files on Dhanush N\'s GitHub repository.'}</p>
                <div class="github-repo-meta">
                    <span class="github-repo-lang">
                        <span class="lang-color-dot" style="background-color: ${dotColor}"></span>
                        ${lang}
                    </span>
                    <span>Updated ${formattedDate}</span>
                </div>
            `;
            reposGrid.appendChild(card);
        });
    };

    const renderMockRepos = (repos) => {
        reposGrid.innerHTML = '';
        repos.forEach(repo => {
            const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const lang = repo.language;
            const dotColor = langColors[lang] || '#ffffff';

            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'github-card glass-card reveal active';
            card.innerHTML = `
                <div class="github-repo-title">
                    <h4>${repo.name}</h4>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
                <p class="github-repo-desc">${repo.description}</p>
                <div class="github-repo-meta">
                    <span class="github-repo-lang">
                        <span class="lang-color-dot" style="background-color: ${dotColor}"></span>
                        ${lang}
                    </span>
                    <span>Updated ${formattedDate}</span>
                </div>
            `;
            reposGrid.appendChild(card);
        });
    };

    // Execute API fetch
    setTimeout(fetchGitHubRepos, 1000); // Trigger after page animations clear

    /* ==========================================================================
       10. CONTACT FORM REAL-TIME VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const fields = {
        name: { input: document.getElementById('form-name'), validator: val => val.trim().length >= 2 },
        email: { input: document.getElementById('form-email'), validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
        subject: { input: document.getElementById('form-subject'), validator: val => val.trim().length >= 5 },
        message: { input: document.getElementById('form-message'), validator: val => val.trim().length >= 10 }
    };
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit');
    const btnText = btnSubmit.querySelector('.btn-text');

    // Attach real-time validation checks
    Object.keys(fields).forEach(key => {
        const fieldObj = fields[key];
        
        ['blur', 'input'].forEach(event => {
            fieldObj.input.addEventListener(event, () => {
                const group = fieldObj.input.closest('.form-group');
                const isValid = fieldObj.validator(fieldObj.input.value);
                
                if (isValid) {
                    group.classList.remove('invalid');
                } else if (event === 'blur') {
                    // Only show red highlight on blur to prevent intrusive initial typing alerts
                    group.classList.add('invalid');
                }
            });
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Force complete evaluation of all fields
        Object.keys(fields).forEach(key => {
            const fieldObj = fields[key];
            const isValid = fieldObj.validator(fieldObj.input.value);
            const group = fieldObj.input.closest('.form-group');
            
            if (!isValid) {
                group.classList.add('invalid');
                isFormValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            submitFormMock();
        } else {
            showFeedback('Please correct the validation errors in the fields above.', 'error');
        }
    });

    const submitFormMock = () => {
        // Toggle spinner/loading text state
        btnSubmit.disabled = true;
        btnText.textContent = 'Sending Message...';
        btnSubmit.querySelector('.btn-icon').className = 'fa-solid fa-spinner fa-spin btn-icon';
        
        // Mock API request delay
        setTimeout(() => {
            // Reset submit button state
            btnSubmit.disabled = false;
            btnText.textContent = 'Send Message';
            btnSubmit.querySelector('.btn-icon').className = 'fa-solid fa-paper-plane btn-icon';
            
            showFeedback('Thank you, Dhanush N will get back to you shortly!', 'success');
            contactForm.reset();
            
            // Clear successful alert after 5 seconds
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);

        }, 1500);
    };

    const showFeedback = (msg, type) => {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback-alert ${type}`;
        formFeedback.style.display = 'block';
    };

});
