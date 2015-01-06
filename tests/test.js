define([
    '../src/FSM',
    '../src/State'
], function(
    FSM,
    State
){
	console.log('//////////////// RUN TEST PROGRAM ////////////////');


	var s = new State('Pensado');
	s.addTransition('goto_banana', 'banana')
	.onExit(function() {
		console.log('snazzy exit');
	})
	.onEnter(function() {
		console.log('grandiose entry of MR PENSADO!!!');
	});

	var fsm = new FSM({
		startState: s
	});

	// Add a state to the fsm
	fsm.createState('banana')
	.onEnter(function() {
		console.log('onentered the banana');
	});

	console.log(fsm.state);
	fsm.triggerEvent('goto_banana');
	console.log(fsm.state);
	console.log(fsm.states);
});