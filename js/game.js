/* GLOBAL VARIABLES AND DATA QUEUEING ******************************************
*/

//queue all the texture data in the system
function game_queueData() {
		var data = [
			"img/background.png",
			"img/congratulations.png",
			"img/screen_back.png",
			"img/screen_overlay.png",
			"img/screen_border.png",
			"img/button_red.png",
			"img/button_green.png",
			"img/button_power.png",
			"img/player.png",
			"img/cells.png",
			"img/timer_back.png",
			"img/numbers.png",
			"img/numbers_small.png",
			"img/objects.png"
		];
		g_ASSETMANAGER.queueAssets(data);
		data = [
			"sfx/button_power.wav",
			"sfx/button.wav",
			"sfx/time_tick.wav",
			"sfx/time_over.wav",
			"sfx/move.wav",
			"sfx/move_fail.wav",
			"sfx/get_key.wav",
			"sfx/get_clock.wav",
			"sfx/use_key.wav",
			"sfx/stage_clear.wav",
			"sfx/congratulations.wav"
		];
		g_SOUNDMANAGER.loadSounds(data);
}
game_queueData();

//objects
g_CAMERA = null;
g_GAMEMANAGER = null;
g_VECTORSCRATCH = null;

//variables
g_DEBUG = false;



/* MAIN FUNCTIONS **************************************************************
*/
function game_update() {
	g_GAMEMANAGER.update();
}

function game_draw(ctx, xofs, yofs) {
	g_SCREEN.clear();

	//add stuff to the renderlist
	g_GAMEMANAGER.addDrawCall();
	//sort and draw everything
	g_RENDERLIST.sort();
	g_RENDERLIST.draw(ctx, g_CAMERA.pos.x, g_CAMERA.pos.y);
	//do any debug drawing etc.
	if (g_DEBUG) {
		g_SCREEN.context.strokeStyle = "rgb(0,255,0)";
		g_SCREEN.context.fillStyle = "rgba(0,255,0,0.5)";
		g_RENDERLIST.drawDebug(ctx, g_CAMERA.pos.x, g_CAMERA.pos.y, 0);
	} else {
		g_SCREEN.context.strokeStyle = "rgb(0,0,0)";
		g_SCREEN.context.fillStyle = "rgb(0,0,0)";	
	}
	
	//make sure the renderlist is clear for the next frame
	g_RENDERLIST.clear();
}

function game_main() {
	if (g_KEYSTATES.isPressed( KEYS.SHIFT ) && g_KEYSTATES.justPressed( KEYS.D ) ) { //d for debug
		g_DEBUG = !g_DEBUG;
	}
	if (g_DEBUG) {
		document.getElementById('keystates').innerHTML = g_MOUSE.toString() + "<br>" + g_KEYSTATES.toString() + "<br><b>Camera</b><br>" + g_CAMERA.toString();


		if (g_MOUSE.left.isPressed() && g_KEYSTATES.isPressed( KEYS.C )) {
			g_CAMERA.pos.addXY(g_MOUSE.dx, g_MOUSE.dy);
		}
		if (g_KEYSTATES.isPressed( KEYS.SHIFT ) && g_KEYSTATES.justPressed( KEYS.C )) {
			g_CAMERA.pos.set(0, 0);
		}
	}

	game_update();
	game_draw(g_SCREEN.context, 0, 0);
}



function g_addEventListeners() {
	//var pobj, func;
	//pobj = document.getElementById('button_id');
	//func = function() {
	//}
	//pobj.addEventListener("click", func, false);	
}

function game_init() {
	if(g_SCREEN.init('screen', 768, 768)) {
		g_CAMERA = new Camera(0, 0);	
		g_GAMEMANAGER = new GameManager();
		g_VECTORSCRATCH = new ScratchPool(function() { return new Vector2(0, 0); }, 16);

		g_RENDERLIST.parallax = false;

		g_addEventListeners();
	}
}


