// Tauri API will be initialized in initializeApp function
let appWindow, event, open, invoke;

// State tracking for sleep prevention
let isWindowHidden = false;
let wasVideoPlaying = false;
let wasAudioPlaying = false;
  
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
async function toggleAudioMode() {
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
  
  // Notify backend about mode change
  if (invoke) {
    try {
      await invoke('toggle_audio_mode');
    } catch (error) {
      console.error('Failed to notify backend of mode change:', error);
    }
  }
}

// Function to pause media to prevent sleep issues
function pauseMediaForSleep() {
  const videoPlayer = document.getElementById('video-player');
  const audioPlayer = document.getElementById('audio-player');
  
  // Handle video player (iframe)
  if (videoPlayer && videoPlayer.style.display !== 'none') {
    // Save current playing state
    wasVideoPlaying = true;
    // Modify iframe src to remove autoplay to prevent sleep issues
    const currentSrc = videoPlayer.src;
    if (currentSrc.includes('autoplay=1')) {
      videoPlayer.src = currentSrc.replace('autoplay=1', 'autoplay=0');
    }
  }
  
  // Handle audio player
  if (audioPlayer && !audioPlayer.paused) {
    wasAudioPlaying = true;
    audioPlayer.pause();
  }
}

// Function to resume media when window is shown
function resumeMediaAfterSleep() {
  const videoPlayer = document.getElementById('video-player');
  const audioPlayer = document.getElementById('audio-player');
  
  // Handle video player (iframe)
  if (videoPlayer && videoPlayer.style.display !== 'none' && wasVideoPlaying) {
    // Restore autoplay
    const currentSrc = videoPlayer.src;
    if (currentSrc.includes('autoplay=0')) {
      videoPlayer.src = currentSrc.replace('autoplay=0', 'autoplay=1');
    }
    wasVideoPlaying = false;
  }
  
  // Handle audio player
  if (audioPlayer && wasAudioPlaying) {
    audioPlayer.play().catch(e => console.error('Failed to resume audio:', e));
    wasAudioPlaying = false;
  }
}

// Function to handle play/pause toggle
function togglePlayback() {
  if (isAudioMode) {
    // Handle audio mode
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector("#play-pause img");
    
    if (audioPlayer && playPauseBtn) {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.src = 'https://api.iconify.design/ph:pause-bold.svg';
        playPauseBtn.alt = 'pause';
      } else {
        audioPlayer.pause();
        playPauseBtn.src = 'https://api.iconify.design/ph:play-bold.svg';
        playPauseBtn.alt = 'play';
      }
    }
  } else {
    // Handle video mode - toggle autoplay
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer) {
      const currentSrc = videoPlayer.src;
      if (currentSrc.includes('autoplay=1')) {
        videoPlayer.src = currentSrc.replace('autoplay=1', 'autoplay=0');
      } else if (currentSrc.includes('autoplay=0')) {
        videoPlayer.src = currentSrc.replace('autoplay=0', 'autoplay=1');
      }
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
    ({ invoke } = window.__TAURI__.core);

    console.log('Tauri API references initialized');

    // Listen for window visibility events from tray
    await event.listen('window-hidden', () => {
      console.log('Window hidden event received');
      isWindowHidden = true;
      pauseMediaForSleep();
      if (invoke) {
        invoke('set_window_visibility', { visible: false }).catch(e => 
          console.error('Failed to update visibility state:', e)
        );
      }
    });

    await event.listen('window-shown', () => {
      console.log('Window shown event received');
      isWindowHidden = false;
      resumeMediaAfterSleep();
      if (invoke) {
        invoke('set_window_visibility', { visible: true }).catch(e => 
          console.error('Failed to update visibility state:', e)
        );
      }
    });

    // Listen for tray-initiated actions
    await event.listen('toggle-playback-from-tray', () => {
      console.log('Toggle playback from tray');
      togglePlayback();
      if (invoke) {
        invoke('toggle_playback').catch(e => 
          console.error('Failed to update playback state:', e)
        );
      }
    });

    await event.listen('toggle-mode-from-tray', () => {
      console.log('Toggle mode from tray');
      toggleAudioMode();
    });

    console.log('Tauri event listeners set up successfully');

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
        // Pause media before minimizing to prevent sleep issues
        pauseMediaForSleep();
        appWindow.minimize();
        
        // Update backend state
        if (invoke) {
          invoke('set_window_visibility', { visible: false }).catch(e => 
            console.error('Failed to update visibility state:', e)
          );
        }
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
        console.log('Play/Pause button clicked');
        togglePlayback();
        
        // Update backend state
        if (invoke) {
          invoke('toggle_playback').catch(e => 
            console.error('Failed to update playback state:', e)
          );
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
