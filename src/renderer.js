let screenshotEl = document.getElementById('screenshot-image');
let currentData = null;
let selectedGhost = null;

async function takeScreenshot() {
    await window.screenshot.captureScreenShot()
    window.screenshot.screenShotCaptured((event, args) => {
        currentData = args.data;

        var image = document.createElement("img");
        image.src = args.dataURL;
        image.onload = function () {
            screenshotEl.innerHTML = "";
            setCoordinates(image, args.data)
        };

        setData(args.data);
        document.getElementById('screenshot-next').classList.remove('hidden');
        document.getElementById('screenshot-info').classList.remove('disabled');
    });
}

async function saveScreenShot() {
    if (selectedGhost) {
        let currentData1 = structuredClone(currentData);
        currentData1.push({
            name: "Selected Ghost",
            text: selectedGhost,
            order: 2
        });

        currentData1.sort((a, b) =>  a.order - b.order);
        await window.screenshot.nextScreenShot(currentData1);
    } else {
        console.log(selectedGhost);
    }
}

function setCoordinates(img, data) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
        let capture = data[i];
        console.log(capture);
        let coordinates = capture.coordinates;
        ctx.strokeStyle = "#99ff33";
        ctx.lineWidth = 6;

        ctx.fillStyle = "#abc";
        ctx.font="36px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#54a800";

        ctx.fillText(capture.name,coordinates.left+(coordinates.width/2),coordinates.top+(coordinates.height/2));
        ctx.rect(coordinates.left, coordinates.top, coordinates.width, coordinates.height);
    }
    ctx.closePath();
    ctx.stroke();

    screenshotEl.appendChild(canvas);
}

function setTab(element) {
    if (element.classList && element.classList.contains('disabled'))
        return;

    let dataIndexClass = element.getAttribute('data-index-class');

    document.querySelectorAll('.js-tabs').forEach((el) => {
        el.classList.add('hidden');
    });

    document.querySelectorAll(dataIndexClass).forEach((el) => {
        el.classList.remove('hidden');
    });
}

function setData(data) {
    let container = document.getElementById('screenshot-info-content');
    container.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let capture = data[i];

        var a = document.createElement('a');
        a.classList.add('c-phasmo__input');
        a.innerHTML = capture.name + ": "+capture.text;

        container.append(a);
    }
}

async function loadGhosts() {
    let container = document.getElementById('screenshot-ghosts-content');
    const ghosts = await window.screenshot.getGhosts();

    for (let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];

        var a = document.createElement('a');
        a.classList.add('c-phasmo__input--small');
        a.classList.add('js-ghost-select');
        a.innerHTML = ghost;

        container.append(a);
    }

    document.querySelectorAll('.js-ghost-select').forEach((el) => {
        el.addEventListener('click', function () {
            selectedGhost = this.innerHTML;

            document.querySelectorAll('.js-ghost-select').forEach((el) => {
                el.classList.remove('selected');
            });

            this.classList.add('selected');
        });
    });
}

document.getElementById('screenshot-button').addEventListener('click', takeScreenshot);
document.getElementById('screenshot-next').addEventListener('click', saveScreenShot);
loadGhosts();