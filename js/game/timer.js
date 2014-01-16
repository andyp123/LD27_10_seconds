/* TIMER */

function Timer(x, y, start_time) {
	this.pos = new Vector2(x, y);

	this.start_time = start_time;
	this.seconds = start_time;
	this.paused = true;

	this.sprite_back = new Sprite(g_ASSETMANAGER.getAsset("TIMER_BACK")); //192x96
	this.sprite_back.setOffset(Sprite.ALIGN_TOP_LEFT);
	this.img_numbers = g_ASSETMANAGER.getAsset("NUMBERS"); //32x48 each
	this.img_numbers_small = g_ASSETMANAGER.getAsset("NUMBERS_SMALL"); //??x32 each
}

Timer.prototype.pause = function() { this.paused = true; }
Timer.prototype.unpause = function() { this.paused = false; }
Timer.prototype.togglePause = function() { this.paused = !this.paused; }
Timer.prototype.reset = function() {
	this.paused = true;
	this.seconds = this.start_time;
}
Timer.prototype.timeOver = function() { this.seconds == 0.0; }

Timer.prototype.update = function() {
	if (!this.paused) {
		this.seconds -= g_FRAMETIME_S;
		if (this.seconds <= 0.0) {
			this.seconds = 0.0;
			this.paused = true;
		}
	}
}

Timer.prototype.draw = function(ctx, xofs, yofs) {
	var x = this.pos.x + xofs;
	var y = this.pos.y + yofs;

	var seconds = Math.floor(this.seconds);
	var milliseconds = Math.floor((this.seconds - seconds) * 1000);

	var ms_str = "" + milliseconds;
	while( ms_str.length < 3 ) ms_str = "0" + ms_str;

	this.sprite_back.draw(ctx, x, y + yofs);
	x += 96; y += 24;
	Util.drawNumber(ctx, x, y, seconds, this.img_numbers, 10);
	x += 76; y += 8;
	Util.drawNumber(ctx, x, y, ms_str, this.img_numbers_small, 10); //ms_str should really be a number, but it will work anyway :)
}

Timer.prototype.drawDebug = function(ctx, xofs, yofs) {
}

Timer.prototype.addDrawCall = function() {
}