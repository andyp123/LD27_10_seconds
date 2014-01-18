/* WAVE **********************************************************************/

function Wave(minx, miny, maxx, maxy, num_points, timer) {
	this.min = new Vector2(minx, miny);
	this.max = new Vector2(maxx, maxy);
	this.displacement_y = []; //values between -1 and 1.
	for (var i = 0; i < num_points; ++i) {
		this.displacement_y[i] = 0.0;
	}
	this.timer = timer;
	this.color = "rgb(130,190,170)";

	this.height = 128.0;
}

Wave.prototype.update = function() {
	var timer = this.timer;
	var num_points = this.displacement_y.length;
	var time = 1.0 - (timer.seconds - Math.floor(timer.seconds));

	if (timer.paused) {
		for (var i = 0; i < num_points; ++i) {
			this.displacement_y[i] = 0.0;
		}
	} else {
		var scale = (1.0 - Util.clampScaled(time, 0.0, 0.25)) * 0.25;
		var pulse_width = 0.125;
		for (var i = 0; i < num_points; ++i) {
			var offset = i / num_points;
			var x = Util.clampScaled(offset, time - pulse_width, time + pulse_width);
			x = Util.clamp(x, 0.0, 1.0);
			this.displacement_y[i] = (Math.random() * scale) - Util.bellCurve(x);
		}
	}
}

Wave.prototype.draw = function(ctx, xofs, yofs) {
	var ctx_lineWidth = ctx.lineWidth;
	var ctx_strokeStyle = ctx.strokeStyle;
	ctx.lineWidth = 4;
	ctx.strokeStyle = this.color;

	var drawLine = Util.drawLine;

	var minx = this.min.x + xofs;
	var maxx = this.max.x + xofs;
	var midy = this.min.y + (this.max.y - this.min.y) * 0.5 + yofs;

	var x = minx;
	var span = (maxx - minx) / (this.displacement_y.length - 1);
	for (var i = 1; i < this.displacement_y.length; ++i) {
		var y1 = midy + this.displacement_y[i - 1] * this.height;
		var y2 = midy + this.displacement_y[i] * this.height; 
		drawLine(ctx, x, y1, x + span, y2);
		x += span;
	}

	ctx.strokeStyle = ctx_strokeStyle;
	ctx.lineWidth = ctx_lineWidth;
}

Wave.prototype.drawDebug = function(ctx, xofs, yofs) {

}

Wave.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 5);
}