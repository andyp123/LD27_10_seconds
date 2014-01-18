/* CONTROLS ******************************************************************/

/* BUTTON *
*/

function Button(sprite, posx, posy, radius, key) {
	this.sprite = sprite;
	this.pos = new Vector2(posx, posy);
	this.radius = radius;
	this.state = new ButtonState();
	this.enabled = true;
	this.toggle = false; //toggle is a bit of a crap hack
	this.sound_id = "BUTTON";

	this.key = key || null;
}

Button.prototype.isPressed = function() {
	return this.state.isPressed();
}

Button.prototype.justPressed = function() {
	return this.state.justPressed();
}

Button.prototype.justReleased = function() {
	return this.state.justReleased();
}

Button.prototype.enable = function() {
	this.enabled = true;
}

Button.prototype.disable = function() {
	this.enabled = false;
	this.state.release();
}

Button.prototype.update = function() {
	if (!this.enabled) return;
	var state = this.state;
	var mouse = g_MOUSE;
	var camera = g_CAMERA;
	var x = this.pos.x - mouse.x - camera.pos.x;
	var y = this.pos.y - mouse.y - camera.pos.y;

	var press = false;
	var release = false;
	if (!state.isPressed() || this.toggle) {
		if (this.key && g_KEYSTATES.justPressed(this.key)) press = true;
		if (mouse.left.justPressed() && (x * x + y * y < this.radius * this.radius)) press = true;
	} else {
		if (!mouse.left.isPressed() && (!this.key || !g_KEYSTATES.isPressed(this.key))) release = true;
	}
	
	if (this.toggle) {
		if (press) {
			if (this.isPressed()) this.state.release();
			else this.state.press();
			g_SOUNDMANAGER.playSound(this.sound_id);
		}
	} else {
		if (press) {
			this.state.press();
			g_SOUNDMANAGER.playSound(this.sound_id);
		}
		if (release) this.state.release();
	}
}

Button.prototype.draw = function(ctx, xofs, yofs) {
	var frame = (this.state.isPressed()) ? 1 : 0;
	this.sprite.draw(ctx, this.pos.x + xofs, this.pos.y + yofs, frame);
}

Button.prototype.drawDebug = function(ctx, xofs, yofs) {
	Util.drawCircle(ctx, this.pos.x + xofs, this.pos.y + yofs, this.radius);
	if (this.state.isPressed())
	{
		Util.drawCircle(ctx, this.pos.x + xofs, this.pos.y + yofs, this.radius * 0.8);
	}
}
