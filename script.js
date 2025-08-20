document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.site-logo[data-logo]').forEach(async (img) => {
        const logoUrl = img.getAttribute('data-logo');
        try {
            const res = await fetch(logoUrl, { method: 'HEAD' });
            if (res.ok) {
                img.src = logoUrl;
            }
        } catch {}
    });
});

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);

// On load, set theme from localStorage or system preference
(function () {
    const saved = localStorage.getItem('theme');
    if (saved) {
        setTheme(saved);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
})();

// --- Section Scroll Reveal Animation ---
const sections = document.querySelectorAll('main section');
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
};
const sectionObserver = new window.IntersectionObserver(revealSection, {
    threshold: 0.15
});
sections.forEach(section => {
    section.style.animationPlayState = 'paused';
    sectionObserver.observe(section);
});

// --- Smooth scroll for in-page nav ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId.length > 1) {
            const el = document.querySelector(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// --- FAQ accordion ---
document.querySelectorAll('.accordion-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const panel = btn.nextElementSibling;
        if (panel) {
            if (expanded) {
                panel.hidden = true;
            } else {
                panel.hidden = false;
            }
        }
    });
});

// --- Back to top ---
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        const show = window.scrollY > 400;
        backToTop.classList.toggle('show', show);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// --- Simple form handlers ---
function handleFormSubmission(form, messageEl, onSubmit) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());
        const hasEmpty = Object.entries(values).some(([k,v]) => {
            if (k === 'phone' || k === 'linkedin') return false;
            return String(v).trim().length === 0;
        });
        if (hasEmpty) {
            messageEl.textContent = 'Please complete all required fields.';
            messageEl.style.color = 'crimson';
            return;
        }
        try {
            messageEl.textContent = 'Sending...';
            messageEl.style.color = 'inherit';
            if (typeof onSubmit === 'function') {
                await onSubmit(values);
            }
            messageEl.textContent = 'Thanks! I will get back to you soon.';
            messageEl.style.color = 'seagreen';
            form.reset();
        } catch (err) {
            messageEl.textContent = (err && err.message) ? err.message : 'Failed to send. Please try again later.';
            messageEl.style.color = 'crimson';
        }
    });
}

const API_BASE = window.location.origin.includes('3000') ? '' : 'http://localhost:3000';
// Normalize presentation links to the Express server if we're not on :3000
document.addEventListener('DOMContentLoaded', () => {
    if (API_BASE) {
        document.querySelectorAll('a[href="/presentations"]').forEach(a => {
            a.setAttribute('href', `${API_BASE}/presentations`);
        });
    }
});

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    handleFormSubmission(newsletterForm, newsletterForm.querySelector('.form-msg'), async (values) => {
        const res = await fetch(`${API_BASE}/api/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: values.email })
        });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !data.ok) {
            throw new Error((data && data.error) ? data.error : 'Subscription failed');
        }
    });
}
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    handleFormSubmission(contactForm, contactForm.querySelector('.form-msg'), async (values) => {
        const res = await fetch(`${API_BASE}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                message: values.message,
                phone: values.phone || '',
                linkedin: values.linkedin || ''
            })
        });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !data.ok) {
            throw new Error((data && data.error) ? data.error : 'Message failed to send');
        }
    });
}

// --- Scroll progress bar ---
const progressBar = document.querySelector('#scroll-progress span');
if (progressBar) {
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
        progressBar.style.width = `${progress * 100}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
}

// --- Magnetic primary buttons effect (light cursor parallax) ---
document.querySelectorAll('.btn.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--mx', `${x}%`);
        btn.style.setProperty('--my', `${y}%`);
    });
});

// --- 3D tilt for cards ---
function attachTiltEffect(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.setAttribute('data-tilt', '');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;
            const dy = (e.clientY - cy) / rect.height;
            const rotateX = (+dy * 10).toFixed(2);
            const rotateY = (-dx * 10).toFixed(2);
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.boxShadow = `${-dx * 12}px ${dy * 12}px 32px rgba(58,122,254,0.18)`;
        });
        ['mouseleave','blur'].forEach(evt => card.addEventListener(evt, () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        }));
    });
}
attachTiltEffect('.resource-card, .project-card, .service-card, .feature-card');

// --- Hero parallax glow ---
const hero = document.querySelector('.hero');
if (hero) {
    const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        hero.style.setProperty('--hero-shift', `${progress * 20}px`);
        const before = hero.querySelector(':scope .orb.o1');
        const before2 = hero.querySelector(':scope .orb.o2');
        if (before) before.style.transform = `translateY(calc(var(--hero-shift,0)))`;
        if (before2) before2.style.transform = `translateY(calc(var(--hero-shift,0) * -1))`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// --- Reveal-on-scroll for cards ---
const revealTargets = document.querySelectorAll('.feature-card, .project-card, .service-card, .testimonial-card');
const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.opacity = '1';
            obs.unobserve(e.target);
        }
    })
}, { threshold: 0.15 });
revealTargets.forEach(el => {
    el.style.transform = 'translateY(16px)';
    el.style.opacity = '0';
    el.style.transition = 'transform 500ms cubic-bezier(.2,.8,.2,1), opacity 500ms';
    revealObs.observe(el);
});

// --- Active nav link on scroll ---
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionsMap = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href');
    const el = document.querySelector(id);
    return { link, el };
}).filter(x => x.el);

const highlightOnScroll = () => {
    let current = null;
    const fromTop = window.scrollY + 120;
    sectionsMap.forEach(({ link, el }) => {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (fromTop >= top && fromTop < bottom) current = link;
    });
    navLinks.forEach(a => a.classList.toggle('active', a === current));
};
window.addEventListener('scroll', highlightOnScroll, { passive: true });
highlightOnScroll();