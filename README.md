# Erstellt ein Audio-Effekte Tool, bei dem  eine Sound Datei abgespielt und mit verschiedenen Effekten manipuliert werden kann. Implementiert Gain, StereoPanning und Delay sowie einen Reverb, Compressor, Filter und Distortion Effekt.

Eine Live-Demo der Aufgabe werdet ihr hier finden: https://jakobsudau.github.io/AVPRG/Aufgaben/AufgabeA2/index.html

Tipp: Nutzt das HTML Input Element von type=range, nutzt eine GainNode, StereoPannerNode und DelayNode. Ladet einen Sound wie in Aufgabe 5, den man über einen HTML Button Element abspielen kann.

Beispielcode: erstellt eine StereoPannerNode
```
let context = new AudioContext();
let oscillatorNode = context.createOscillator();
let stereoPanner = context.createStereoPanner();

stereoPanner.pan.value = -0.5;

oscillatorNode.connect(stereoPanner);
stereoPanner.connect(context.destination);

oscillatorNode.start(context.currentTime);
oscillatorNode.stop(context.currentTime +1);
```

Beispielcode: erstellt eine DelayNode
```
let context = new AudioContext();
let audio = new Audio("path/to/your/sound.wav");
let source = context.createMediaElementSource(audio);
let delay = context.createDelay(4.0);

delay.delayTime.value = 2.0;

source.connect(delay);
delay.connect(context.destination);

audio.play();
```

Beispielcode: erstellt eine GainNode
```
let context = new AudioContext();
let oscillatorNode = context.createOscillator();
let gainNode = context.createGain();

oscillatorNode.connect(gainNode);
gainNode.connect(context.destination);

gainNode.gain.value = 0.3;
            
oscillatorNode.start(context.currentTime);
oscillatorNode.stop(context.currentTime + 1);
```

Beispielcode: erstellt eine ConvolverNode, lädt die Impulse Response File über einen fetch request (wie bei der AudioBufferSourceNode)
```
let context = new AudioContext();
let sound = new Audio("path/to/your/sound.wav");
let source = context.createMediaElementSource(sound);
let convolver = context.createConvolver();

source.connect(convolver);
convolver.connect(context.destination);

fetch("impulseResponses/church.wav")
     .then(response => response.arrayBuffer())
     .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
     .then(audioBuffer => {
          convolver.buffer = buffer;
          convolver.normalize = true;
     })
     .catch(console.error);
     
sound.play();
```

Beispielcode: erstellt eine DynamicsCompressorNode
```
let context = new AudioContext();
let sound = new Audio("path/to/your/sound.wav");
let source = context.createMediaElementSource(sound);
let compressor = context.createDynamicsCompressor();

source.connect(compressor);
compressor.connect(context.destination);

compressor.threshold.value = -70;
compressor.ratio.value = 12;
compressor.knee.value = 15;
compressor.attack.value = 0.16;
compressor.release.value = 0.55;

sound.play();
```

Beispielcode: erstellt eine BiquadFilterNode
```
let context = new AudioContext();
let sound  = new Audio("path/to/your/sound.wav");
let source = context.createMediaElementSource(sound);
let filter = context.createBiquadFilter();
source.connect(filter);
filter.connect(context.destination);

filter.type = "lowpass";
filter.frequency.value = 500;
filter.detune.value = 30;
filter.Q.value = 1;
filter.gain.value = 25;

sound.play();
```

Beispielcode: erstellt eine WaveShaperNode
```
let context = new AudioContext();
let sound = new Audio("path/to/your/sound.wav");
let source = context.createMediaElementSource(sound);
let distortion = context.createWaveShaper();

source.connect(distortion);
distortion.connect(context.destination);

distortion.curve = makeDistortionCurve(200);
distortion.oversample = "4x";

sound.play();
```

Beispielcode: Funktion zur Berechnung einer Sigmoid Kurve (Parameter: Integer mit der Stärke der Sigmoid-Funktion, Return: ein Array mit allen Werten der Sigmoid-Funktion von -1 bis 1, das return value ist ein Array mit n_samples Anzahl von Werten)
```
function makeDistortionCurve(amount) {    
    let n_samples = 44100,
        curve = new Float32Array(n_samples);
    
    for (var i = 0; i < n_samples; ++i ) {
        var x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + (amount * Math.abs(x)));
    }
    
    return curve;
};
```