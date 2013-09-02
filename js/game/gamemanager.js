/* GAME MANAGER ***************************************************************
Simple manager to handle input and updating everything
******************************************************************************/

function GameManager() {
	//object initialisation
	this.device = new Device();

	//timing and state
	//sub is either null or a function to change the main update depending on the game state
	this.sub = null;
	this.sub_end = false;
	this.sub_state = 0;
	this.sub_resumeTime = 0; //use this to add delays

	this.setSub(null);
}

GameManager.prototype.update = function() {
	//handle keyboard and mouse input
	this.updateInput();

	//updates the current sub routine
	this.updateSub();

	//always call all other updates here
	this.device.update();

	//debug functions
	if (g_KEYSTATES.isPressed( KEYS.SHIFT ) &&  g_KEYSTATES.justPressed( KEYS.P) ) {
		console.log(this.device.board.serializeData());		
	}
}

GameManager.prototype.updateInput = function() {
}

GameManager.prototype.draw = function(ctx, xofs, yofs) {
}

GameManager.prototype.drawDebug = function(ctx, xofs, yofs) {
	 //anything not on layer 0 needs to be drawn in here for debug to work
	 this.device.drawDebug(ctx, xofs, yofs);
}

GameManager.prototype.addDrawCall = function() {
	this.device.addDrawCall();

	//to support debug drawing for non layer 0 objects, this needs adding
	g_RENDERLIST.addObject(this, 0, 0, false);
}

// SUBROUTINES //

GameManager.SUB_main = function() {
	switch (this.sub_state) {
		case 0:
			break;
		default:
			this.sub_end = true;
	}
}

GameManager.prototype.updateSub = function() {
	if (this.sub !== null) {
		//don't call the sub if it is asleep
		if (g_GAMETIME_MS - this.sub_resumeTime < 0) {
			return;
		}

		//check the state
		if (this.sub_end) {
			this.sub = null;
		} else {
			this.sub.call(this);
		}
	}
}

GameManager.prototype.setSub = function(sub) {
	this.sub = sub;
	this.sub_state = 0;
	this.sub_end = false;
}

// sleep for time ms and increment the state for when the sleep is over
GameManager.prototype.sub_sleep = function(time) {
	this.sub_resumeTime = g_GAMETIME_MS + Math.abs(time);
	this.sub_state += 1;
}

//END OF SUBROUTINES //