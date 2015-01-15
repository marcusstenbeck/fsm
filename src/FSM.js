define(['./State'], function(State) {
	'use strict';

	/**
	 * State machine. It changes states, and it runs the enter and exit actions in the states.
	 *
	 * param.startState {State} The starting state. Default: new State('init')
	 * param.states {[State]} An array of states
	 *
	 */
	function FSM(params) {
		if(!params) params = {};
		this.owner = params.owner || null;
		this.state = params.startState || new State('init');
		this.states = params.states || [this.state];

		// Run starting states entry actions
		this.enterState(this.state.name);
	}

	FSM.prototype.triggerEvent = function(eventName) {
		// Check if current state will exit on this event

		var nextStateName = this.state.transitions[eventName];

		// No transition? Then warn and gettouttahere!
		if(!nextStateName) {
			console.warn('State', this.state.name, 'has no transition for event', eventName);
			return this;
		}

		this.enterState(nextStateName);

		return this;
	};
	
	FSM.prototype.createState = function(name) {
		var state = new State(name);
		this.states.push(state);
		return state;
	};
	
	FSM.prototype.deleteState = function(stateName) {
		if(typeof this.states[stateName] === 'object') delete this.states[stateName];
	};

	FSM.prototype.enterState = function(nextStateName) {
		if(this.state.name === nextStateName) return;

		for(var i = 0; i < this.states.length; i++) {
			if(this.states[i].name === nextStateName) {
				
				// perform the exit actions of current state
				for(var j = 0; j < this.states[i].actions.onExit.length; j++) {
					if(typeof this.states[i].actions.onExit[j] === 'function') this.states[i].actions.onExit[j](this.owner);
				}

				// Switch to next state
				this.state = this.states[i];

				// perform the entry actions of current state
				for(j = 0; j < this.states[i].actions.onEnter.length; j++) {
					if(typeof this.states[i].actions.onEnter[j] === 'function') this.states[i].actions.onEnter[j](this.owner);
				}

				return;
			}
		}

		// Couldn't find the state...
		console.error('State', this.state.name, 'could not transition to state', nextStateName, ': It does not exist');
		return this;
	};

	return FSM;
});