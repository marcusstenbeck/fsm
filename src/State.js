define([], function() {
	'use strict';

	/**
	 * A state. It's just data.
	 */
	function State(name) {
		this.name = name || Math.ceil(Math.random()*1000000);
		this.transitions = {};
		this.actions = {
			onEnter: [],
			onExit: []
		};
	}
	State.prototype.addTransition = function(eventName, targetState) {
		this.transitions[eventName] = targetState;
		return this;
	};
	State.prototype.onEnter = function(fn) {
		this.actions.onEnter.push(fn);
		return this;
	};
	State.prototype.onExit = function(fn) {
		this.actions.onExit.push(fn);
		return this;
	};

	return State;
});