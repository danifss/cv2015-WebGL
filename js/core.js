//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_29.js 
//
//  Applying a texture and blending
//
//  Adapted from learningwebgl.com
//
//  Daniel Silva - 51908
//  João Cravo   - 63784
//  December 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context
var shaderProgram = null;

// --- Buffers
var cubeVertexPositionBuffer = null;
var cubeVertexIndexBuffer = null;
var cubeVertexTextureCoordBuffer;

// The global transformation parameters
var globalAngleYY = 0.0;
var globalTz = 0.0;

// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 30.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 0.05;
var sy = 0.05;
var sz = 0.05;

// Local Animation controls
var rotationXX_ON = 0;
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;
var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
var rotationZZ_ON = 0;
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;
 
// To allow choosing the way of drawing the model triangles
var primitiveType = null;
 
// To allow choosing the projection type
var projectionType = 0;

// --- Storing the vertices defining the cube faces

vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
];

// Texture coordinates for the quadrangular faces
// Notice how they are assigned to the corresponding vertices
var textureCoords = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

// Vertex indices defining the triangles
var cubeVertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];


// Declare number of Cubes
var NUM_CUBES = 9;
// Algorithm Type
var algorithmType = 0;
// Numbers List
var numberList = [];
// Algorithm time
var globalAlgTime = 0;
// Result
var result = "";
// Cubes to Move Up
var cubesToMove = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// yy position for cubes
var yy = 0.5;
var toYY = 0.5;
// If is to go up or not
var goUp = 0;
// If is to go down or not
var goDown = 0;
// repeat sort algorithm
var goAgain = 1;
// Finished sorting
var sortDone = 0;

//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures
// From www.learningwebgl.com
var webGLTexture = [];
var i = 0;

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() {
    //for(; i<NUM_CUBES; i++) {
    //    webGLTexture[i] = gl.createTexture();
    //    webGLTexture[i].image = new Image();
    //    webGLTexture[i].image.onload = function () {
    //        handleLoadedTexture(webGLTexture[i])
    //    }
    //    webGLTexture[i].image.src = "img/number"+(i+1)+".jpg";
    //}

    webGLTexture[0] = gl.createTexture();
    webGLTexture[0].image = new Image();
    webGLTexture[0].image.onload = function () { handleLoadedTexture(webGLTexture[0]) }
    webGLTexture[0].image.src = "img/number1.jpg";

    webGLTexture[1] = gl.createTexture();
    webGLTexture[1].image = new Image();
    webGLTexture[1].image.onload = function () { handleLoadedTexture(webGLTexture[1]) }
    webGLTexture[1].image.src = "img/number2.jpg";

    webGLTexture[2] = gl.createTexture();
    webGLTexture[2].image = new Image();
    webGLTexture[2].image.onload = function () { handleLoadedTexture(webGLTexture[2]) }
    webGLTexture[2].image.src = "img/number3.jpg";

    webGLTexture[3] = gl.createTexture();
    webGLTexture[3].image = new Image();
    webGLTexture[3].image.onload = function () { handleLoadedTexture(webGLTexture[3]) }
    webGLTexture[3].image.src = "img/number4.jpg";

    webGLTexture[4] = gl.createTexture();
    webGLTexture[4].image = new Image();
    webGLTexture[4].image.onload = function () { handleLoadedTexture(webGLTexture[4]) }
    webGLTexture[4].image.src = "img/number5.jpg";

    webGLTexture[5] = gl.createTexture();
    webGLTexture[5].image = new Image();
    webGLTexture[5].image.onload = function () { handleLoadedTexture(webGLTexture[5]) }
    webGLTexture[5].image.src = "img/number6.jpg";

    webGLTexture[6] = gl.createTexture();
    webGLTexture[6].image = new Image();
    webGLTexture[6].image.onload = function () { handleLoadedTexture(webGLTexture[6]) }
    webGLTexture[6].image.src = "img/number7.jpg";

    webGLTexture[7] = gl.createTexture();
    webGLTexture[7].image = new Image();
    webGLTexture[7].image.onload = function () { handleLoadedTexture(webGLTexture[7]) }
    webGLTexture[7].image.src = "img/number8.jpg";

    webGLTexture[8] = gl.createTexture();
    webGLTexture[8].image = new Image();
    webGLTexture[8].image.onload = function () { handleLoadedTexture(webGLTexture[8]) }
    webGLTexture[8].image.src = "img/number9.jpg";
}

