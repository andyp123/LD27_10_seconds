/* BOARDCELLINDEX ************************************************************/

function BoardCellIndex(x, y) {
	this.x = (x !== undefined) ? x : -1;
	this.y = (y !== undefined) ? y : -1;
}

BoardCellIndex.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

BoardCellIndex.prototype.equals = function(cell_index) {
	this.x = cell_index.x;
	this.y = cell_index.y;
}

BoardCellIndex.prototype.addXY = function(dx, dy) {
	this.x += dx;
	this.y += dy;
}

BoardCellIndex.prototype.outOfBounds = function() {
	return (this.x < 0 || this.y < 0);
}

BoardCellIndex.prototype.toString = function() {
	return "{ \"x\":" + this.x + ",\"y\":" + this.y + "}"
}

/* BOARD *********************************************************************/

function Board(posx, posy) {
	this.pos = new Vector2(posx, posy);

	var data = {
		cell_size_x: 64,
		cell_size_y: 64,
		cells_x: 9,
		cells_y: 6,
		cells: [],
		start: new BoardCellIndex(0, 0),
		exit: new BoardCellIndex(1, 0)
	};
	this.cell_frames = [];
	var size = data.cells_x * data.cells_y;
	for (var i = 0; i < size; ++i) {
		data.cells[i] = 1;
		this.cell_frames[i] = 0;
	}
	this.data = data;

	this.sprite_cells = new Sprite(g_ASSETMANAGER.getAsset("CELLS"), 4, 4);
	this.sprite_exit = new Sprite(g_ASSETMANAGER.getAsset("EXIT"), 2, 1);
	this.mouse_index = new BoardCellIndex();
	this.edit_cell_type = 1;
}

Board.prototype.getCellFrame = function(x, y) {
	var data = this.data;

	var i = x + y * data.cells_x;
	if(data.cells[i] == 1) return 0; //solid block uses frame 0
	var cell_t = (y > 0)				? data.cells[x + (y - 1) * data.cells_x] : 1;
	var cell_b = (y < data.cells_y - 1) ? data.cells[x + (y + 1) * data.cells_x] : 1;
	var cell_l = (x > 0)				? data.cells[i - 1] : 1;
	var cell_r = (x < data.cells_x - 1) ? data.cells[i + 1] : 1;
	var frame = cell_t + cell_r * 2 + cell_b * 4 + cell_l * 8;
	if (frame == 0) return -1;

	return frame;
}

Board.prototype.updateCellFrames = function() {
	var data = this.data;
	var x, y, i;
	for (y = 0; y < data.cells_y; ++y) {
		for (x = 0; x < data.cells_x; ++x) {
			i = x + y * data.cells_x;
			this.cell_frames[i] = this.getCellFrame(x, y);
		}
	}
}

Board.prototype.tryMove = function(dx, dy, a_cell_index) {
	if (a_cell_index.outOfBounds()) return false;
	var x = a_cell_index.x + dx;
	var y = a_cell_index.y + dy;

	var data = this.data;
	if (x < 0 || x >= data.cells_x) return false;
	if (y < 0 || y >= data.cells_y) return false;
	var i = x + y * data.cells_x;
	if (data.cells[i]) return false;

	a_cell_index.set(x, y);
	return true;
}

Board.prototype.tryTouch = function(x, y) {
	var data = this.data;
	if (data.exit.x == x && data.exit.y == y) {
		return "exit";
	}

	return "";
}

Board.prototype.getTilePosition = function(x, y, a_pos) {
	var data = this.data;
	a_pos.set(x * data.cell_size_x, y * data.cell_size_y);
	a_pos.add(this.pos);
}

