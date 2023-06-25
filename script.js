const videoElement = document.getElementById('video');
const button = document.getElementById('button');

// Prompt the user to select a media stream, pass to video element then play
async function selectMediaStream() {
    try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia();
        videoElement.srcObject = mediaStream;
        videoElement.onloadedmetadata = () => {
            videoElement.onplay();
        }
    } catch (error) {
        // Catch Error Here
        console.log('Oh no there is an error:' + error);
    }
}

// On Load 
selectMediaStream();

// Event Listener
button.addEventListener('click', async () => {
    // Disable Button 
    button.disabled = true;

    // Start picturein picture
    await videoElement.requestPictureInPicture();

    // Reset the button
    button.disabled = false;
});