// DOM Elements
const videoElement = document.getElementById('video');
const selectButton = document.getElementById('select-button');
const startButton = document.getElementById('start-button');
const statusMessage = document.getElementById('status-message');

// Create background bubbles
function createBubbles() {
    const body = document.querySelector('body');
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        body.appendChild(bubble);
    }
}

// Update status message with animation
function updateStatus(message, type = 'info') {
    statusMessage.style.animation = 'none';
    statusMessage.offsetHeight; // Trigger reflow
    statusMessage.style.animation = 'pulse 1s ease-in-out';

    statusMessage.textContent = message;

    // Set status color based on type
    if (type === 'success') {
        statusMessage.style.background = 'rgba(25, 135, 84, 0.2)';
        statusMessage.style.color = '#4ade80';
    } else if (type === 'error') {
        statusMessage.style.background = 'rgba(220, 53, 69, 0.2)';
        statusMessage.style.color = '#f87171';
    } else {
        statusMessage.style.background = 'rgba(0, 0, 0, 0.2)';
        statusMessage.style.color = 'rgba(255, 255, 255, 0.8)';
    }
}

// Select media stream function
async function selectMediaStream() {
    try {
        updateStatus('Selecting screen...', 'info');

        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always'
            },
            audio: false
        });

        // Track when the stream ends
        const track = mediaStream.getVideoTracks()[0];
        track.addEventListener('ended', () => {
            updateStatus('Screen sharing ended', 'info');
            startButton.disabled = true;
            selectButton.disabled = false;
        });

        // Set video source to the media stream
        videoElement.srcObject = mediaStream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
            updateStatus('Screen selected! Click Start PiP', 'success');
            startButton.disabled = false;
            selectButton.disabled = true;
        };
    } catch (error) {
        console.error('Error selecting media stream:', error);
        updateStatus(`Error: ${error.message || 'Could not access display media'}`, 'error');
        startButton.disabled = true;
        selectButton.disabled = false;
    }
}

// Start Picture in Picture mode
async function startPictureInPicture() {
    try {
        startButton.disabled = true;
        updateStatus('Starting Picture in Picture...', 'info');

        // If we don't have a media stream yet, select one first
        if (!videoElement.srcObject) {
            await selectMediaStream();
        }

        // Request Picture in Picture
        await videoElement.requestPictureInPicture();

        // Add event listener for when PiP mode is exited
        videoElement.addEventListener('leavepictureinpicture', () => {
            updateStatus('Picture in Picture mode exited', 'info');
            startButton.disabled = false;
        });

        updateStatus('Picture in Picture active!', 'success');
    } catch (error) {
        console.error('Error starting Picture in Picture:', error);
        updateStatus(`Error: ${error.message || 'Could not start Picture in Picture'}`, 'error');
        startButton.disabled = false;
    }
}

// Event Listeners
selectButton.addEventListener('click', selectMediaStream);
startButton.addEventListener('click', startPictureInPicture);

// Initialize the app
function initApp() {
    createBubbles();
    updateStatus('Ready to start');
    startButton.disabled = true;
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);