//----------------------------------------------------------------------------

// Handling the Buffers

function initBuffers() {    
    // Coordinates
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = vertices.length / 3;            

    // Textures
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;         

    // Vertex indices
    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( angleXX, angleYY, angleZZ, 
                    sx, sy, sz,
                    tx, ty, tz,
                    mvMatrix,
                    primitiveType,
                    i) {

    // Pay attention to transformation order !!
    mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
    mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
    mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
    mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
    mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );

    // Passing the Model View Matrix to apply the current transformation
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // --- Textures
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture[i-1]);
        
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    
    // --- Blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    var alpha = 1;
    gl.uniform1f(shaderProgram.alphaUniform, alpha);
    
    // The vertex indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS 
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene with modified positions

function drawScene() {
    var pMatrix;
    var mvMatrix = mat4();

    // Clearing with the background color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // --- Computing the Projection Matrix
    if( projectionType == 0 ) {
        // For now, the default orthogonal view volume
        pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
        tz = 0;
        // TO BE DONE IF NEEDED !
        // Allow the user to control the size of the view volume
    }
    else {
        // A standard view volume.
        // Viewer is at (0,0,0)
        // Ensure that the model is "inside" the view volume
        pMatrix = perspective( 45, 1, 0.05, 10 );
        tz = -2.25;
    }

    // Passing the Projection Matrix to apply the current projection
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // --- Instantianting the same model more than once !!
    // And with diferent transformation parameters !!
    // Call the drawModel function !!
    var offset = 0.9;
    for(var i=0; i<numberList.length; i++) {
        if (cubesToMove[i] == 0){
            // Instance models
            drawModel( angleXX, angleYY, angleZZ,  // CW rotations
                sx, sy, sz,
                tx - offset, ty, tz,
                mvMatrix,
                primitiveType,
                numberList[i]);
        } else { // draw model with diferent params
            drawModel(angleXX, angleYY, angleZZ,
                sx, sy, sz,
                tx - offset, yy, tz,
                mvMatrix, primitiveType, numberList[i]);
        }
        offset -= 0.22;
    }

}

//----------------------------------------------------------------------------
//
//  --- Animation
//

// Animation --- Updating transformation parameters
var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if( lastTime != 0 ) {
        var elapsed = timeNow - lastTime;
        if( rotationXX_ON ) {
            angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
        }
        if( rotationYY_ON ) {
            angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
        }
        if( rotationZZ_ON ) {
            angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
        }

        // Animation for sort
        if(goUp){ // Move blocks Up
            if(yy <= toYY) {
                yy += 0.003;
            }
        } else if(goDown) { // Move blocks Down
            if(yy >= toYY) {
                yy -= 0.003;
            }
        }
    }
    lastTime = timeNow;
}

var animTimeInit = 0;
var animTime = 3000; // ms
var animDone = 0;
//function controlAnimation() {
//    var tmp = new Date().getTime();
//    var elapsed = (tmp-animTimeInit);
//    animDone = 0;
//    if (elapsed >= animTime)
//        animDone = 1;
//}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com
var currentlyPressedKeys = {};

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        sx *= 0.9;
        sz = sy = sx;
    }
    if (currentlyPressedKeys[34]) {
        // Page Down
        sx *= 1.1;
        sz = sy = sx;
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        if( rotationYY_ON == 0 ) {
            rotationYY_ON = 1;
        }  
        rotationYY_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        if( rotationYY_ON == 0 ) {
            rotationYY_ON = 1;
        }  
        rotationYY_SPEED += 0.25;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        if( rotationXX_ON == 0 ) {
            rotationXX_ON = 1;
        }  
        rotationXX_SPEED -= 0.25;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        if( rotationXX_ON == 0 ) {
            rotationXX_ON = 1;
        }  
        rotationXX_SPEED += 0.25;
    }
}

