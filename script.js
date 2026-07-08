document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Floating Particles
    const container = document.getElementById('hearts-bg');
    const shapes = ['❤️', '💖', '💗', '💓', '🌸', '🌺', '🌷', '✨'];
    
    for (let i = 0; i < 150; i++) {
        let p = document.createElement('div');
        p.classList.add('particle');
        p.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 10 + 5) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        
        let size = Math.random() * 15 + 10; // 10px to 25px
        p.style.fontSize = size + 'px';
        p.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(p);
    }

    // 2. Navigation & Screens
    const screens = {
        intro: document.getElementById('screen-intro'),
        envelope: document.getElementById('screen-envelope'),
        cards: document.getElementById('screen-cards'),
        outro: document.getElementById('screen-outro')
    };

    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // 3. Intro Buttons Logic
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    let noClicks = 0;

    btnYes.addEventListener('click', () => showScreen('envelope'));

    function moveNoBtn(e) {
        if (noClicks < 3) {
            e.preventDefault(); // Stop click if moving
            const maxX = window.innerWidth - btnNo.offsetWidth - 20;
            const maxY = window.innerHeight - btnNo.offsetHeight - 20;
            
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            
            btnNo.style.position = 'fixed';
            btnNo.style.left = newX + 'px';
            btnNo.style.top = newY + 'px';
            
            noClicks++;
            
            if (noClicks === 3) {
                btnNo.innerText = "fine mei sun rhi hu";
                btnNo.classList.remove('secondary');
                btnNo.classList.add('primary'); // Make it look clickable now
            }
        } else {
            // Already caught
            btnNo.style.position = 'relative';
            btnNo.style.left = 'auto';
            btnNo.style.top = 'auto';
            showScreen('envelope');
        }
    }

    btnNo.addEventListener('mouseover', moveNoBtn);
    btnNo.addEventListener('click', moveNoBtn);
    btnNo.addEventListener('touchstart', moveNoBtn); // For mobile

    // 4. Envelope Logic
    const envelope = document.getElementById('envelope-wrapper');
    let envStartY = 0;

    envelope.addEventListener('touchstart', e => {
        envStartY = e.changedTouches[0].screenY;
    });

    envelope.addEventListener('touchend', e => {
        let endY = e.changedTouches[0].screenY;
        if (envStartY > endY + 30) openEnvelope(); // Swipe up
    });

    envelope.addEventListener('click', openEnvelope);

    function openEnvelope() {
        envelope.classList.add('open');
        setTimeout(() => {
            showScreen('cards');
            initCards();
        }, 1200);
    }

    // 5. Cards Logic
    const apologyTexts = [
        "My dear Monika ❤️<br><br>I know you’re working so will keep this brief.",
        "I wanted to solve this last night but I slept and abh itna time ho gaya, I can’t go on without saying my heart.",
        "So firstly I am sorry what I said about hanging out with friends and all.",
        "I just wish you also hung out with me also unplanned randomly like that also instead of having a planned 8pm slot everyday.",
        "But baby seriously, It really isn’t big deal as you think. I am so happy u have such good group of friends. And when we hangout, all my doubts disappear.",
        "Sometimes i may get bit weird like u said, when i see you guys hanging out all day together then after work also and I don’t get to see you after planning things in my head...",
        "...or then you’re too tired/irritated or come back too late to enjoy your time with me when you do.",
        "I’m surprised you said that I want to keep you trapped, I never will ask you to give me time or stay in hostel 5-7 just because I MIGHT want to hangout with you, especially on cost of ur friendships but also ur time is valuable as mine.",
        "You shouldn’t think of me as a person like that cause I’m not and when u said it last night it hurt me. I didn’t even think anything like that.",
        "And sorry for the story reply, whatever I thought about it, my reply was genuinely a joke except second one when I got insecure 💀 but never again.",
        "I was in wrong to take it that way and I shouldn’t have never ever doubted ur love towards me.",
        "Thank you and sorry for doubting your love and efforts, if you wanna talk about anything later call me...",
        "...but please I want to solve this and get our life going on, hope you have an amazing day at work 😘"
    ];

    const cardDeck = document.getElementById('card-deck');
    let currentCard = 0;
    let autoSwipeInterval;

    function initCards() {
        // Clear deck
        cardDeck.innerHTML = '';
        
        // Create cards
        apologyTexts.forEach((text, i) => {
            let card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `<p>${text}</p>`;
            cardDeck.appendChild(card);
        });

        // Add final "kuch aur?" card
        let finalCard = document.createElement('div');
        finalCard.classList.add('card');
        finalCard.innerHTML = `<button id="btn-final" class="btn primary">kuch aur?</button>`;
        cardDeck.appendChild(finalCard);

        // Bind final button
        finalCard.querySelector('#btn-final').addEventListener('click', triggerEnding);

        updateCardClasses();
        startAutoSwipe();
    }

    function updateCardClasses() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === currentCard) card.classList.add('active');
            else if (i < currentCard) card.classList.add('prev');
        });
    }

    function goNext() {
        const cards = document.querySelectorAll('.card');
        if (currentCard < cards.length - 1) {
            currentCard++;
            updateCardClasses();
            startAutoSwipe(); // Reset timer
        }
    }

    function goPrev() {
        if (currentCard > 0) {
            currentCard--;
            updateCardClasses();
            startAutoSwipe();
        }
    }

    function startAutoSwipe() {
        clearInterval(autoSwipeInterval);
        autoSwipeInterval = setInterval(() => {
            const cards = document.querySelectorAll('.card');
            // Only auto swipe if not on the last card
            if (currentCard < cards.length - 1) goNext();
        }, 7000); // Swipe every 7 seconds
    }

    // Card Controls Bindings
    document.getElementById('btn-next').addEventListener('click', goNext);
    document.getElementById('btn-prev').addEventListener('click', goPrev);

    // Swipe logic for cards
    let cardStartX = 0;
    cardDeck.addEventListener('touchstart', e => cardStartX = e.changedTouches[0].screenX);
    cardDeck.addEventListener('touchend', e => {
        let endX = e.changedTouches[0].screenX;
        if (cardStartX > endX + 40) goNext(); // Swipe left
        else if (cardStartX < endX - 40) goPrev(); // Swipe right
    });

    // 6. Ending Sequence
    function triggerEnding() {
        clearInterval(autoSwipeInterval);
        document.body.classList.add('dark-mode');
        showScreen('outro');
    }

    // 7. Repeat Sequence
    document.getElementById('btn-repeat').addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        envelope.classList.remove('open');
        currentCard = 0;
        noClicks = 0;
        
        // Reset "No" button
        btnNo.innerText = "nhi too busy";
        btnNo.classList.remove('primary');
        btnNo.classList.add('secondary');
        btnNo.style.position = 'relative';
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';

        showScreen('intro');
    });
});