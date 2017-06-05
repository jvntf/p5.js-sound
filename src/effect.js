define(function (require) {
	'use strict';

	var p5sound = require('master');
	var CrossFade = require('Tone/component/CrossFade');

	p5.Effect = function() {
		//everything points to the same audiocontext
		
		this.ac = p5sound.audiocontext;

		//wrap each node in gain nodes
		this.input = this.ac.createGain();
		this.output = this.ac.createGain();

		//Change _drywet.fade inorder to mix between signals
		this._drywet = new CrossFade();

		//Extend Effect by connecting an effect node
		//to the wet node
		this.wet = this.ac.createGain();



		this.input.connect(this._drywet.a);
		this.wet.connect(this._drywet.b);
		this._drywet.connect(this.output);


		this.connect();

		//Add to the soundArray
		p5sound.soundArray.push(this);
	};


	p5.Effect.prototype.connect = function (unit) {
		var u = unit || p5.soundOut.input;
		this.output.connect(u.input ? u.input : u);
	};

	p5.Effect.prototype.disconnect = function() {
		this.output.disconnect();
	};



	//effects necessary for all effects


	// //set up the connection to src and output
	// p5.Effect.prototype.process = function(src, amt) {
	// 	src.connect(this.input);

	//effects necessary for all effects


	// //set up the connection to src and output
	// p5.Effect.prototype.process = function(src, amt) {
	// 	src.connect(this.input);

	// 	//set the wetdry value
	// 	//this.wetdry(amt);
	// };


	//effects necessary for all effects

	// p5.Effect.prototype.disconnect = function() {
	// 	this.out.disconnect();
	// };


	p5.Effect.prototype.drywet = function(fade){
			this._drywet.fade.value = fade;
	};

	p5.Effect.prototype.dispose = function() {
		var index = p5sound.soundArray.indexOf(this);
		p5sound.soundArray.splice(index, 1);

		this.input.disconnect();
		this.input = undefined;

		this.output.disconnect();
		this.output = undefined;

		this.ac = undefined;
	};


	//effects necessary for all effects


	// //set up the connection to src and output
	// p5.Effect.prototype.process = function(src, amt) {
	// 	src.connect(this.input);

	// 	//set the wetdry value
	// 	//this.wetdry(amt);
	// };


	//sets wet dry value, input double between 0 and 1
	// p5.Effect.prototype.wetdry = function(value) {
	// 	//eventually implement cross fading like Tone.js

	// 	//for now

	// 	this.dry.value = 1-value;
	// 	this.wet.value = 1;
	// };

	//could link together a bunch of nodes
	//TODO: find out how to have an open ended number of arguments
	// p5.Effect.prototype.chain = function(...nodes){
		
	// 	put arg list into array
	// 	this.output.connect(nodes[i])
		
	// 	for each, 
	// 		nodes[i].connect(nodes[i+1])
		
	// 	this.output.connect(nodes[0]);
	// 	for (i = 1; i<nodes.length; i++){
	// 		nodes[i-1].connect(nodes[i]);
	// 	}

	// };


	//could link together a bunch of nodes
	//TODO: find out how to have an open ended number of arguments
	// p5.Effect.prototype.chain = function(...nodes){
		
	// 	put arg list into array
	// 	this.output.connect(nodes[i])
		
	// 	for each, 
	// 		nodes[i].connect(nodes[i+1])
		
	// 	this.output.connect(nodes[0]);
	// 	for (i = 1; i<nodes.length; i++){
	// 		nodes[i-1].connect(nodes[i]);
	// 	}

	// };

	return p5.Effect;

});







