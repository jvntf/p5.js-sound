var monoSynth;
var note;
var octave = 0;

function setup() {
  monoSynth = new p5.MonoSynth();
  monoSynth.loadPreset('punchyBass');
}

function keyPressed() {
 // monoSynth.triggerAttack(keyToMidi() + octave, 1 )
 
     

  //OCTAVEf
  if (keyCode === UP_ARROW) {
  	octave +=12;
  } else if (keyCode === DOWN_ARROW) {
  	octave -=12;
  }
  else {
  monoSynth.play(keyToMidi() + octave, 1); 

  }
} 

// function keyReleased() {
//   monoSynth.triggerRelease();
// }


function keyToMidi() {
	switch (key) {
		case 'A':
		return 60;

		case 'S':
		return 62;
	
		case 'D':
		return 64;

		case 'F':
		return 65;

		case 'G':
		return 67;

		case 'H':
		return 69;

		case 'J':
		return 71;

		case 'K':
		return 72;

	}

}