//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) { return; }
    // Rotation angles proportional to cursor displacement
    var newX = event.clientX;
    var newY = event.clientY;
    var deltaX = newX - lastMouseX;
    angleYY += radians( 10 * deltaX  )
    var deltaY = newY - lastMouseY;
    angleXX += radians( 10 * deltaY  )
    lastMouseX = newX
    lastMouseY = newY;
}
//----------------------------------------------------------------------------

// Timer

function tick() {
    requestAnimFrame(tick);
    // Processing keyboard events
    handleKeys();
    drawScene();
    animate();

    //controlAnimation();

    if(goAgain) {
        // Run Selected Algorithm
        switch (algorithmType) {
            case 0:
                bubbleSort(numberList);
                result = "BubbleSort: "
                break;
            case 1:
                quicksort(numberList, 0, numberList.length-1);
                result = "QuickSort: "
                break;
            case 2:
                numberList = mergeSort(numberList);
                result = "MergeSort: "
                break;
        }
    } else {
        if(!sortDone && animDone) {
            var timenow = new Date().getTime();
            var timeElapsed = (timenow - globalAlgTime) / 1000; // seconds
            sortDone = 1;

            // Add result into multiple area for output
            document.getElementById("countedTime").appendChild(new Option(result + timeElapsed));
        }
    }
}

//function sleep(milliseconds) {
//    var start = new Date().getTime();
//    for (var i = 0; i < 1e7; i++) {
//        if ((new Date().getTime() - start) > milliseconds){
//            break;
//        }
//    }
//}

//----------------------------------------------------------------------------
//  Moving cubes
function moveCubesUpDown(a, b, updown) {
    cubesToMove = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    if (updown) { // Up
        toYY = 0.7;
        // Moving Up Cubes
        cubesToMove[a] = 1;
        cubesToMove[b] = 1;
        goUp = 1;
        goDown = 0;
    } else { // Down
        toYY = 0;
        // Moving Down Cubes
        cubesToMove[a] = -1;
        cubesToMove[b] = -1;
        goUp = 0;
        goDown = 1;
    }
}


//----------------------------------------------------------------------------
//
//  Bubble Sort Algorithm
//  From http://www.stoimen.com/blog/2010/07/09/friday-algorithms-javascript-bubble-sort/
//
var troca = 1;
var emCima = 0;

function bubbleSort(a)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {

            var tmp = new Date().getTime();
            animDone = (tmp-animTimeInit) >= animTime;

            if (animDone) {
                if (a[i] > a[i + 1]) {

                    if (!emCima) {
                        animTimeInit = new Date().getTime();
                        emCima = 1;
                        goAgain = 1;
                        moveCubesUpDown(i, i + 1, 1);
                    }
                    else{

                        var temp = a[i];
                        a[i] = a[i + 1];
                        a[i + 1] = temp;
                        swapped = true;

                        animTimeInit = new Date().getTime();
                        emCima = 0;
                        goAgain = 0;
                        moveCubesUpDown(i, i + 1, 0);
                    }
                }
                else {
                    if (!emCima) {
                        animTimeInit = new Date().getTime();
                        emCima = 1; // activate anim
                        goAgain = 1;
                        moveCubesUpDown(i, i + 1, 1);
                    }
                    else
                    {
                        emCima = 1;
                        goAgain = 0;
                        moveCubesUpDown(i, i + 1, 0);
                    }
                }
            } else {
                goAgain = 1;
            }
        }
    } while (swapped);
}
//----------------------------------------------------------------------------
//
//  QuickSort Sort Algorithm
//  From http://www.stoimen.com/blog/2010/06/11/friday-algorithms-quicksort-difference-between-php-and-javascript/
//
//function quicksort(arr)
//{
//    if (arr.length == 0)
//        return [];
//
//    var left = new Array();
//    var right = new Array();
//    var pivot = arr[0];
//
//    for (var i = 1; i < arr.length; i++) {
//        if (arr[i] < pivot) {
//            left.push(arr[i]);
//        } else {
//            right.push(arr[i]);
//        }
//    }
//    return quicksort(left).concat(pivot, quicksort(right));
//}

