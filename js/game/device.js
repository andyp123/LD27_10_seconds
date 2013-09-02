/* DEVICE ********************************************************************/

function Device() {
	this.sprite_background = new Sprite(g_ASSETMANAGER.getAsset("BACKGROUND"));
	this.sprite_screen_back = new Sprite(g_ASSETMANAGER.getAsset("SCREEN_BACK"));
	this.sprite_screen_overlay = new Sprite(g_ASSETMANAGER.getAsset("SCREEN_OVERLAY"));
	this.sprite_screen_border = new Sprite(g_ASSETMANAGER.getAsset("SCREEN_BORDER"));
	this.sprite_button_green = new Sprite(g_ASSETMANAGER.getAsset("BUTTON_GREEN"), 2, 1);
	this.sprite_button_red = new Sprite(g_ASSETMANAGER.getAsset("BUTTON_RED"), 2, 1);

	this.sprite_background.setOffset(Sprite.ALIGN_TOP_LEFT);
	this.sprite_screen_back.setOffset(Sprite.ALIGN_TOP_LEFT, 64, 64);
	this.sprite_screen_overlay.setOffset(Sprite.ALIGN_TOP_LEFT, 64, 64);
	this.sprite_screen_border.setOffset(Sprite.ALIGN_TOP_LEFT);

	this.board = new Board(128, 128);
	this.board.loadData( g_STAGES[0] );

	this.player = new Player(this.board);
	this.player.cell_index.set(0, 0);

	this.wave = new Wave(96, 96, 672, 480, 64);

	//controls
	this.controls = {
		buttons: []
	};
	var buttons = this.controls.buttons;
	var button_offset_x = 176;
	var button_offset_y = 608;
	var buttons_x = 2;
	for (var i = 0; i < buttons_x; ++i)
	{
		buttons[i] = new Button(this.sprite_button_green, i * 96 + button_offset_x, button_offset_y, 32);
	}
	for (var i = 0; i < buttons_x; ++i)
	{
		buttons[i + buttons_x] = new Button(this.sprite_button_red, i * 96 + button_offset_x, 96 + button_offset_y, 32);
	}
	this.randomizeControls();
}

Device.prototype.randomizeControls = function() {
	var buttons = this.controls.buttons;
	var input = this.player.input;

	var available_buttons = [];
	for(var i = 0; i < buttons.length; ++i) available_buttons[i] = i;
	
	for (control_id in input) {
		//bind button to control
		var button_id = available_buttons[ Math.round( Math.random() * (available_buttons.length - 1)) ];
		input[control_id] = buttons[button_id];
		//buttons[button_id].enable();

		//remove button_id from available_buttons
		var index = available_buttons.indexOf(button_id);
		available_buttons.splice(index, 1);
	}
	for (var i = 0; i < available_buttons.length; ++i) {
		//buttons[available_buttons[i]].disable();
	}
}

Device.prototype.update = function() {
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].update();
	}
	this.player.update();
	this.board.update();
	this.wave.update();

	if (g_DEBUG && g_KEYSTATES.justPressed( KEYS.Z ) && !this.board.mouse_index.outOfBounds()) {
		this.player.cell_index.equals(this.board.mouse_index);
	}
}

Device.prototype.draw = function(ctx, xofs, yofs) {
	this.sprite_background.draw(ctx, xofs, yofs, 1);
	this.sprite_screen_back.draw(ctx, xofs, yofs, 1);
	
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].draw(ctx, xofs, yofs);
	}
}

Device.prototype.drawDebug = function(ctx, xofs, yofs) {
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].drawDebug(ctx, xofs, yofs);
	}
}

Device.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, -1, 0);
	g_RENDERLIST.addObject(this.board, 0, 0);
	g_RENDERLIST.addObject(this.player, 0, 0);
	//g_RENDERLIST.addObject(this.wave, 0, 5);
	g_RENDERLIST.addObject(this.sprite_screen_overlay, 1, 0);
	g_RENDERLIST.addObject(this.sprite_screen_border, 1, 1);
}