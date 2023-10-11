let coordinatesImage = document.getElementById('coordinates-image');
var el = document.getElementById('captures');
var image = document.createElement("img");

var sortable = Sortable.create(el, {
    onChange: function(evt) {
        document.querySelectorAll('.c-settings').forEach(function (element, index) {
            element.value = index;
            element.lastChild.value = index;
        });
    }
});

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

async function getColors() {
    await window.colors.getColors();
    window.colors.getColorsResponse(async (event, args) => {
        let colorsData = args.colors;

        for (const data in colorsData) {
            document.querySelector("input[name="+data+"]").value = colorsData[data];
        }
    });
}

async function getSettings() {
    await window.settings.getSettings();
    window.settings.getSettingsRead(async (event, args) => {
        let settingsData = args.data;

        const container = document.getElementById('captures');
        container.innerHTML = "";

        image.src = args.dataURL;
        image.onload = function () {
            coordinatesImage.innerHTML = "";
            setCoordinates(image, args.data, args.colors)
        };

        settingsData.sort((a, b) =>  a.order - b.order);
        for (let i = 0; i < settingsData.length; i++) {
            let setting = settingsData[i];

            let child = printSetting(setting);
            var order = '<input name="order" type="hidden" value="'+setting.order+'" dirname="'+setting.name+'">';
            child.insertAdjacentHTML('beforeend', order);

            container.append(child);
        }

        document.querySelectorAll('.js-dropdown-settings').forEach(function (element, index) {
            element.addEventListener('click', function () {
                this.classList.toggle('active')

                for (const child of this.parentElement.children) {
                    if (child.classList.contains('c-phasmo__coordinates') || child.classList.contains('c-phasmo__coordinates__form')) {
                        child.classList.toggle('hidden');
                    }
                }
            })
        });
    });
}

function printSetting(setting) {
    var li = document.createElement('li');
    li.classList.add('c-settings');

    var parent = document.createElement('div');
    var parentTitle = document.createElement('div');

    parent.classList.add('c-phasmo__settings');
    parent.classList.add('js-dropdown-settings');
    parentTitle.classList.add('c-phasmo__settings__title');
    parentTitle.innerHTML = setting.name;
    parent.append(parentTitle);

    var p = document.createElement('p');
    p.classList.add('c-phasmo__coordinates');
    p.classList.add('hidden');
    p.innerHTML = "Coordenates";

    var coordinates = document.createElement('div');
    coordinates.classList.add('c-phasmo__coordinates__form');
    coordinates.classList.add('hidden');
    var coordinatesChild = document.createElement('div');
    coordinatesChild.classList.add('c-phasmo__coordinates__form__container');

    let inputElementLeft = '<div style="display: flex; flex-direction: column"><label style="color: white; font-size: 25px">Left</label><input type="number" step="100" placeholder="Left" name="left" onchange="onChangeCoordinates(this)" class="c-phasmo__settings__input" value="'+ setting.rectangle.left +'"></div>';
    let inputElementTop = '<div style="display: flex; flex-direction: column"><label style="color: white; font-size: 25px">Top</label><input type="number" step="100" placeholder="Top" name="top" onchange="onChangeCoordinates(this)" class="c-phasmo__settings__input" value="'+ setting.rectangle.top +'"></div>';
    let inputElementWidth = '<div style="display: flex; flex-direction: column"><label style="color: white; font-size: 25px">Width</label><input type="number" step="100" placeholder="Width" name="width" onchange="onChangeCoordinates(this)" class="c-phasmo__settings__input" value="'+ setting.rectangle.width +'"></div>';
    let inputElementHeight = '<div style="display: flex; flex-direction: column"><label style="color: white; font-size: 25px">Height</label><input type="number" step="100" placeholder="Height" name="height" onchange="onChangeCoordinates(this)" class="c-phasmo__settings__input" value="'+ setting.rectangle.height +'"></div>';
    let inputSave = '<a onclick="setSettings(this)" class="c-phasmo__button" style="grid-column: 1 / 3; padding: 5px 0px;" dirname="'+ setting.name +'">Save</a>';

    coordinatesChild.insertAdjacentHTML('beforeend', inputElementLeft);
    coordinatesChild.insertAdjacentHTML('beforeend', inputElementTop);
    coordinatesChild.insertAdjacentHTML('beforeend', inputElementWidth);
    coordinatesChild.insertAdjacentHTML('beforeend', inputElementHeight);
    coordinatesChild.insertAdjacentHTML('beforeend', inputSave);
    coordinates.append(coordinatesChild);

    li.append(parent);
    li.append(p);
    li.append(coordinates);

    return li;
}

function onChangeCoordinates(element) {
    coordinatesImage.innerHTML = "";
    setCoordinatesSingle(image, readInputFields(element))
}

function setCoordinates(img, data, colors) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
        let capture = data[i];
        let coordinates = capture.rectangle;

        ctx.strokeStyle = colors.strokeStyle;
        ctx.lineWidth = colors.lineWidth;
        ctx.font = colors.font;
        ctx.textAlign = colors.textAlign;
        ctx.textBaseline = colors.textBaseline;
        ctx.fillStyle = colors.fillStyle;

        ctx.fillText(capture.name,coordinates.left+(coordinates.width/2),coordinates.top+(coordinates.height/2));
        ctx.rect(coordinates.left, coordinates.top, coordinates.width, coordinates.height);
    }
    ctx.closePath();
    ctx.stroke();

    coordinatesImage.appendChild(canvas);
}

function setCoordinatesSingle(img, coordinates) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ff3333";
    ctx.lineWidth = 6;
    ctx.rect(coordinates.left, coordinates.top, coordinates.width, coordinates.height);
    ctx.stroke();

    coordinatesImage.appendChild(canvas);
}

function readInputFields(element) {
    let data = {};
    let parentElement = element.parentElement.parentElement;
    let childs = parentElement.querySelectorAll('input');

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];

        if (child.classList.contains('c-phasmo__settings__input')) {
            data[child.name] = child.value;
        }
    }

    return data;
}

async function setSettings(element) {
    let coordinates = readInputFields(element);
    coordinates["name"] = element.getAttribute('dirname');

    await window.settings.setSettingsCoordinates(coordinates);
}

async function setSettingsOrder() {
    let ordersInputs = [];

    document.querySelectorAll('input[name=order]').forEach(function (element, index) {
        ordersInputs[index] = {
            order: element.value,
            name: element.getAttribute('dirname')
        };
    });

    await window.settings.setSettingsOrder(ordersInputs);
}

async function setColors() {
    let colors = [];

    document.querySelectorAll('#form-colors input').forEach(function (element, index) {
        colors[index] = {
            value: element.value,
            name: element.getAttribute('name')
        };
    });

    await window.colors.setColors(colors);
}


addEventListener("load", async (event) => {
    await getSettings();
    await getColors();
});

document.getElementById('save-settings-order').addEventListener('click', setSettingsOrder);
document.getElementById('save-colors').addEventListener('click', setColors);
