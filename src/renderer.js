
async function takeScreenshot() {
    console.log("takeScreenshot");

    await window.screenshot.captureScreenShot()
    window.screenshot.screenShotCaptured((event, args) => {
        console.log(args);
        document.getElementById('screenshot-image').src = args.dataURL;
        document.getElementById('text').innerHTML = args.text;
    });
}

document.getElementById('screenshot-button').addEventListener('click', takeScreenshot);