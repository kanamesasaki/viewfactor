import { getVertexShader, getFragmentShader } from './utils.js'
import * as vf from './viewfactor.js'

// Global variables that are set and used
// across the application
let gl
let program
let squareVertexBuffer
let widthLoc
let heightLoc
const canvas = document.getElementById('webgl-canvas')

// We call draw to render to our canvas
function draw() {
  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  // GLuint index: index of the generic vertex attribute
  // GLint size: number of components per generic vertex attribute, 1~4
  // GLenum type: data type of each component in the array
  // GLboolean normalized: 
  // GLsizei stride: byte offset between consecutive generic vertex attributes
  // const void * pointer: offset of the first component of the first generic vertex attribute in the array
  gl.enableVertexAttribArray(program.aVertexPosition);
  // GLuint index: index of the generic vertex attribute to be enabled

  // Draw to the scene using triangle primitives from array data
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // GLenum mode: primitive type
  // GLint first: starting index
  // GLsizei count: number of indices

  // Clean
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function redraw() {
  canvas.width = 100 // window.innerWidth;
  canvas.height = 100 // window.innerHeight;
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  draw()
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16)/255.0, parseInt(result[2], 16)/255.0, parseInt(result[3], 16)/255.0] : null;
}

function arrayCount(arr) {
  let count = {}

  for (let i = 0; i < arr.length; i++) {
    let elm = arr[i];
    count[elm] = (count[elm] || 0) + 1;
  }
  console.log(count)
  return count
}

document.getElementById("ds-disk-ana-calc").onclick = function() {
  let r = document.getElementById('ds-disk-r');
  let h = document.getElementById('ds-disk-h');
  let theta_deg = document.getElementById('ds-disk-theta');
  let result = document.getElementById('ds-disk-ana-vf')
  result.value = vf.dsToDisk(r.value, h.value, theta_deg.value);
}

document.getElementById("ds-rect-ana-calc").onclick = function() {
  let a = document.getElementById('ds-rect-a');
  let b = document.getElementById('ds-rect-b');
  let c = document.getElementById('ds-rect-c');
  let result = document.getElementById('ds-rect-ana-vf')
  result.value = vf.dsToRectangle(a.value, b.value, c.value);
}

document.getElementById("ds-sphere-ana-calc").onclick = function() {
  let r = document.getElementById('ds-sphere-r')
  let h = document.getElementById('ds-sphere-h')
  let theta_deg = document.getElementById('ds-sphere-theta')
  let result = document.getElementById('ds-sphere-ana-vf')
  result.value = vf.dsToSphere(r.value, h.value, theta_deg.value)
}

document.getElementById("disk-disk-ana-calc").onclick = function() {
  let r1 = document.getElementById('disk-disk-r1')
  let r2 = document.getElementById('disk-disk-r2')
  let h = document.getElementById('disk-disk-h')
  let result = document.getElementById('disk-disk-ana-vf')
  result.value = vf.diskToDisk(h.value, r1.value, r2.value)
}

document.getElementById("rect-rect-p-ana-calc").onclick = function() {
  let a = document.getElementById('rect-rect-p-a')
  let b = document.getElementById('rect-rect-p-b')
  let c = document.getElementById('rect-rect-p-c')
  let result = document.getElementById('rect-rect-p-ana-vf')
  result.value = vf.rectToRectParalell(a.value, b.value, c.value)
}

document.getElementById("rect-rect-v-ana-calc").onclick = function() {
  let h = document.getElementById('rect-rect-v-h')
  let w = document.getElementById('rect-rect-v-w')
  let l = document.getElementById('rect-rect-v-l')
  let result = document.getElementById('rect-rect-v-ana-vf')
  result.value = vf.rectToRectVertical(h.value, w.value, l.value)
}

