const slider = document.querySelector(".slider");
const sliderCards = document.querySelectorAll(".slider__card");
const gedoMazo = document.querySelector(".gedo-mazo");
const bottomText = document.querySelector(".bottom-text");
const projectText = document.querySelector(".project");

const MEMBERS_COUNT = 10;
const SLIDER_FULL_ROTATION_DURATION = 10_000;
const SLIDER_SHOW_DURATION = 4_000;

function promisifyAnimationEnd(element) {
  return new Promise((resolve) => {
    element.addEventListener("animationend", () => {
      resolve();
    });
  });
}

function setupRemoveSliderCardsBlurTimeouts() {
  const sliderComputedStyles = getComputedStyle(slider);
  const sliderEnterDuration = parseInt(
    sliderComputedStyles.getPropertyValue("--slider-enter-duration-ms")
  );
  const sliderRotationDuration = parseInt(
    sliderComputedStyles.getPropertyValue("--slider-rotation-duration-ms")
  );
  const sliderRotationStepDuration = sliderRotationDuration / MEMBERS_COUNT;
  for (let i = 0; i < MEMBERS_COUNT; i++) {
    const card = sliderCards[i];
    const clearBlurIn = sliderEnterDuration + i * sliderRotationStepDuration;
    setTimeout(() => {
      card.classList.remove("blurred");
    }, clearBlurIn);
  }
}

async function renderElementsAnimations() {
  await new Promise((resolve) => {
    projectText.classList.add("project--shown");
    projectText.children[1].addEventListener("transitionend", () => {
      resolve();
    });
  });
  setupRemoveSliderCardsBlurTimeouts();
  slider.classList.remove("slider--hidden");
  await promisifyAnimationEnd(slider, "animationend");
  gedoMazo.classList.remove("gedo-mazo--hidden");
  await promisifyAnimationEnd(gedoMazo);
  bottomText.classList.remove("bottom-text--hidden");
  await promisifyAnimationEnd(bottomText);
}

const bgMusicModal = document.getElementById("bg-music-modal");
let hasClosedBgMusicModal = false;
const muteMusicCheckbox = document.getElementById("mute-music-input");
const musicVolumeSlider = document.getElementById("music-volume");
const musicsRadios = document.querySelectorAll(
  "#bg-music-modal input[name=music]"
);
const bgMusicModalToggle = document.getElementById("music-modal-toggle");

bgMusicModal.showModal();

bgMusicModalToggle.addEventListener("click", () => {
  bgMusicModal.showModal();
});

bgMusicModal.addEventListener("close", () => {
  if (!hasClosedBgMusicModal) {
    hasClosedBgMusicModal = true;
    renderElementsAnimations();
  }
});

const backgroundMusicsURLs = [
  "./media/heros-come-back.mp3",
  "./media/akatsuki-appearance.mp3",
  "./media/akatsuki-ritual.mp3",
  "./media/girei.mp3",
  "./media/saika.mp3",
];
let currentMusicIndex = -1;
let muteMusic = muteMusicCheckbox.checked;
let musicVolume = parseFloat(musicVolumeSlider.value);
const backgroundMusics = backgroundMusicsURLs.map((url) => {
  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = musicVolume;
  audio.muted = muteMusic;
  return audio;
});

function handleMusicChange() {
  if (currentMusicIndex !== -1) {
    const currentMusic = backgroundMusics[currentMusicIndex];
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
  currentMusicIndex = parseInt(this.value);
  if (currentMusicIndex !== -1) {
    backgroundMusics[currentMusicIndex].play();
  }
}

for (const input of musicsRadios) {
  input.addEventListener("change", handleMusicChange);
}

muteMusicCheckbox.addEventListener("change", function () {
  muteMusic = this.checked;
  musicVolumeSlider.disabled = muteMusic;
  for (const music of backgroundMusics) {
    music.muted = muteMusic;
  }
});

musicVolumeSlider.addEventListener("input", function () {
  musicVolume = parseFloat(this.value);
  for (const music of backgroundMusics) {
    music.volume = musicVolume;
  }
});
