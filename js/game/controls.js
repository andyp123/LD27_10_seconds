/* CONTROLS ******************************************************************/

/* BUTTON *
*/

function Button(sprite, posx, posy, radius) {
	this.sprite = sprite;
	this.pos = new Vector2(posx, posy);
	this.radius = radius;
	this.state = new ButtonState();
	this.enabled = true;
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
	if (mouse.left.justPressed() && (x * x + y * y < this.radius * this.radius))
	{
		if (!state.isPressed()) state.press();
	} 
	else if(!mouse.left.isPressed())
	{
		if (state.isPressed()) state.release();
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
