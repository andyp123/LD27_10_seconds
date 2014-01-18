/* PLAYER ********************************************************************/

function Player(board) {
	this.input = {
		"MOVE_UP":    new ButtonState(),
		"MOVE_DOWN":  new ButtonState(),
		"MOVE_LEFT":  new ButtonState(),
		"MOVE_RIGHT": new ButtonState()
	};

	this.cell_index = new BoardCellIndex();
	this.sprite = new Sprite(g_ASSETMANAGER.getAsset("PLAYER"), 3, 1);
	this.sprite_frame = 0;
	this.board = board;
	this.keys = 0;
	this.clocks = 0;
}

Player.prototype.gotoStart = function() {
	if (this.board !== null) {
		this.board.findCellOfType(Board.CELL_TYPE_START, this.cell_index);
	}
}

Player.prototype.resetState = function() {
	this.sprite_frame = 0;
	this.keys = 0;
	this.clocks = 0;
}

Player.prototype.update = function() {
	var input = this.input;
	var dx = 0;
	var dy = 0;
	if (input["MOVE_LEFT"].justPressed()) dx -=1;
	if (input["MOVE_RIGHT"].justPressed()) dx +=1;
	if (input["MOVE_DOWN"].justPressed()) dy -=1;
	if (input["MOVE_UP"].justPressed()) dy +=1;

	if (dx || dy) {
		var move_type = this.board.tryMove(dx, dy, this.cell_index, this.keys);
		if (move_type > 0) {
			if (move_type == Board.MOVE_GET_CLOCK) {
				this.clocks += 1;
				g_SOUNDMANAGER.playSound("GET_CLOCK");
			} else if (move_type == Board.MOVE_GET_KEY) {
				this.keys += 1;
				this.sprite_frame = 2; //key
				g_SOUNDMANAGER.playSound("GET_KEY");
			} else if (move_type == Board.MOVE_OK_UNLOCK) {
				this.keys -= 1;
				if (this.keys == 0) this.sprite_frame = 0;
				g_SOUNDMANAGER.playSound("USE_KEY");
			} else g_SOUNDMANAGER.playSound("MOVE");
			if (this.keys == 0) this.sprite_frame = (this.sprite_frame == 1) ? 0 : 1;
		} else {
			g_SOUNDMANAGER.playSound("MOVE_FAIL");
		}
	}
}

Player.prototype.draw = function(ctx, xofs, yofs) {
	var ci = this.cell_index;
	if (!ci.outOfBounds()) {
		var vector_pool = g_VECTORSCRATCH;
		vector_pool.use();
			var pos = vector_pool.get().zero();
			this.board.getTilePosition(ci.x, ci.y, pos);
			this.sprite.draw(ctx, pos.x + xofs, pos.y + yofs, this.sprite_frame);
		vector_pool.done();
	}
}

Player.prototype.drawDebug = function(ctx, xofs, yofs) {

}