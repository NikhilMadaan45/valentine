/* ---------------- TIMER ---------------- */
const unlockDate = new Date("Feb 14, 2026 00:00:00").getTime();

const lockScreen = document.getElementById("lockScreen");
const questionScreen = document.getElementById("questionScreen");
const noBtn = document.getElementById("noBtn");
const noScreen = document.getElementById("noScreen");
const yesScreen = document.getElementById("yesScreen");
const music = document.getElementById("music");

// ✅ Unlock audio on first user interaction (fix autoplay block)
function enableMusic() {
    music.play().then(() => {
        music.pause();
        music.currentTime = 0;
    }).catch(() => {});

    document.removeEventListener("click", enableMusic);
    document.removeEventListener("touchstart", enableMusic);
}

document.addEventListener("click", enableMusic);
document.addEventListener("touchstart", enableMusic);


const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const diff = unlockDate - now;

    if (diff <= 0) {
        clearInterval(timerInterval);

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        lockScreen.classList.add("hidden");
        questionScreen.classList.remove("hidden");

        // 🎵 Start music after unlock
        music.volume = 0;
        music.play().catch(() => {});

        // Smooth fade in
        let fade = setInterval(() => {
            if (music.volume < 0.8) {
                music.volume += 0.05;
            } else {
                clearInterval(fade);
            }
        }, 200);

        return;
    }

    document.getElementById("days").innerText =
        Math.floor(diff / (1000 * 60 * 60 * 24));

    document.getElementById("hours").innerText =
        Math.floor((diff / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").innerText =
        Math.floor((diff / (1000 * 60)) % 60);

    document.getElementById("seconds").innerText =
        Math.floor((diff / 1000) % 60);
}, 1000);


/* ---------------- NO SCREEN ---------------- */
noBtn.addEventListener("click", () => {
    questionScreen.classList.add("hidden");
    noScreen.classList.remove("hidden");
});

function back() {
    noScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");
}

/* ---------------- SLIDER (IMAGES + VIDEOS) ---------------- */
const sliderItems = [
    ...Array.from({ length: 13 }, (_, i) => ({
        type: "image",
        src: `images/i${i + 1}.jpeg`
    })),
];

let currentSlide = 0;
let slideInterval = null;
const slider = document.getElementById("sliderContent");

function showSlide(index) {
    slider.innerHTML = "";
    const item = sliderItems[index];

    if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.src;
        slider.appendChild(img);

        startAutoSlide();
    } else {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;

        video.onended = () => nextSlide();

        slider.appendChild(video);
        stopAutoSlide();
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % sliderItems.length;
    showSlide(currentSlide);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function startSlider() {
    currentSlide = 0;
    showSlide(currentSlide);
}


/* ---------------- YES SCREEN ---------------- */
function sayYes() {
    questionScreen.classList.add("hidden");
    yesScreen.classList.remove("hidden");

    music.play().catch(() => {});
    startSlider();
}


/* ---------------- LOVE LETTER ---------------- */
const letterSection = document.getElementById("letterSection");
const typeText = document.getElementById("typeText");
let letterOpened = false;

const letterContent = `
My love ❤️

I don’t know how to explain what you mean to me without sounding like I’m exaggerating —
but the truth is, even words fall short.

From the moment you came into my life, something shifted.
The world didn’t change… I did.
I started seeing beauty in little things, finding calm in chaos,
and smiling at my phone like an idiot — all because of you.

You are my comfort on hard days,
my excitement on good ones,
and the quiet peace I didn’t even know I was searching for.

I love the way you exist — effortlessly.
The way you care, the way you laugh, the way you understand me even when I don’t say much.
With you, I don’t feel the need to pretend or explain myself.
I can just… be.

I may not always say the perfect words.
I may mess up, get quiet, or overthink things.
But please know this —
choosing you is the easiest thing I’ve ever done.

I choose you in small moments and big ones.
In laughter and silence.
In today, tomorrow, and every version of the future I imagine.

If love is a place, then you are home to me.
And no matter where life takes us,
my heart will always find its way back to you.

Forever yours,
Always and completely ❤️
`;

function openLetter() {
    if (letterOpened) return;
    letterOpened = true;

    letterSection.classList.remove("hidden");
    typeText.innerHTML = "";
    typeWriter(letterContent, 0);

    setTimeout(() => {
        letterSection.scrollIntoView({ behavior: "smooth" });
    }, 300);
}

function typeWriter(text, i) {
    if (i < text.length) {
        typeText.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1), 40);
    }
}
