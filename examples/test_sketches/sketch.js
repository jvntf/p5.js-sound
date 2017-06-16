/**
 *  Example: Apply a p5.LowPass filter to a p5.SoundFile.
 *  Visualize the sound with FFT.
 *  Map mouseX to the the filter's cutoff frequency
 *  and mouseY to resonance/width of the a BandPass filter
 */

var soundFile;
var fft;

var description = 'loading';
var p;

//var eq, Freq, filterRes;
var noise, eq, gain1,gain2,gain3,gain4;
function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('../files/beat');
}

function setup() {
  createCanvas(710, 256);
  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();
    soundFile.disconnect();



  eq = new p5.EQ();


  // Disconnect soundfile from master output.
  // Then, connect it to the filter, so that we only hear the filtered sound
  // noise = new p5.Noise();
  // noise.disconnect();
  eq.process(soundFile);
  // noise.amp(0.1);
  // noise.start();

  fft = new p5.FFT();

  // update description text
  p = createP(description);
  var p2 = createP('Draw the array returned by FFT.analyze( ). This represents the frequency spectrum, from lowest to highest frequencies.');

 
   

}

function draw() {
  background(30);
  

  // Map mouseX to a the cutoff frequency for our lowpass filter
  // filterFreq = map (mouseX, 0, width, 10, 22050);
  // // Map mouseY to resonance/width
  // filterRes = map(mouseY, 0, height, 15, 5);
  // // set filter parameters
  // filter.set(filterFreq, filterRes);

    // if (keyIsDown(BACKSPACE)){
    //   console.log(eq.one.output.gain.value);
    // }


    gain1 = gain2 = gain3 = gain4 = 0;


  if (keyIsDown(LEFT_ARROW)){
    gain1 = -40;
    
    
  }

    if (keyIsDown(DOWN_ARROW)){
    gain2 = -40;
    // = map(mouseY, 0, 256, 1, -1);
   
    
    
  }

    if (keyIsDown(UP_ARROW)){
    gain3 = -40;
    //= map(mouseY, 0, 256, 1, -1);
    
    
    
  }

    if (keyIsDown(RIGHT_ARROW)){
    gain4 = -40;
    // = map(mouseY, 0, 256, 1, -1);
    
  }
 


    eq.setBand(1,"gain",gain1);
    eq.setBand(2,"gain",gain1);
     eq.setBand(3,"gain",gain2);
     eq.setBand(4,"gain",gain2);
     eq.setBand(5,"gain",gain3);
     eq.setBand(6,"gain",gain3);
     eq.setBand(7,"gain",gain4);
     eq.setBand(8,"gain",gain4);


  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy / amplitude at that frequency
  var spectrum = fft.analyze();
  noStroke();
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width/spectrum.length, h) ;
  }

  updateDescription();
}


// Change description text if the song is loading, playing or paused
function updateDescription() {
    description = 'gain1 ' + gain1 + '\ngain2 ' + gain2 + '\ngain3 ' + gain3 + '\ngain4 ' + gain4;
    p.html(description);
}