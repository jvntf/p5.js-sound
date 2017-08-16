define(function (require) {
  'use strict';

  var p5sound = require('master');
  var TimelineSignal = require('Tone/signal/TimelineSignal');
  require('sndcore');

  /**
    *  An AudioVoice is used as a single voice for sound synthesis.
    *  The PolySynth class holds an array of AudioVoice, and deals
    *  with voices allocations, with setting notes to be played, and
    *  parameters to be set. 
    *
    *  @class p5.PolySynth
    *  @constructor
    *  
    *  @param {Number} [synthVoice]   A monophonic synth voice inheriting
    *                                 the AudioVoice class. Defaults ot p5.MonoSynth
    *
    * @param {Number} [polyValue] Number of voices, defaults to 8;
    **/
  p5.PolySynth = function(audioVoice, polyValue) {
    //this.voices = {};

    //this will hold all possible notes and say if they are being played or not
    //this.notes = {};

    //array to hold the voices
    this.audiovoices = [];
    this._voicesInUse = [];

    this.notes = {};

    this._newest = 0;
    this._oldest = 0;


    this.polyValue = polyValue || 8;

    this.AudioVoice = audioVoice === undefined ? p5.MonoSynth : audioVoice;

    this._voicesInUse = new TimelineSignal(0);

    this.allocateVoices();
    p5sound.soundArray.push(this);
  };

  p5.PolySynth.prototype.allocateVoices = function() {
    for(var i = 0; i< this.polyValue; i++) {
      this.audiovoices.push(new this.AudioVoice());
    }
  };

/**
   *  Play a note.
   *  
   *  @method  play
   *  @param  {Number} [note] midi note to play (ranging from 0 to 127 - 60 being a middle C)
   *  @param  {Number} [velocity] velocity of the note to play (ranging from 0 to 1)
   *  @param  {Number} [secondsFromNow]  time from now (in seconds) at which to play
   *  @param  {Number} [sustainTime] time to sustain before releasing the envelope
   */
p5.PolySynth.prototype.play = function (note,velocity, secondsFromNow, susTime){    
    // if (this.voices[note] === null) {
    //   this.voices[note] = new this.AudioVoice();
    // }
    // this.voices[note].env.setRange(velocity,0);
    // this.voices[note]._setNote(note);
    // this.voices[note].play(note,velocity, secondsFromNow, susTime);


   // if(this._voicesInUse.value < this.polyValue) {

   //  var currentVoice = this._voicesInUse.value;

   //  this.noteAttack(currentVoice, note, velocity, secondsFromNow);
   //  this.noteRelease(currentVoice, secondsFromNow + susTime);



   // } else {
   //    if(this.audiovoices[this._oldest]._isOn) {
   //      this.noteRelease(this._oldest);
   //    }


   //  this.noteAttack(this._oldest, note, velocity, secondsFromNow);
   //  this.noteRelease(this._oldest, secondsFromNow + susTime);

   //  this._newest = this._oldest;
   //  this._oldest = ( this._oldest + 1 ) % (this.polyValue - 1);
   // }

   this.noteAttack(note, velocity, secondsFromNow);
   this.noteRelease(note, secondsFromNow + susTime);

   // this.noteAttack(this._newest, note, velocity,secondsFromNow);
   // this.noteRelease(this._newest, secondsFromNow+susTime);
   return this.audiovoices[this._newest];
}


/**
   *  Set values like a traditional
   *  <a href="https://en.wikipedia.org/wiki/Synthesizer#/media/File:ADSR_parameter.svg">
   *  ADSR envelope
   *  </a>.
   *  
   *  It works like other implementation of setADSR in p5.sound but it needs a note parameter
   *  to know which monoSynth should be affected.
   *  
   *  @method  noteADSR
   *  @param {Number} [note]        Midi note on which ADSR should be set.
   *  @param {Number} [attackTime]  Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]   Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   **/

p5.PolySynth.prototype.noteADSR = function (note,a,d,s,r){
   if(this.voices[note] == null){
     this.voices[note] = new this.AudioVoice();   
   }
   this.voices[note]._setNote(note);
   this.voices[note].setADSR(a,d,s,r);   
}

/**
   *  Trigger the Attack, and Decay portion of a MonoSynth.
   *  Similar to holding down a key on a piano, but it will
   *  hold the sustain level until you let go. 
   *
   *  @method  noteAttack
   *  @param  {Number} [note]           midi note on which attack should be triggered.
   *  @param  {Number} [velocity]       velocity of the note to play (ranging from 0 to 1)/
   *  @param  {Number} [secondsFromNow] time from now (in seconds)
   *  
   */  
p5.PolySynth.prototype.noteAttack = function (_note, _velocity, secondsFromNow){ 
  var now =  p5sound.audiocontext.currentTime;
  var tFromNow = secondsFromNow || 0;
  var t = now + tFromNow;

  var note = _note === undefined ?  60 : _note; 
  var velocity = _velocity === undefined ? 1 : _velocity;

  var currentVoice;

  if (this.notes[note] !== undefined) {
    // this.audiovoices[this.notes[note]].triggerRelease();
    this.noteRelease(note,0);
  }


  if(this._voicesInUse.value < this.polyValue) {
    currentVoice = this._voicesInUse.value;
  } else {
    currentVoice = this._oldest;

    // this._newest = this._oldest;
    // 
    var oldestNote = p5.prototype.freqToMidi(this.audiovoices[this._oldest].oscillator.freq().value);
    this.noteRelease(oldestNote);
    this._oldest = ( this._oldest + 1 ) % (this.polyValue - 1);
  }

  this.notes[note] = currentVoice;

  this._voicesInUse.setValueAtTime(this._voicesInUse.value + 1, t);

  this._newest = currentVoice;

  this.audiovoices[currentVoice].triggerAttack(note, velocity, secondsFromNow);

    // if(this.voices[note] == null){
    //    this.voices[note] = new this.AudioVoice();   
    // }
    // this.voices[note]._setNote(note);
    // this.voices[note].env.setRange(velocity,0);
    // this.voices[note].triggerAttack(secondsFromNow);
};

/**
   *  Trigger the Release of a MonoSynth. This is similar to releasing
   *  the key on a piano and letting the sound fade according to the
   *  release level and release time.
   *  
   *  @method  noteRelease
   *  @param  {Number} [note]           midi note on which attack should be triggered.
   *  @param  {Number} [secondsFromNow] time to trigger the release
   *  
   */  

p5.PolySynth.prototype.noteRelease = function (_note,secondsFromNow){
 var note = _note === undefined ? 
      p5.prototype.freqToMidi(this.audiovoices[this._newest].oscillator.freq().value) 
      : _note;

  if (this.notes[_note] === undefined) {
    console.warn('Cannot release a note that is not already playing');
  } else {
    var now =  p5sound.audiocontext.currentTime;
    var tFromNow = secondsFromNow || 0;
    var t = now + tFromNow;

    

    this._voicesInUse.setValueAtTime(this._voicesInUse.value - 1, t);
    this.audiovoices[ this.notes[note] ].triggerRelease(secondsFromNow);
    this.notes[note] = undefined;
    
    this._newest = this._newest === 0 ? 0 : (this._newest - 1) % (this.polyValue - 1);
  }
  
    // if (this.voices[note] != null) {
    //    this.voices[note]._setNote(note);
    //    this.voices[note].triggerRelease(secondsFromNow);
    //    delete this.voices[note];
    // }
}



/**
   *  Set cutoms parameters to a specific synth implementation 
   *  with the help of JavaScript Object Notation (JSON).
   *  
   *  @method  setParams
   *  @param   JSON object  
   * 
   *  For instance to set the detune parameter of a synth, call :
   *  setParams({detune: 15 });
   *
   */  
p5.PolySynth.prototype.noteParams = function (note,params){
  if(this.voices[note] == null){
       this.voices[note] = new this.AudioVoice();   
  }
  this.voices[note].setParams(params);
  
}

});
