let gl;
let program;
let objects = [];
let posLoc,
	colorLoc;

// TODO: 1.4 + 2.4: Führe globale Variablen ein für Werte, die in verschiedenen Funktionen benötigt werden
let modelMatrixLoc;
let viewMatrixLoc,
	viewMatrix;
let eye,
	target,
	up;
const speed = 0.005;

function main() {

	// Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');

	// Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.75,0.8,1.0,1.0);

	gl.enable(gl.DEPTH_TEST);

	// Init shader program via additional function and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Get locations of shader variables
	posLoc = gl.getAttribLocation(program, "vPosition");
	colorLoc = gl.getAttribLocation(program, "vColor");
	// TODO 1.3 + 2.3: Bestimme Locations der Shadervariablen für Model und View Matrix
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");

	// TODO 2.5: Erstelle mithilfe der Funktionen aus gl-matrix.js eine initiale View Matrix
	eye = vec3.fromValues(0.0, 0.3, 4.0);
	target = vec3.fromValues(0.0, 0.3, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	// TODO 2.6: Übergebe die initiale View Matrix an den Shader
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	// TODO 2.8: Füge einen Event Listener für Tastatureingaben hinzu
	document.addEventListener("keydown", move);
	document.addEventListener("mousemove", changeView);

	// Create object instances
	

	// TODO 1.5: Erstelle mehrere Baum-/Wolkeninstanzen und einen Fluss
	// TODO 1.8: Rufe für jedes Objekt die Methode 'SetModelMatrix' auf und 
	// positioniere das Objekt auf diese Weise auf der Insel

	// let cube = new Cube();
	// //cube.SetModelMatrix([1.3, 0, 0.6], [0, 45, 0], [0.3, 0.3, 0.3]);
	// cube.SetModelMatrix([0,0,0],[0, 45, 0], [0.3, 0.3, 0.3]);
	// objects.push(cube);

	let island = new Island();
	island.SetModelMatrix([0,0,0],[0, 45, 0], [1.0, 1.0, 1.0]);
	objects.push(island);

	// let tree = new Tree();
	// island.SetModelMatrix([0,0,0],[0, 45, 0], [0.4,0.4,0.4]);
	// objects.push(tree);




	let tree1 = new Tree();
	tree1.SetModelMatrix([1.3, -0.75, -0.6], [0, 45, 0], [0.3, 0.3, 0.3]);
	objects.push(tree1);

	let tree2 = new Tree();
	tree2.SetModelMatrix([0.9, -0.8, -0.3], [0, 33, 0], [0.45, 0.45, 0.45]);
	objects.push(tree2);

	let tree3 = new Tree();
	tree3.SetModelMatrix([0.45, 0, -0.75], [0, 0, 0], [0.4, 0.4, 0.4]);
	objects.push(tree3);

	let tree4 = new Tree();
	tree4.SetModelMatrix([-1.1, 0, 0.5], [0, 222, 0], [0.42, 0.42, 0.42]);
	objects.push(tree4);

	let tree5 = new Tree();
	tree5.SetModelMatrix([-0.65, 0, 0.7], [0, 79, 0], [0.32, 0.32, 0.32]);
	objects.push(tree5);

	let turtle = new Turtle();
	turtle.SetModelMatrix([-0.45,0,0],[0, 0, 0], [0.5,0.5,0.5]);
	objects.push(turtle);
	

	let cloud1 = new Cloud();
	cloud1.SetModelMatrix([-0.4, 1, -0.9], [0, 0, 0], [0.32, 0.32, 0.32]);
	objects.push(cloud1);

	let cloud2 = new Cloud();
	cloud2.SetModelMatrix([0, 1.4, -1.6], [0, -90, 0], [0.2, 0.2, 0.2]);
	objects.push(cloud2);

	let cloud3 = new Cloud();
	cloud3.SetModelMatrix([0.7, 0.9, -0.8], [0, 100, 0], [0.25, 0.25, 0.25]);
	objects.push(cloud3);

	let swan = new Swan();
	swan.SetModelMatrix([-0.2,-0.5,0],[0, 45, 0], [0.7, 0.7, 0.7]);
	objects.push(swan);



	render();
};

function render() {
	
	// Only clear once
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Call render function of each scene object
    for(let object of objects) {
		object.Render();
	};

	requestAnimationFrame(render);
}

// TODO 2.7: Erstelle einen Event-Handler, der anhand von WASD-Tastatureingaben
// die View Matrix anpasst
function move(e) 
{
	let look = vec3.create();
	vec3.sub(look, target, eye);
	vec3.scale(look, look, speed);

	if(e.code == 'KeyW') {
		eye[0] += look[0];
		eye[2] += look[2];
		target[0] += look[0];
		target[2] += look[2];
	}
	if(e.code == 'KeyS') {
		eye[0] -= look[0];
		eye[2] -= look[2];
		target[0] -= look[0];
		target[2] -= look[2];
	}
	if(e.code == 'KeyA') {
		eye[0] += look[2];
		eye[2] -= look[0];
		target[0] += look[2];
		target[2] -= look[0];
	}
	if(e.code == 'KeyD') {
		eye[0] -= look[2];
		eye[2] += look[0];
		target[0] -= look[2];
		target[2] += look[0];
	}
	mat4.lookAt(viewMatrix, eye, target, up);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

function changeView(e) 
{
	vec3.rotateY(target, target, eye, -e.movementX * speed);
	mat4.lookAt(viewMatrix, eye, target, up);
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}

main();
