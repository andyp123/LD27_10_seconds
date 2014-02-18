/* STAGE DEFINITIONS **********************************************************
+ Each stage is a 9x6 (54) grid
+ Each tile has a type that determines what is placed there

0 : empty space
1 : solid wall
2 : start point
3 : exit
4 : locked exit
5 : key (opens locked exit)
6 : clock (adds 1 second extra time)
******************************************************************************/

var g_CONGRATULATIONS_STAGE = {
	"cells": [
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1
	]
};

var g_STAGES = [];

g_STAGES[0] = {
	"cells": [
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,0,2,0,0,0,0,3,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1
	]
};

g_STAGES[1] = {
	"cells": [
		1,1,1,1,1,1,1,1,1,
		1,0,0,0,1,1,1,1,1,
		1,0,2,0,0,0,0,3,1,
		1,0,0,0,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1
	]
};

g_STAGES[2] = {
	"cells": [
		1,1,1,0,0,0,1,1,1,
		0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,
		0,0,0,1,1,1,0,0,0,
		0,2,0,1,1,1,0,3,0,
		0,0,0,1,1,1,0,0,0
	]
};

g_STAGES[3] = {
	"cells": [
		1,1,1,1,1,1,1,1,1,
		0,0,0,1,1,1,0,0,0,
		0,2,0,0,4,0,0,3,0,
		0,0,0,1,1,1,0,0,0,
		1,0,1,1,1,1,1,1,1,
		1,5,1,1,1,1,1,1,1
	]
};

g_STAGES[4] = {
	"cells": [
		1,1,1,0,0,0,0,0,0,
		1,1,1,0,6,0,1,1,0,
		2,1,1,0,0,0,1,1,0,
		0,1,1,0,0,0,1,1,3,
		0,1,1,0,0,0,1,1,1,
		0,0,0,0,0,0,1,1,1
	]
}; 

g_STAGES[5] = {
	"cells": [
		1,0,0,0,5,0,0,0,1,
		1,0,1,1,1,1,1,0,1,
		1,0,1,1,3,1,1,0,1,
		1,0,1,1,4,1,1,6,1,
		1,0,1,0,2,0,1,0,1,
		1,0,0,0,0,0,0,0,1
	]
};

g_STAGES[6] = {
	"cells": [
		1,1,5,0,0,1,1,3,1,
		1,1,0,1,0,1,1,0,1,
		1,1,0,0,0,4,0,0,1,
		1,1,1,1,0,1,1,1,1,
		1,1,1,1,0,1,1,1,1,
		1,1,2,0,0,1,1,1,1
	]
}; 

g_STAGES[7] = {
	"cells": [
		1,5,1,1,1,1,1,3,1,
		1,0,1,1,1,1,1,0,1,
		1,0,1,0,0,0,1,0,1,
		1,0,0,0,0,0,4,0,1,
		1,6,1,0,0,0,1,6,1,
		1,1,1,1,2,1,1,1,1
	]
}; 

g_STAGES[8] = {
	"cells": [
		1,0,6,0,0,0,0,0,1,
		1,0,1,1,1,0,1,0,1,
		1,0,1,1,1,0,1,0,1,
		1,0,5,0,1,0,1,0,1,
		1,0,1,0,1,0,1,0,1,
		2,0,0,0,0,0,4,0,3
	]
}; 

g_STAGES[9] = {
	"cells": [
		0,0,3,1,0,0,0,5,5,
		0,1,1,1,0,1,1,1,1,
		0,1,1,1,0,4,0,6,6,
		0,1,1,1,0,1,1,1,5,
		0,0,0,4,0,4,0,6,6,
		1,1,1,1,2,1,1,1,1
	]
}; 

