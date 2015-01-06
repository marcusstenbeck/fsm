define(['./State'], function(State) {
	/**
	 * State machine. It changes states, and it runs the enter and exit actions in the states.
	 *
	 * param.startState {State} The starting state. Default: new State('State 1')
	 * param.states {[State]} An array of states
	 *
	 */
	function FSM(params) {
		if(!params) params = {};
		this.owner = params.owner || null;
		this.state = params.startState || new State('State 1');
		this.states = params.states || [this.state];

		// Run starting states entry actions
		this.enterState(this.state.name);
	}

	FSM.prototype.triggerEvent = function(eventName) {
		// Check if current state will exit on this event

		var nextState = this.state.transitions[eventName];

		// No transition? Then warn and gettouttahere!
		if(!nextState) {
			console.warn('State', this.state.name, 'has no transition for event', eventName);
			return this;
		}

		this.enterState(nextState.name);

		return this;
	};
	
	FSM.prototype.createState = function(name) {
		var state = new State(name);
		this.states.push(state);
		return state;
	};
	
	FSM.prototype.deleteState = function(stateName) {
		if(typeof this.states[stateName] === 'Object') delete this.states[stateName];
	};

	FSM.prototype.enterState = function(nextState) {
		if(this.state.name == nextState) return;

		for (var i = this.states.length - 1; i >= 0; i--) {
			if(this.states[i].name == nextState) {
				
				// perform the exit actions of current state
				for (var j = this.state.actions.onExit.length - 1; j >= 0; j--) {
					if(typeof this.state.actions.onExit[j] === 'function') this.state.actions.onExit[j](this.owner);
				};

				// Switch to next state
				this.state = this.states[i];

				// perform the entry actions of current state
				for (var j = this.state.actions.onEnter.length - 1; j >= 0; j--) {
					if(typeof this.state.actions.onEnter[j] === 'function') this.state.actions.onEnter[j](this.owner);
				};

				return;
			}
		};

		// Couldn't find the state...
		console.error('State', this.state.name, 'could not transition to state', nextState, ': It does not exist');
		return this;
	};

	return FSM;
});