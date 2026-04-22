(function() {
    function initApp() {
        document.documentElement.classList.add('animations-ready');
        // ── Scroll Reveal ──
        const revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((e, i) => {
                    if (e.isIntersecting || e.intersectionRatio > 0) {
                        setTimeout(() => e.target.classList.add('visible'), i * 80);
                        revealObserver.unobserve(e.target);
                    }
                });
            }, { rootMargin: '50px 0px 0px 0px', threshold: 0 }); 
            revealEls.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback for older browsers
            revealEls.forEach(el => el.classList.add('visible'));
        }

        // ── Navbar Scroll Effect ──
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
            });
        }

        // ── Mobile Menu ──
        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
            navLinks.querySelectorAll('a').forEach(a =>
                a.addEventListener('click', () => navLinks.classList.remove('open'))
            );
        }

        // ── Counter Animation ──
        const counters = document.querySelectorAll('[data-count]');
        if ('IntersectionObserver' in window && counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const suffix = el.dataset.suffix || '+';
                    let count = 0;
                    const update = () => {
                        const inc = target / 30;
                        if (count < target) {
                            count += inc;
                            el.innerText = Math.ceil(count) + suffix;
                            requestAnimationFrame(update);
                        } else {
                            el.innerText = target + suffix;
                        }
                    };
                    update();
                    counterObserver.unobserve(el);
                });
            }, { threshold: 0 });
            counters.forEach(c => counterObserver.observe(c));
        }

        // ── Amount Selection ──
        const amountBtns = document.querySelectorAll('.amount-btn');
        const typeBtns = document.querySelectorAll('.type-btn');
        const customWrap = document.querySelector('.custom-amount-wrapper');
        const customInput = document.getElementById('custom-amount');
        const summaryAmt = document.querySelector('.summary-amount');
        const hintText = document.querySelector('.impact-hint-text');
        
        let donationType = 'one-time', amount = 25, isCustom = false;

        const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

        const updateHint = a => {
            if (!hintText || !summaryAmt) return;
            if (!a || a <= 0) { summaryAmt.parentElement.style.opacity = '0'; return; }
            summaryAmt.parentElement.style.opacity = '1';
            if (a < 25) hintText.textContent = "Every seed planted helps spread the Gospel.";
            else if (a < 50) hintText.textContent = "Provides Bibles to a village in need.";
            else if (a < 100) hintText.textContent = "Supports a missionary for a week.";
            else if (a < 500) hintText.textContent = "Helps fund a new church plant.";
            else hintText.textContent = "Equips leaders for regional evangelism.";
        };

        const updateSummary = () => {
            if (!summaryAmt) return;
            const v = isCustom ? (customInput && customInput.value ? parseFloat(customInput.value) : 0) : amount;
            const suffix = donationType === 'monthly' ? ' /mo' : '';
            summaryAmt.textContent = `${fmt(v)}${suffix}`;
            updateHint(v);
            const sub = document.getElementById('submit-donation');
            if (sub) sub.textContent = `Complete ${fmt(v)}${suffix} Gift`;
        };

        if (typeBtns.length > 0) {
            typeBtns.forEach(b => b.addEventListener('click', () => {
                typeBtns.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                donationType = b.dataset.type;
                updateSummary();
            }));
        }

        if (amountBtns.length > 0) {
            amountBtns.forEach(b => b.addEventListener('click', () => {
                amountBtns.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                if (b.dataset.amount === 'custom') {
                    isCustom = true; 
                    if (customWrap) customWrap.classList.remove('hidden'); 
                    if (customInput) customInput.focus();
                } else {
                    isCustom = false; 
                    if (customWrap) customWrap.classList.add('hidden'); 
                    amount = parseInt(b.dataset.amount);
                }
                updateSummary();
            }));
        }

        if (customInput) {
            customInput.addEventListener('input', updateSummary);
        }

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

        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                const a = isCustom ? (customInput && customInput.value ? parseFloat(customInput.value) : 0) : amount;
                if (!a || a <= 0) {
                    if (isCustom && customInput) {
                        customInput.style.borderColor = '#ef4444';
                        customInput.animate([
                            { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
                            { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }
                        ], { duration: 300 });
                    }
                    return;
                }
                if (isCustom && customInput) customInput.style.borderColor = 'var(--primary)';
                uiEls.forEach(el => { if (el) el.style.display = 'none'; });
                if (trustBadges) trustBadges.style.display = 'none';
                if (paymentForm) paymentForm.classList.remove('hidden');
                if (headerH2) headerH2.textContent = 'Payment Details';
                if (headerP) headerP.textContent = 'Your information is kept safe & secure';
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (paymentForm) paymentForm.classList.add('hidden');
                uiEls.forEach(el => { if (el) el.style.display = ''; });
                if (trustBadges) trustBadges.style.display = '';
                if (!isCustom && customWrap) customWrap.classList.add('hidden');
                if (headerH2) headerH2.textContent = 'Partner with Us';
                if (headerP) headerP.textContent = 'Choose an amount to spread the Gospel';
            });
        }

        const donorCard = document.getElementById('donor-card');
        if (donorCard) {
            donorCard.addEventListener('input', function (e) {
                let val = this.value.replace(/\D/g, '');
                let formatted = val.match(/.{1,4}/g);
                this.value = formatted ? formatted.join(' ') : val;
            });
        }

        const submitDonationBtn = document.getElementById('submit-donation');
        if (submitDonationBtn) {
            submitDonationBtn.addEventListener('click', function () {
                const nameInput = document.getElementById('donor-name');
                const emailInput = document.getElementById('donor-email');
                const cardInput = document.getElementById('donor-card');
                
                const nameError = document.getElementById('error-name');
                const emailError = document.getElementById('error-email');
                const cardError = document.getElementById('error-card');
                
                let isValid = true;

                // Reset errors
                [nameInput, emailInput, cardInput].forEach(el => { if(el) el.classList.remove('error'); });
                [nameError, emailError, cardError].forEach(el => { if(el) el.classList.add('hidden'); });

                // Validate name
                if (nameInput && !nameInput.value.trim()) {
                    nameInput.classList.add('error');
                    if (nameError) nameError.classList.remove('hidden');
                    isValid = false;
                }

                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput && (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim()))) {
                    emailInput.classList.add('error');
                    if (emailError) emailError.classList.remove('hidden');
                    isValid = false;
                }

                // Validate card
                let cardVal = '';
                if (cardInput) {
                    cardVal = cardInput.value.replace(/\s+/g, '');
                    if (!cardVal || cardVal.length < 15 || !/^\d+$/.test(cardVal)) {
                        cardInput.classList.add('error');
                        if (cardError) cardError.classList.remove('hidden');
                        isValid = false;
                    }
                } else {
                    isValid = false;
                }

                if (!isValid) {
                    if (paymentForm) {
                        paymentForm.animate([
                            { transform: 'translateX(0)' }, { transform: 'translateX(-4px)' },
                            { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }
                        ], { duration: 300 });
                    }
                    return;
                }

                this.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Processing...';
                try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch(e){}
                this.style.opacity = '0.8';
                this.style.pointerEvents = 'none';
                setTimeout(() => {
                    const hdr = document.querySelector('.card-header');
                    if (hdr) hdr.style.display = 'none';
                    if (paymentForm) paymentForm.innerHTML = `
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
        }

        // ── Toasts ──
        const createToast = msg => {
            const c = document.getElementById('toast-container') || (() => {
                const d = document.createElement('div'); d.id = 'toast-container';
                document.body.appendChild(d); return d;
            })();
            const t = document.createElement('div');
            t.className = 'toast glassmorphism';
            t.innerHTML = `<i data-lucide="info"></i><span style="color:white;font-weight:500;">${msg}</span>`;
            c.appendChild(t); 
            try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch(e){}
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
    }

    // Run safely regardless of how the script is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
