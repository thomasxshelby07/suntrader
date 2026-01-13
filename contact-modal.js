
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Modal HTML structure dynamically
    const modalHTML = `
    <div id="contactModal" class="modal-overlay">
        <div class="modal-container">
            <button class="modal-close">&times;</button>
            <div class="modal-content">
                <div class="modal-header">
                    <img src="suntraderlogo.png" alt="Sun Trader" class="modal-logo">
                    <h3>Start Your Journey</h3>
                    <p>Fill in your details and we'll get back to you instantly.</p>
                </div>
                <!-- Formspree Integration -->
                <form class="contact-form" action="https://formspree.io/f/xblddoga" method="POST">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="mobile">Mobile Number</label>
                        <input type="tel" id="mobile" name="mobile" placeholder="Enter your mobile number" required>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
                    <p id="form-status" style="margin-top:10px; font-size: 0.9rem;"></p>
                </form>
            </div>
        </div>
    </div>
    `;

    // 2. Inject Modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Modal Logic
    const modal = document.getElementById('contactModal');
    const openBtns = document.querySelectorAll('.open-modal-btn'); // Target all triggered buttons
    const closeBtn = document.querySelector('.modal-close');
    const form = document.querySelector('.contact-form');
    const statusMsg = document.getElementById('form-status');

    // Open Modal Function
    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    // Attach Open Event to ALL matching buttons
    openBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle Form Submit (Optional AJAX override for smoother UX with Formspree)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success Logic - Replace Form with Success View
                    const modalBody = document.querySelector('.modal-content');
                    modalBody.innerHTML = `
                        <div class="success-view" style="text-align: center; padding: 40px 20px;">
                            <div class="checkmark-wrapper">
                                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                </svg>
                            </div>
                            <h3 style="color: #122151; margin-top: 20px; font-size: 1.5rem;">Request Sent Successfully!</h3>
                            <p style="color: #666; margin-top: 10px; font-size: 1rem;">Our team will connect with you within 1 hour.</p>
                            <button class="btn btn-primary" onclick="document.querySelector('.modal-overlay').classList.remove('active'); document.body.style.overflow = '';" style="margin-top: 30px;">Close</button>
                        </div>
                    `;

                    // Optional: Reset form logic if needed for next time (requires page reload or re-init, but for this UX replacing content is fine)
                } else {
                    const errorData = await response.json();
                    statusMsg.innerText = errorData.errors ? errorData.errors.map(err => err.message).join(", ") : "Oops! Something went wrong.";
                    statusMsg.style.color = "red";
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                statusMsg.innerText = "Network error. Please try again.";
                statusMsg.style.color = "red";
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});
