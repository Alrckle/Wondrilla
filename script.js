document.addEventListener('DOMContentLoaded', () => {
    // ── Scroll Reveal ──
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Mobile Menu ──
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => navLinks.classList.remove('open'))
        );
    }

    // ── Counter Animation ──
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '+';
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current.toLocaleString() + suffix;
            }, 30);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // ── Donation Widget ──
    const typeBtns = document.querySelectorAll('.type-btn');
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customWrap = document.querySelector('.custom-amount-wrapper');
    const customInput = document.getElementById('custom-amount');
    const summaryAmt = document.querySelector('.summary-amount');
    const impactText = document.getElementById('impact-text');

    let donationType = 'one-time', amount = 25, isCustom = false;

    const impacts = {
        25: '$25 provides 5 Bibles to unreached villages',
        50: '$50 funds a missionary\'s travel for one week',
        100: '$100 helps plant a new church in an unreached region',
    };

    const fmt = v => `$${parseFloat(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    const updateHint = a => {
        if (!impactText) return;
        impactText.textContent = impacts[a] || (a > 0 ? `Your gift of ${fmt(a)} will advance the Gospel worldwide` : 'Every dollar carries the light of Christ further');
    };

    const updateSummary = () => {
        const v = isCustom ? customInput.value || '0' : amount;
        const suffix = donationType === 'monthly' ? ' /mo' : '';
        summaryAmt.textContent = `${fmt(v)}${suffix}`;
        updateHint(isCustom ? parseFloat(customInput.value) : amount);
        const sub = document.getElementById('submit-donation');
        if (sub) sub.textContent = `Complete ${fmt(v)}${suffix} Gift`;
    };

    typeBtns.forEach(b => b.addEventListener('click', () => {
        typeBtns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        donationType = b.dataset.type;
        updateSummary();
    }));

    amountBtns.forEach(b => b.addEventListener('click', () => {
        amountBtns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        if (b.dataset.amount === 'custom') {
            isCustom = true; customWrap.classList.remove('hidden'); customInput.focus();
        } else {
            isCustom = false; customWrap.classList.add('hidden'); amount = parseInt(b.dataset.amount);
        }
        updateSummary();
    }));

    customInput.addEventListener('input', updateSummary);

    // ── Payment Flow ──
    const proceedBtn = document.getElementById('proceed-btn');
    const backBtn = document.getElementById('back-to-amount');
    const paymentForm = document.getElementById('payment-form');
    const headerH2 = document.querySelector('.card-header h2');
    const headerP = document.querySelector('.card-header p');
    const trustBadges = document.querySelector('.card-trust-badges');

    const uiEls = [
        document.querySelector('.donation-type'),
        document.querySelector('.amount-grid'),
        customWrap,
        document.querySelector('.impact-hint'),
        document.querySelector('.donation-summary'),
        proceedBtn
    ];

    proceedBtn.addEventListener('click', () => {
        const a = isCustom ? parseFloat(customInput.value) : amount;
        if (!a || a <= 0) {
            if (isCustom) {
                customInput.style.borderColor = '#ef4444';
                customInput.animate([
                    { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }
                ], { duration: 300 });
            }
            return;
        }
        if (isCustom) customInput.style.borderColor = 'var(--primary)';
        uiEls.forEach(el => { if (el) el.style.display = 'none'; });
        if (trustBadges) trustBadges.style.display = 'none';
        paymentForm.classList.remove('hidden');
        headerH2.textContent = 'Payment Details';
        headerP.textContent = 'Your information is kept safe & secure';
    });

    backBtn.addEventListener('click', () => {
        paymentForm.classList.add('hidden');
        uiEls.forEach(el => { if (el) el.style.display = ''; });
        if (trustBadges) trustBadges.style.display = '';
        if (!isCustom) customWrap.classList.add('hidden');
        headerH2.textContent = 'Partner with Us';
        headerP.textContent = 'Choose an amount to spread the Gospel';
    });

    const donorCard = document.getElementById('donor-card');
    if (donorCard) {
        donorCard.addEventListener('input', function (e) {
            let val = this.value.replace(/\D/g, '');
            let formatted = val.match(/.{1,4}/g);
            this.value = formatted ? formatted.join(' ') : val;
        });
    }

    document.getElementById('submit-donation').addEventListener('click', function () {
        const nameInput = document.getElementById('donor-name');
        const emailInput = document.getElementById('donor-email');
        const cardInput = document.getElementById('donor-card');
        
        const nameError = document.getElementById('error-name');
        const emailError = document.getElementById('error-email');
        const cardError = document.getElementById('error-card');
        
        let isValid = true;

        // Reset errors
        [nameInput, emailInput, cardInput].forEach(el => el.classList.remove('error'));
        [nameError, emailError, cardError].forEach(el => el.classList.add('hidden'));

        // Validate name
        if (!nameInput.value.trim()) {
            nameInput.classList.add('error');
            nameError.classList.remove('hidden');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('error');
            emailError.classList.remove('hidden');
            isValid = false;
        }

        // Validate card
        const cardVal = cardInput.value.replace(/\s+/g, '');
        if (!cardVal || cardVal.length < 15 || !/^\d+$/.test(cardVal)) {
            cardInput.classList.add('error');
            cardError.classList.remove('hidden');
            isValid = false;
        }

        if (!isValid) {
            // Shake the form slightly to indicate error
            paymentForm.animate([
                { transform: 'translateX(0)' }, { transform: 'translateX(-4px)' },
                { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }
            ], { duration: 300 });
            return;
        }

        this.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Processing...';
        lucide.createIcons();
        this.style.opacity = '0.8';
        this.style.pointerEvents = 'none';
        setTimeout(() => {
            const hdr = document.querySelector('.card-header');
            if (hdr) hdr.style.display = 'none';
            paymentForm.innerHTML = `
                <div style="text-align:center;padding:2rem 0;">
                    <div style="width:64px;height:64px;background:rgba(217,119,6,0.1);color:var(--secondary);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;border:2px solid rgba(217,119,6,0.3);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 style="font-family:var(--font-heading);font-size:1.5rem;margin-bottom:0.5rem;color:var(--secondary);">God Bless You!</h3>
                    <p style="color:var(--text-muted);line-height:1.7;max-width:280px;margin:0 auto 0.75rem;font-size:0.92rem;">Your gift has been received. Together, we carry the light of Christ to the ends of the earth.</p>
                    <p style="color:rgba(168,149,107,0.5);font-size:0.78rem;font-style:italic;">"God loves a cheerful giver." — 2 Cor 9:7</p>
                </div>`;
        }, 2000);
    });

    // ── Toasts ──
    const createToast = msg => {
        const c = document.getElementById('toast-container') || (() => {
            const d = document.createElement('div'); d.id = 'toast-container';
            document.body.appendChild(d); return d;
        })();
        const t = document.createElement('div');
        t.className = 'toast glassmorphism';
        t.innerHTML = `<i data-lucide="info"></i><span style="color:white;font-weight:500;">${msg}</span>`;
        c.appendChild(t); lucide.createIcons();
        setTimeout(() => t.classList.add('show'), 10);
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
    };

    document.querySelectorAll('a[href="#"]').forEach(l =>
        l.addEventListener('click', e => { e.preventDefault(); createToast('Coming soon — God bless you! 🙏'); })
    );

    updateHint(amount);

    // Spin animation
    const s = document.createElement('style');
    s.innerHTML = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}';
    document.head.appendChild(s);
});
