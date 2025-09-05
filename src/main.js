const { appWindow } = window.__TAURI__.window;
const { event } = window.__TAURI__.event;
const { open } = window.__TAURI__.shell;
  
function navigateTo(link) {
  open(link);
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
  
  // Set canvas size to match CSS
  canvas.width = 800;
  canvas.height = 400;
  
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
  
  drawVisualizer();
}

// Draw the audio visualizer
function drawVisualizer() {
  if (!isAudioMode) return;
  
  animationId = requestAnimationFrame(drawVisualizer);
  
  analyser.getByteFrequencyData(dataArray);
  
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  
  const barWidth = (canvas.width / dataArray.length) * 2;
  let barHeight;
  let x = 0;
  
  for (let i = 0; i < dataArray.length; i++) {
    barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
    
    // Create gradient for bars
    const gradient = canvasContext.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
    gradient.addColorStop(0, `hsl(${i * 2}, 100%, 80%)`);
    gradient.addColorStop(1, `hsl(${i * 2}, 100%, 40%)`);
    
    canvasContext.fillStyle = gradient;
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    
    x += barWidth + 1;
  }
  
  // Add some floating particles for extra effect
  if (Math.random() > 0.9) {
    canvasContext.beginPath();
    canvasContext.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 3 + 1,
      0,
      Math.PI * 2
    );
    canvasContext.fillStyle = `hsla(${Math.random() * 360}, 100%, 80%, 0.6)`;
    canvasContext.fill();
  }
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
    
    // Since we can't extract audio from YouTube directly, we'll create a mock audio experience
    // with a generated visualization based on a default audio context
    try {
      initAudioVisualizer();
    } catch (error) {
      console.error('Audio initialization failed:', error);
      // Fallback: create visualization without audio input
      createMockVisualization();
    }
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

// Create mock visualization when audio extraction isn't available
function createMockVisualization() {
  if (!isAudioMode) return;
  
  animationId = requestAnimationFrame(createMockVisualization);
  
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
  // Wait for Tauri to be ready
  if (!window.__TAURI__) {
    console.error('Tauri API not available');
    return;
  }

  // Set up event listeners
  document.getElementById("goToGitHub").addEventListener("click", () => {
    open("https://github.com/zachthedev/lofigirl")
  });
  
  document.getElementById("titlebar-minimize").addEventListener("click", () => {
    console.log('Minimize clicked');
    appWindow.minimize();
  });
  
  document.getElementById("titlebar-maximize").addEventListener("click", () => {
    console.log('Maximize clicked');
    appWindow.toggleMaximize();
  });
  
  document.getElementById("titlebar-close").addEventListener("click", () => {
    console.log('Close clicked');
    appWindow.close();
  });
  
  // Audio toggle functionality
  document.getElementById("audio-toggle").addEventListener("click", () => {
    console.log('Audio toggle clicked');
    toggleAudioMode();
  });
  
  // Audio controls
  document.getElementById("play-pause").addEventListener("click", () => {
    const audioElement = document.getElementById('audio-player');
    const button = document.getElementById("play-pause");
    
    if (audioElement.paused) {
      audioElement.play();
      button.textContent = '⏸️';
    } else {
      audioElement.pause();
      button.textContent = '▶️';
    }
  });
  
  document.getElementById("volume-slider").addEventListener("input", (e) => {
    const audioElement = document.getElementById('audio-player');
    audioElement.volume = e.target.value / 100;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