Board.prototype.updateInput = function() {
	var mouse = g_MOUSE;
	var camera = g_CAMERA;
	var data = this.data;

	var xrel = Math.floor(mouse.x - this.pos.x + camera.pos.x + data.cell_size_x * 0.5);
	var yrel = Math.floor(mouse.y - this.pos.y + camera.pos.y + data.cell_size_y * 0.5);
	var x = -1;
	var y = -1;
	var w = data.cells_x * data.cell_size_x;
	var h = data.cells_y * data.cell_size_y;
	if (xrel >= 0 && xrel < w) x = Math.floor(xrel / w * data.cells_x);
	if (yrel >= 0 && yrel < h) y = Math.floor(yrel / h * data.cells_y);
	this.mouse_index.set(x, y);
}

Board.prototype.updateEdit = function() {
	var data = this.data;
	var mi = this.mouse_index;
	if (!mi.outOfBounds())
	{
		var i = mi.x + mi.y * data.cells_x;
		var cell_type = data.cells[i];
		if (g_MOUSE.left.isPressed()) {
			data.cells[i] = (g_KEYSTATES.isPressed( KEYS.CTRL )) ? 0 : 1;
			this.updateCellFrames();
		}
		if (g_KEYSTATES.justPressed( KEYS.Z )) {
			data.start.equals(mi);
		}
		if (g_KEYSTATES.justPressed( KEYS.X )) {
			data.exit.equals(mi);
		}
	}
}

Board.prototype.update = function() {
	this.updateInput();

	if (g_DEBUG) this.updateEdit();
}

Board.prototype.draw = function(ctx, xofs, yofs) {
	var data = this.data;
	var x, y, i;
	for (y = 0; y < data.cells_y; ++y) {
		for (x = 0; x < data.cells_x; ++x) {
			i = x + y * data.cells_x;
			var frame = this.cell_frames[i];
			if (frame > -1) {
				var xpos = x * data.cell_size_x + this.pos.x + xofs;
				var ypos = y * data.cell_size_y + this.pos.y + yofs;
				this.sprite_cells.draw(ctx, xpos, ypos, frame);
			}
		}
	}

	if (!data.exit.outOfBounds()) {
		var xpos = data.exit.x * data.cell_size_x + this.pos.x + xofs;
		var ypos = data.exit.y * data.cell_size_y + this.pos.y + yofs;
		this.sprite_exit.draw(ctx, xpos, ypos, 1);
	}
}

Board.prototype.drawDebug = function(ctx, xofs, yofs) {
	var data = this.data;
	var mi = this.mouse_index;
	if (!mi.outOfBounds()) {
		xpos = mi.x * data.cell_size_x + this.pos.x + xofs;
		ypos = mi.y * data.cell_size_y + this.pos.y + yofs;
		this.sprite_cells.draw(ctx, xpos, ypos, 15);
	}
}

Board.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0);
}

Board.prototype.loadData = function(a_data) {
	var data = this.data;
	data.cells_x = a_data.cells_x || 9;
	data.cells_y = a_data.cells_y || 6;
	data.cell_size_x = a_data.cell_size_x || 64;
	data.cell_size_y = a_data.cell_size_y || 64;
	data.start.set(a_data.start.x, a_data.start.y);
	data.exit.set(a_data.exit.x, a_data.exit.y);
	data.cells = [];
	for (var i = 0; i < a_data.cells.length; ++i) {
		data.cells[i] = a_data.cells[i];
	}
	this.updateCellFrames();
}

Board.prototype.serializeData = function() {
	var data = this.data;
	var s = "{\n";
	s += "\t\"start\": " + data.start.toString() + ",\n";
	s += "\t\"exit\": " + data.exit.toString() + ",\n";
	s += "\t\"cells\": [\n";
	
	var x, y, i;
	for (y = 0; y < data.cells_y; ++y) {
		var row = "";
		for (x = 0; x < data.cells_x; ++x) {
			i = x + y * data.cells_x;
			row += data.cells[i] + ",";
		}
		if ( y == data.cells_y - 1) row = row.substring(0, row.length - 1);
		s += "\t\t" + row + "\n";
	}
	
	s += "\t]\n";
	s += "};";

	return s;
}