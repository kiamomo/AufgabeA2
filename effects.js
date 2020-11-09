let playStopButton = document.querySelector("#playStopButton");
let isPlaying = false;
let reverbOn = true;

let context = new AudioContext();
let sound = new Audio("sound.wav");
let source = context.createMediaElementSource(sound);

let gain = context.createGain();
let stereoPanner = context.createStereoPanner();
let delay = context.createDelay();

let convolver = context.createConvolver();

let compressor = context.createDynamicsCompressor();
let compressorSliders = document.getElementsByClassName("compressorSlider");
let filter = context.createBiquadFilter();
let filterSliders = document.getElementsByClassName("filterSlider");
let selectListFilter = document.querySelector("#selectListFilter");

sound.loop = true;


//Node connections here

source.connect(gain);
gain.connect(stereoPanner);
stereoPanner.connect(delay);
delay.connect(compressor);
compressor.connect(filter);
filter.connect(context.destination);
//convolver.connect(context.destination);

//end Node conntections

for (let i = 0; i < compressorSliders.length; i++) {
    compressorSliders[i].addEventListener("mousemove", changeParameterCompressor)
}

function changeParameterCompressor() {
    switch (this.id) {
        case "thresholdSlider":
            compressor.threshold.value = (this.value - 100);
            document.querySelector("#thresholdOutput").innerHTML = (this.value - 100) + " dB";
            break;
        case "ratioSlider":
            compressor.ratio.value = (this.value / 5);
            document.querySelector("#ratioOutput").innerHTML = (this.value / 5) + " dB";
            break;
        case "kneeSlider":
            compressor.knee.value = (this.value / 2.5);
            document.querySelector("#kneeOutput").innerHTML = (this.value / 2.5) + " degree";
            break;
        case "attackSlider":
            compressor.attack.value = (this.value / 1000);
            document.querySelector("#attackOutput").innerHTML = (this.value / 1000) + " sec";
            break;
        case "releaseSlider":
            compressor.release.value = (this.value / 1000);
            document.querySelector("#releaseOutput").innerHTML = (this.value - 100) + " sec";
            break;
    }
}


for (var i = 0; i < filterSliders.length; i++) {
    filterSliders[i].addEventListener('mousemove', changeParameterFilter, false);
}

selectListFilter.addEventListener("change", function (e) {
    filter.type = selectListFilter.options[selectListFilter.selectedIndex].value;
});

function changeParameterFilter() {
    switch (this.id) {
    case "frequencySlider":
        filter.frequency.value = (this.value);
        document.querySelector("#frequencyOutput").innerHTML = (this.value) + " Hz";
        break;
    case "detuneSlider":
        filter.detune.value = (this.value);
        document.querySelector("#detuneOutput").innerHTML = (this.value) + " cents";
        break;
    case "qSlider":
        filter.Q.value = (this.value);
        document.querySelector("#qOutput").innerHTML = (this.value) + " ";
        break;
    case "filterGainSlider":
        filter.gain.value = (this.value);
        document.querySelector("#filterGainOutput").innerHTML = (this.value) + " dB";
        break;
    }
}


loadImpulseResponse("church");

document.querySelector("#selectListReverb").addEventListener("change", function(e) {
    let name = e.target.options[e.target.selectedIndex].value;
    loadImpulseResponse(name);
});

function loadImpulseResponse(name) {
    fetch("/impulseResponses/" + name + ".wav")
        .then(response => response.arrayBuffer())
        .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
        .then(audioBuffer => {
            if (convolver) {convolver.disconnect();}
            convolver = context.createConvolver();
            convolver.buffer = audioBuffer;
            convolver.normalize = true;
            convolver.connect(context.destination);
        })
        .catch(console.error);
}


document.querySelector("#gainSlider").addEventListener("input", function(e){
    let gainValue = (this.value / 10);
    document.querySelector("#gainOutput").innerHTML = gainValue + " dB";
    gain.gain.value = gainValue;
});

document.querySelector("#panningSlider").addEventListener("input", function (e) {
    let panValue = ((this.value - 50) / 50);
    document.querySelector("#panningOutput").innerHTML = panValue + " LR";
    stereoPanner.pan.value = panValue;
});

document.querySelector("#delaySlider").addEventListener("input", function (e) {
    let delayValue = (this.value / 25);
    document.querySelector("#delayOutput").innerHTML = delayValue + " sec";
    delay.delayTime.value = delayValue;
});


document.querySelector("#reverbButton").addEventListener("click", function(e){
    if (reverbOn) {
        e.target.innerHTML = "On";
        if (filter) {filter.disconnect();}
        filter.connect(convolver);
        convolver.connect(context.destination);
    } else {
        e.target.innerHTML = "Off";
        if (convolver) {convolver.disconnect();}
        filter.connect(context.destination);
    }
    reverbOn = !reverbOn;
});

document.querySelector("#playStopButton").addEventListener("click", function(e){
    if (isPlaying) {
        sound.pause();
        e.target.innerHTML = "Play";
    } else {
        sound.play();
        e.target.innerHTML = "Stop";
    }
    isPlaying = !isPlaying;
});