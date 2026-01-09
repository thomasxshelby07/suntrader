
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
                    btn.innerText = 'Request Sent!';
                    btn.style.backgroundColor = '#00c853'; // Success Green
                    statusMsg.innerText = "Thanks! We'll contact you shortly.";
                    statusMsg.style.color = "green";
                    form.reset();
                    setTimeout(() => {
                        closeModal();
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                        statusMsg.innerText = "";
                    }, 2000);
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
