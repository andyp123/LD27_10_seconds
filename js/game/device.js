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
	this.player.gotoStart();

	this.wave = new Wave(96, 96, 672, 480, 64);
	this.timer = new Timer(520, 560, 10.0);
	this.timer.play_sound = true;

	this.current_stage = 0;
	this.stage_clear = false;
	this.stage_fail = false;

	//controls
	this.controls = {
		buttons: []
	};
	var buttons = this.controls.buttons;
	var button_offset_x = 176;
	var button_offset_y = 608;
	var buttons_x = 3;
	for (var i = 0; i < buttons_x; ++i)
	{
		buttons[i] = new Button(this.sprite_button_green, i * 96 + button_offset_x, button_offset_y, 32);
	}
	for (var i = 0; i < buttons_x; ++i)
	{
		buttons[i + buttons_x] = new Button(this.sprite_button_red, i * 96 + button_offset_x, 96 + button_offset_y, 32);
	}
	this.randomizeControls();
	this.setKeys();
}

Device.prototype.setKeys = function() {
	var buttons = this.controls.buttons;
	buttons[0].key = KEYS.Q;
	buttons[1].key = KEYS.W;
	buttons[2].key = KEYS.E;
	buttons[3].key = KEYS.A;
	buttons[4].key = KEYS.S;
	buttons[5].key = KEYS.D;
}

Device.prototype.randomizeControls = function() {
	var buttons = this.controls.buttons;
	var input = this.player.input;

	var available_buttons = [];
	for (var i = 0; i < buttons.length; ++i) available_buttons[i] = i;
	
	for (control_id in input) {
		//bind button to control
		var button_id = available_buttons[ Math.round( Math.random() * (available_buttons.length - 1)) ];
		input[control_id] = buttons[button_id];

		//remove button_id from available_buttons
		var index = available_buttons.indexOf(button_id);
		available_buttons.splice(index, 1);
	}
}

Device.prototype.wasButtonPressed = function() {
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		if (buttons[i].justPressed()) {
			return true;
		}
	}
	return false;
}

//horrible horrible code mess forming here...
Device.prototype.updateGameState = function() {
	var cell_index = this.player.cell_index;
	var touched = this.board.tryTouch(cell_index.x, cell_index.y);
	switch (touched) {
		case "exit":
			this.timer.pause();
			this.stage_clear = true;
			g_SOUNDMANAGER.playSound("STAGE_CLEAR");
			break;
		case "item_key":
			break;
		case "item_timer":
			break;
	}
}

Device.prototype.update = function() {
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].update();
	}
	this.timer.update();

	if (this.stage_clear || this.timer.timeOver()) {
		//deal with reset button
		if (this.wasButtonPressed() && this.stage_clear) {
			this.current_stage += 1;
			this.loadStage( this.current_stage );
		}
	} else {
		console.log(this.timer.seconds);
		if (this.wasButtonPressed()) this.timer.unpause();
		this.player.update();
		this.board.update();
		this.wave.update();
		this.updateGameState();
	}

	if (g_DEBUG) {
		if (g_KEYSTATES.justPressed( KEYS.Z ) && !this.board.mouse_index.outOfBounds()) {
			this.player.cell_index.equals(this.board.mouse_index);
		}
		if (g_KEYSTATES.justPressed( KEYS.PAUSE )) {
			this.timer.togglePause();
		}
	}
}

Device.prototype.loadStage = function(stage_number) {
	var stages = g_STAGES;
	if (stage_number >= 0 && stage_number < stages.length) {
		this.board.loadData( stages[stage_number] );
		this.player.gotoStart();
		this.randomizeControls();
		this.timer.reset();
		this.stage_clear = false;
	} else {
		console.log("Device.prototype.loadStage: ERROR: stage_number out of bounds.");
	}
}

Device.prototype.draw = function(ctx, xofs, yofs) {
	this.sprite_background.draw(ctx, xofs, yofs, 0);
	this.sprite_screen_back.draw(ctx, xofs, yofs, 0);
	
	var buttons = this.controls.buttons;
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].draw(ctx, xofs, yofs);
	}

	this.timer.draw(ctx, xofs, yofs);
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