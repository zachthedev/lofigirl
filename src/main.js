// Tauri API will be initialized in initializeApp function
let appWindow, event, open;
  
function navigateTo(link) {
  if (open) {
    open(link);
  }
}

// Audio visualizer variables
let audioContext;
let analyser;
let audioElement;
let dataArray;
let canvas;
let canvasContext;
let animationId;
let isAudioMode = false;

// Initialize audio visualizer
function initAudioVisualizer() {
  audioElement = document.getElementById('audio-player');
  canvas = document.getElementById('visualizer');
  canvasContext = canvas.getContext('2d');
  
  // Set canvas size responsively based on container
  const container = document.querySelector('.visualizer-container');
  const containerRect = container.getBoundingClientRect();
  canvas.width = containerRect.width || window.innerWidth;
  canvas.height = containerRect.height || window.innerHeight * 0.6;
  
  // Update canvas size on window resize
  window.addEventListener('resize', () => {
    const newRect = container.getBoundingClientRect();
    canvas.width = newRect.width || window.innerWidth;
    canvas.height = newRect.height || window.innerHeight * 0.6;
  });
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
  
  // Start the animated visualizer
  drawAnimatedVisualizer();
}


// Toggle between video and audio mode
function toggleAudioMode() {
  const videoPlayer = document.getElementById('video-player');
  const audioMode = document.getElementById('audio-mode');
  const audioToggleIcon = document.getElementById('audio-toggle-icon');
  
  isAudioMode = !isAudioMode;
  
  if (isAudioMode) {
    // Switch to audio-only mode
    videoPlayer.style.display = 'none';
    audioMode.style.display = 'flex';
    audioToggleIcon.src = 'https://api.iconify.design/ph:video-bold.svg';
    audioToggleIcon.alt = 'switch to video';
    
    // Initialize audio visualizer with animation
    initAudioVisualizer();
  } else {
    // Switch back to video mode
    videoPlayer.style.display = 'block';
    audioMode.style.display = 'none';
    audioToggleIcon.src = 'https://api.iconify.design/ph:play-bold.svg';
    audioToggleIcon.alt = 'switch to audio';
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
}

// Create animated visualization for audio mode
function drawAnimatedVisualizer() {
  if (!isAudioMode) return;
  
  animationId = requestAnimationFrame(drawAnimatedVisualizer);
  
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  
  const bars = 128;
  const barWidth = canvas.width / bars;
  
  for (let i = 0; i < bars; i++) {
    // Create pseudo-random bars that look like music visualization
    const time = Date.now() * 0.001;
    const barHeight = (Math.sin(i * 0.1 + time) * 0.5 + 0.5) * 
                     (Math.cos(i * 0.05 + time * 1.3) * 0.3 + 0.7) * 
                     canvas.height * 0.8;
    
    const gradient = canvasContext.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
    gradient.addColorStop(0, `hsl(${(i * 3 + time * 50) % 360}, 70%, 80%)`);
    gradient.addColorStop(1, `hsl(${(i * 3 + time * 50) % 360}, 70%, 40%)`);
    
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
  }
  
  // Add floating particles
  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.7) {
      canvasContext.beginPath();
      canvasContext.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2 + 1,
        0,
        Math.PI * 2
      );
      canvasContext.fillStyle = `hsla(${Math.random() * 360}, 100%, 80%, 0.4)`;
      canvasContext.fill();
    }
  }
}

// Ensure Tauri API is loaded before setting up event listeners
async function initializeApp() {
  console.log('Initializing app...');
  
  // Wait for Tauri to be ready
  if (!window.__TAURI__) {
    console.error('Tauri API not available');
    return;
  }

  console.log('Tauri API available, initializing...');

  try {
    // Initialize Tauri API references
    ({ appWindow } = window.__TAURI__.window);
    ({ event } = window.__TAURI__.event);
    ({ open } = window.__TAURI__.shell);

    console.log('Tauri API references initialized');

    // Set up event listeners
    const goToGitHub = document.getElementById("goToGitHub");
    if (goToGitHub) {
      goToGitHub.addEventListener("click", () => {
        console.log('GitHub link clicked');
        open("https://github.com/zachthedev/lofigirl");
      });
    } else {
      console.error('goToGitHub element not found');
    }
    
    const minimizeBtn = document.getElementById("titlebar-minimize");
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        console.log('Minimize clicked');
        appWindow.minimize();
      });
    } else {
      console.error('titlebar-minimize element not found');
    }
    
    const maximizeBtn = document.getElementById("titlebar-maximize");
    if (maximizeBtn) {
      maximizeBtn.addEventListener("click", () => {
        console.log('Maximize clicked');
        appWindow.toggleMaximize();
      });
    } else {
      console.error('titlebar-maximize element not found');
    }
    
    const closeBtn = document.getElementById("titlebar-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        console.log('Close clicked');
        appWindow.close();
      });
    } else {
      console.error('titlebar-close element not found');
    }
    
    const audioToggle = document.getElementById("audio-toggle");
    if (audioToggle) {
      audioToggle.addEventListener("click", () => {
        console.log('Audio toggle clicked');
        toggleAudioMode();
      });
    } else {
      console.error('audio-toggle element not found');
    }
    
    console.log('Event listeners setup completed');
    
    // Audio controls
    const playPauseBtn = document.getElementById("play-pause");
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        const audioElement = document.getElementById('audio-player');
        const buttonIcon = document.querySelector("#play-pause img");
        
        if (audioElement && buttonIcon) {
          if (audioElement.paused) {
            audioElement.play();
            buttonIcon.src = 'https://api.iconify.design/ph:pause-bold.svg';
            buttonIcon.alt = 'pause';
          } else {
            audioElement.pause();
            buttonIcon.src = 'https://api.iconify.design/ph:play-bold.svg';
            buttonIcon.alt = 'play';
          }
        }
      });
    }
    
    const volumeSlider = document.getElementById("volume-slider");
    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const audioElement = document.getElementById('audio-player');
        if (audioElement) {
          audioElement.volume = e.target.value / 100;
        }
      });
    }

    console.log('All event listeners initialized successfully');
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded, starting initialization...');
  initializeApp();
});