//----------------------------------------------------------------------------
//  QuickSort Sort Algorithm
//  From https://pt.wikipedia.org/wiki/Quicksort#JavaScript

function quicksort(vet, esq, dir){
    var ce = esq;
    var cd = dir;
    var meio = parseInt((ce + cd)/ 2);

    var tmp = new Date().getTime();
    animDone = (tmp-animTimeInit) >= animTime;

    if (animDone) {

        while (ce < cd) {
            while (vet[ce] < vet[meio]) {
                ce++;
            }
            while (vet[cd] > vet[meio]) {
                cd--;
            }
            if (ce <= cd) {

                animTimeInit = new Date().getTime();
                goAgain = 1;
                moveCubesUpDown(ce, cd, 1);

                var temp = vet[ce];
                vet[ce] = vet[cd];
                vet[cd] = temp;
                ce++;
                cd--;
            }
        }

        if (cd > esq)
            quicksort(vet, esq, cd);

        if (ce < dir)
            quicksort(vet, ce, dir);
    }

}
//----------------------------------------------------------------------------
//
//  MergeSort Sort Algorithm
//  From http://www.stoimen.com/blog/2010/07/02/friday-algorithms-javascript-merge-sort/
//
//  -If the list is of length 0 or 1, then it is already sorted. Otherwise:
//  -Divide the unsorted list into two sublists of about half the size.
//  -Sort each sublist recursively by re-applying merge sort.
//  -Merge the two sublists back into one sorted list.
function mergeSort(arr)
{
    if (arr.length < 2)
        return arr;

    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right)
{
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}

//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
        
}

//----------------------------------------------------------------------------