// Entry point to our application
function init() {
  // Retrieve the canvas

  // Set the canvas to the size of the screen
  canvas.width = 1000; // window.innerWidth;
  canvas.height = 200; // window.innerHeight;

  // Retrieve a WebGL context
  gl = canvas.getContext('webgl2', {preserveDrawingBuffer: true}) // , {preserveDrawingBuffer: true}
  // Set the clear color to be black
  gl.clearColor(0, 0, 0, 1);

  // Call the functions in an appropriate order
  const vertexShader = getVertexShader(gl);
  const fragmentShader = getFragmentShader(gl);

  // Create a program
  program = gl.createProgram();
  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  // Use this program instance
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aVertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
  console.log('aVertexPosition', program.aVertexPosition);
  console.log('aVertexColorAttribute', program.aVertexColorAttribute);

  // camera = new Camera();
  // camera.setPosition(0.0, 0.0, 10.0);
  // program.uCameraMatrix = gl.getUniformLocation(program, 'uCameraMatrix');
  // gl.uniformMatrix4fv(program.uCameraMatrix, false, camera.matrix);

  const { width, height } = canvas;
  program.uInverseTextureSize = gl.getUniformLocation(program, 'uInverseTextureSize');
  gl.uniform2f(program.uInverseTextureSize, 1/width, 1/height);
  console.log('width', width);
  console.log('height', height);
  // time = new Date().getTime() * 0.0001
  // console.log('time', time);
  // uniformLoc = gl.getUniformLocation(program, 'uTime');
  // gl.uniform1f(uniformLoc, time - Math.floor(time));
  
  // init buffer for the ray tracing
  /*
    (-1, 1, 0)        (1, 1, 0)
    X---------------------X
    |                     |
    |                     |
    |       (0, 0)        |
    |                     |
    |                     |
    X---------------------X
    (-1, -1, 0)       (1, -1, 0)
  */
  const vertices = [
    -1, -1, 0,
    1, -1, 0,
    -1, 1, 0,
    -1, 1, 0,
    1, -1, 0,
    1, 1, 0
  ]

  // Init the VBO
  squareVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Clean up the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // draw geometry
  draw();
}

document.getElementById("ds-disk-num-calc").onclick = function() {
  let r = document.getElementById('ds-disk-r');
  let h = document.getElementById('ds-disk-h');
  let theta_deg = document.getElementById('ds-disk-theta');
  let result = document.getElementById('ds-disk-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 1);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  let thetaLoc = gl.getUniformLocation(program, 'uTheta');
  gl.uniform1f(thetaLoc, theta_deg.value*Math.PI/180.0);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['1']
}

document.getElementById("ds-rect-num-calc").onclick = function() {
  let a = document.getElementById('ds-rect-a');
  let b = document.getElementById('ds-rect-b');
  let c = document.getElementById('ds-rect-c');
  let result = document.getElementById('ds-rect-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 2);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let aLoc = gl.getUniformLocation(program, 'uA');
  gl.uniform1f(aLoc, a.value);
  let bLoc = gl.getUniformLocation(program, 'uB');
  gl.uniform1f(bLoc, b.value);
  let cLoc = gl.getUniformLocation(program, 'uC');
  gl.uniform1f(cLoc, c.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['1']
}

document.getElementById("ds-sphere-num-calc").onclick = function() {
  let r = document.getElementById('ds-sphere-r');
  let h = document.getElementById('ds-sphere-h');
  let theta_deg = document.getElementById('ds-sphere-theta');
  let result = document.getElementById('ds-sphere-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 3);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  let thetaLoc = gl.getUniformLocation(program, 'uTheta');
  gl.uniform1f(thetaLoc, theta_deg.value*Math.PI/180.0);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['1']
}

document.getElementById("disk-disk-num-calc").onclick = function() {
  let r1 = document.getElementById('disk-disk-r1');
  let r2 = document.getElementById('disk-disk-r2');
  let h = document.getElementById('disk-disk-h');
  let result = document.getElementById('disk-disk-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 4);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let r1Loc = gl.getUniformLocation(program, 'uR1');
  gl.uniform1f(r1Loc, r1.value);
  let r2Loc = gl.getUniformLocation(program, 'uR2');
  gl.uniform1f(r2Loc, r2.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['2']
}

document.getElementById("rect-rect-p-num-calc").onclick = function() {
  let a = document.getElementById('rect-rect-p-a');
  let b = document.getElementById('rect-rect-p-b');
  let c = document.getElementById('rect-rect-p-c');
  let result = document.getElementById('rect-rect-p-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 5);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let aLoc = gl.getUniformLocation(program, 'uA');
  gl.uniform1f(aLoc, a.value);
  let bLoc = gl.getUniformLocation(program, 'uB');
  gl.uniform1f(bLoc, b.value);
  let cLoc = gl.getUniformLocation(program, 'uC');
  gl.uniform1f(cLoc, c.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['2']
}

document.getElementById("rect-rect-v-num-calc").onclick = function() {
  let l = document.getElementById('rect-rect-v-l');
  let w = document.getElementById('rect-rect-v-w');
  let h = document.getElementById('rect-rect-v-h');
  let result = document.getElementById('rect-rect-v-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 6);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let lLoc = gl.getUniformLocation(program, 'uL');
  gl.uniform1f(lLoc, l.value);
  let wLoc = gl.getUniformLocation(program, 'uW');
  gl.uniform1f(wLoc, w.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['2']
}

function readUint32Array() {
  let pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return new Uint32Array(pixels.buffer);
}

function readFloat32Array() {
  let pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return new Float32Array(pixels.buffer);
}

function readInt32Array() {
  let pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return new Int32Array(pixels.buffer);
}

// Call init once the webpage has loaded
window.onload = init;
window.addEventListener('resize', redraw);