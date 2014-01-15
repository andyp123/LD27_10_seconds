/* PLAYER ********************************************************************/

function Player(board) {
	this.input = {
		"MOVE_UP":    new ButtonState(),
		"MOVE_DOWN":  new ButtonState(),
		"MOVE_LEFT":  new ButtonState(),
		"MOVE_RIGHT": new ButtonState()
	};

	this.cell_index = new BoardCellIndex();
	this.sprite = new Sprite(g_ASSETMANAGER.getAsset("PLAYER"), 2, 1);
	this.sprite_frame = 0;
	this.board = board;
}

Player.prototype.update = function() {
	var input = this.input;
	var dx = 0;
	var dy = 0;
	if (input["MOVE_LEFT"].justPressed()) dx -=1;
	if (input["MOVE_RIGHT"].justPressed()) dx +=1;
	if (input["MOVE_DOWN"].justPressed()) dy -=1;
	if (input["MOVE_UP"].justPressed()) dy +=1;

	if ((dx || dy) && this.board.tryMove(dx, dy, this.cell_index)) {
		this.sprite_frame = (this.sprite_frame == 1) ? 0 : 1;
	}

	//touch any entities (this will call the relevant on touch function)
	//this.board.touch(this.cell_index);
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