function setEventListeners( canvas ){
    // ---Handling the mouse
    // From learningwebgl.com
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    
    // ---Handling the keyboard
    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // ---Handling HTML elements
    // Dropdown list
    var projection = document.getElementById("projection-selection");
    projection.addEventListener("click", function(){
        // Getting the selection
        var p = projection.selectedIndex;
        switch(p){
            case 0 : projectionType = 0;
                break;
            case 1 : projectionType = 1;
                break;
        }   
    });

    var algType = document.getElementById("algorithm-selection");
    algType.addEventListener("click", function(){
        // Getting the selection
        var a = algType.selectedIndex;
        switch(a){
            case 0 : algorithmType = 0; // Bubble Sort
                break;
            case 1 : algorithmType = 1; // Quick Sort
                break;
            case 2 : algorithmType = 2; // Merge Sort
                break;
            default: algorithmType = 0;
                break;
        }
    });

    // Button events
    document.getElementById("startSort").onclick = function(){
        var text = document.getElementById("inputNumbers").value;
        numberList = text.split(',');

        if (numberList.length > 1) {
            // Reset time
            globalAlgTime = new Date().getTime();

            // Draw Scene and Models
            tick();
        } else {
            alert('You have to input at least 2 numbers!');
        }

    };
    document.getElementById("XX-on-off-button").onclick = function(){
        // Switching on / off
        if( rotationXX_ON ) {
            rotationXX_ON = 0;
            this.className="btn btn-xs btn-danger";
            this.innerHTML="Off";
        } else {
            rotationXX_ON = 1;
            this.className="btn btn-xs btn-success";
            this.innerHTML="On";
        }
    };
    document.getElementById("XX-direction-button").onclick = function(){
        // Switching the direction
        if( rotationXX_DIR == 1 ) {
            rotationXX_DIR = -1;
        } else {
            rotationXX_DIR = 1;
        }
    };
    document.getElementById("XX-slower-button").onclick = function(){
        rotationXX_SPEED *= 0.75;
    };
    document.getElementById("XX-faster-button").onclick = function(){
        rotationXX_SPEED *= 1.25;
    };
    document.getElementById("YY-on-off-button").onclick = function(){
        // Switching on / off
        if( rotationYY_ON ) {
            rotationYY_ON = 0;
            this.className="btn btn-xs btn-danger"
            this.innerHTML="Off";
        } else {
            rotationYY_ON = 1;
            this.className="btn btn-xs btn-success"
            this.innerHTML="On";
        }
    };
    document.getElementById("YY-direction-button").onclick = function(){
        // Switching the direction
        if( rotationYY_DIR == 1 ) {
            rotationYY_DIR = -1;
        } else {
            rotationYY_DIR = 1;
        }
    };
    document.getElementById("YY-slower-button").onclick = function(){
        rotationYY_SPEED *= 0.75;
    };
    document.getElementById("YY-faster-button").onclick = function(){
        rotationYY_SPEED *= 1.25;
    };
    document.getElementById("ZZ-on-off-button").onclick = function(){
        // Switching on / off
        if( rotationZZ_ON ) {
            rotationZZ_ON = 0;
            this.className="btn btn-xs btn-danger";
            this.innerHTML="Off";
        } else {
            rotationZZ_ON = 1;
            this.className="btn btn-xs btn-success";
            this.innerHTML="On";
        }
    };
    document.getElementById("ZZ-direction-button").onclick = function(){
        // Switching the direction
        if( rotationZZ_DIR == 1 ) {
            rotationZZ_DIR = -1;
        } else {
            rotationZZ_DIR = 1;
        }
    };
    document.getElementById("ZZ-slower-button").onclick = function(){
        rotationZZ_SPEED *= 0.75;
    };
    document.getElementById("ZZ-faster-button").onclick = function(){
        rotationZZ_SPEED *= 1.25;
    };
    document.getElementById("reset-button").onclick = function(){
        // The initial values
        tx = 0.0;
        ty = 0.0;
        tz = 0.0;
        angleXX = 30.0;
        angleYY = 0.0;
        angleZZ = 0.0;
        sx = 0.05;
        sy = 0.05;
        sz = 0.05;
        rotationXX_ON = 0;
        rotationXX_DIR = 1;
        rotationXX_SPEED = 1;
        rotationYY_ON = 1;
        rotationYY_DIR = 1;
        rotationYY_SPEED = 1;
        rotationZZ_ON = 0;
        rotationZZ_DIR = 1;
        rotationZZ_SPEED = 1;

        goUp = 0;
        goDown = 0;
        goAgain = 0;
        troca = 1;
        emCima = 0;
        sortDone = 0;
        animDone = 0;
        document.getElementById("inputNumbers").value = "";
        runWebGL();
    };      
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
    try {
        // Create the WebGL context
        // Some browsers still need "experimental-webgl"
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        // DEFAULT: The viewport occupies the whole canvas
        // DEFAULT: The viewport background color is WHITE

        // Enable FACE CULLING
        gl.enable( gl.CULL_FACE );

        // - Drawing the triangles defining the model
        primitiveType = gl.TRIANGLES;
        // DEFAULT: Blending is DISABLED
        gl.enable( gl.BLEND ); // Enable it
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry! :-(");
    }        
}

//----------------------------------------------------------------------------

function runWebGL() {
    var canvas = document.getElementById("my-canvas");
    initWebGL( canvas );
    shaderProgram = initShaders( gl );
    setEventListeners( canvas );
    initBuffers();
    initTexture();
    //tick();     // A timer controls the rendering / animation
    outputInfos();
}
