/* WAVE **********************************************************************/

function Wave(minx, miny, maxx, maxy, num_points) {
	this.min = new Vector2(minx, miny);
	this.max = new Vector2(maxx, maxy);
	this.displacement_y = []; //values between -1 and 1.
	for (var i = 0; i < num_points; ++i) {
		this.displacement_y[i] = Math.cos(20.0 * (i / num_points) - 1.0);
	}

	this.height = 64.0;
}

Wave.prototype.update = function() {
	var shift = g_GAMETIME_MS / 1000.0;
	var num_points = this.displacement_y.length;
	for (var i = 0; i < num_points; ++i) {
		this.displacement_y[i] = Math.cos(10.0 * (i / num_points) - shift);
	}
}

Wave.prototype.draw = function(ctx, xofs, yofs) {
	var ctx_lineWidth = ctx.lineWidth;
	var ctx_strokeStyle = ctx.strokeStyle;
	ctx.lineWidth = 4;
	ctx.strokeStyle = "rgb(171,255,228)";

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