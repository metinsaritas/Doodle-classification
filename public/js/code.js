
window.onload = start;

window.onkeydown = (event) => {
    switch (event.key) {
        case "r": 
        let bRandom = document.querySelector("button.random")
        if (bRandom) bRandom.click()
        return; 
    case "c": return handleClear()
    case "g": return handleGuess()
    case "a": return handleTrain()
    case "t": return handleTest()
    }
}

let TOTAL_DATA = 1000;
let THRESHOLD_RATIO = 0.8;
let LENGTH = 28 * 28; // 784

let CLOCK = 0, CLOUD = 1, APPLE = 2;
let clocksData, cloudsData, applesData;
let clocks = {}, clouds = {}, apples = {};

let nn = new NeuralNetwork(784, 64, 3);

let training = [];
let testing = [];

async function start () {
    clocksData = await getBytes('./data/clockData.bin')
    cloudsData = await getBytes('./data/cloudData.bin')
    applesData = await getBytes('./data/appleData.bin')


    prepareData(clocks, clocksData, CLOCK)
    prepareData(clouds, cloudsData, CLOUD)
    prepareData(apples, applesData, APPLE)

    training = [...clocks.training, ...clouds.training, ...apples.training];
    testing = [...clocks.testing, ...clouds.testing, ...apples.testing];

    
    document.querySelector("button.random").click();
    //train();
}

async function getBytes (path) {
    let f = await fetch(path)
    let ab = await f.arrayBuffer()
    return new Uint8Array(ab)
}

function prepareData (category, data, label) {
    Object.assign(category, {training: [], testing: []})
    for (let i = 0; i < TOTAL_DATA; i++) {
        let offset = i * LENGTH;
        let threshold = Math.floor(THRESHOLD_RATIO * TOTAL_DATA)
        
        if (i < threshold) {
            category.training[i] = data.subarray(offset, offset + LENGTH)
            category.training[i].label = label
            continue;
        }

        category.testing[i - threshold] = data.subarray(offset, offset + LENGTH)
        category.testing[i - threshold].label = label
    }
}

function handleTrain () {
    console.log("Training...");
    shuffle(training, true);
    training.forEach((data, i) => {
        let inputs = Array.from(data).map(x => x/255)
        let targets = [0, 0, 0];
        targets[data.label] = 1;

        nn.train(inputs, targets)
    })
    console.log("Finished.");
}

function testAll (testing) {
    let correct = 0;

    testing.forEach((data, key) => {
        let inputs = Array.from(data).map(x => x/255)
        let guess = nn.predict(inputs)

        let m = Math.max(...guess)
        let classification = guess.indexOf(m)

        if (classification == data.label) correct++;
    })

    let percent = 100 * correct / testing.length;
    return percent;
}

function handleTest () {
    let percent = testAll(testing);
    console.log("Percent: " + nf(percent, 2, 2) + "%");
}

function handleGuess () {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < LENGTH; i++) {
      let bright = img.pixels[i * 4];
      inputs[i] = (255 - bright) / 255.0;
    }

    let guess = nn.predict(inputs);
    let m = Math.max(...guess);
    let classification = guess.indexOf(m);
    if (classification === CLOUD) {
      console.log("It's a Cloud 🌨️");
    } else if (classification === CLOCK) {
      console.log("It's a Clock 🕑");
    } else if (classification === APPLE) {
      console.log("It's an Apple 🍎");
    }
}

function handleClear () {
    background(255);
}

