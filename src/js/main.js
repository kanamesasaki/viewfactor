import { getVertexShader, getFragmentShader } from './utils.js'
import * as vf from './viewfactor.js'

let gl
let program
let squareVertexBuffer
let widthLoc
let heightLoc
const canvas = document.getElementById('webgl-canvas')

function draw() {
  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aVertexPosition);

  // Draw to the scene using triangle primitives from array data
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function restorContext() {
  console.log('Please reload the web browser')
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

document.getElementById("ds-disk-parallel-ana-calc").onclick = function() {
  let r = document.getElementById('ds-disk-parallel-r');
  let h = document.getElementById('ds-disk-parallel-h');
  let a = document.getElementById('ds-disk-parallel-a');
  let result = document.getElementById('ds-disk-parallel-ana-vf')
  result.value = vf.dsToDiskOffsetParallel(r.value, h.value, a.value);
}

document.getElementById("ds-rect-p-ana-calc").onclick = function() {
  let a = document.getElementById('ds-rect-p-a');
  let b = document.getElementById('ds-rect-p-b');
  let c = document.getElementById('ds-rect-p-c');
  let result = document.getElementById('ds-rect-p-ana-vf')
  result.value = vf.dsToRectangleParallel(a.value, b.value, c.value);
}

document.getElementById("ds-rect-v-ana-calc").onclick = function() {
  let a = document.getElementById('ds-rect-v-a');
  let b = document.getElementById('ds-rect-v-b');
  let c = document.getElementById('ds-rect-v-c');
  let result = document.getElementById('ds-rect-v-ana-vf')
  result.value = vf.dsToRectangleVertical(a.value, b.value, c.value);
}

document.getElementById("ds-sphere-ana-calc").onclick = function() {
  let r = document.getElementById('ds-sphere-r')
  let h = document.getElementById('ds-sphere-h')
  let theta_deg = document.getElementById('ds-sphere-theta')
  let result = document.getElementById('ds-sphere-ana-vf')
  result.value = vf.dsToSphere(r.value, h.value, theta_deg.value)
}

document.getElementById("ds-cylinder-ana-calc").onclick = function() {
  let r = document.getElementById('ds-cylinder-r')
  let h = document.getElementById('ds-cylinder-h')
  let l = document.getElementById('ds-cylinder-l')
  let result = document.getElementById('ds-cylinder-ana-vf')
  result.value = vf.dsToCylinder(r.value, h.value, l.value)
}

document.getElementById("ds-triangle-ana-calc").onclick = function() {
  let h = document.getElementById('ds-triangle-h');
  let l = document.getElementById('ds-triangle-l');
  let theta_deg = document.getElementById('ds-triangle-theta');
  let result = document.getElementById('ds-triangle-ana-vf')
  result.value = vf.dsToTriangle(h.value, l.value, theta_deg.value*Math.PI/180.0);
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

document.getElementById("sphere-rect-ana-calc").onclick = function() {
  let h = document.getElementById('sphere-rect-h')
  let l1 = document.getElementById('sphere-rect-l1')
  let l2 = document.getElementById('sphere-rect-l2')
  let result = document.getElementById('sphere-rect-ana-vf')
  result.value = vf.sphereToRect(h.value, l1.value, l2.value)
}

document.getElementById("sphere-disk-ana-calc").onclick = function() {
  let h = document.getElementById('sphere-disk-h')
  let r = document.getElementById('sphere-disk-r')
  let result = document.getElementById('sphere-disk-ana-vf')
  result.value = vf.sphereToDisk(h.value, r.value)
}

document.getElementById("sphere-cone-ana-calc").onclick = function() {
  let h = document.getElementById('sphere-cone-h')
  let r1 = document.getElementById('sphere-cone-r1')
  let r2 = document.getElementById('sphere-cone-r2')
  let theta_deg = document.getElementById('sphere-cone-theta')
  let result = document.getElementById('sphere-cone-ana-vf')
  result.value = vf.sphereToCone(h.value, r1.value, r2.value, theta_deg.value*Math.PI/180.0)
}

document.getElementById("cylinder-cylinder-ana-calc").onclick = function() {
  let h = document.getElementById('cylinder-cylinder-h')
  let r1 = document.getElementById('cylinder-cylinder-r1')
  let r2 = document.getElementById('cylinder-cylinder-r2')
  let result = document.getElementById('cylinder-cylinder-ana-vf')
  result.value = vf.cylinderToCylinder(h.value, r1.value, r2.value)
}

document.getElementById("disk-cylinder-ana-calc").onclick = function() {
  let h = document.getElementById('disk-cylinder-h')
  let r = document.getElementById('disk-cylinder-r')
  let result = document.getElementById('disk-cylinder-ana-vf')
  result.value = vf.diskToCylinder(h.value, r.value)
}

document.getElementById("cone-disk-ana-calc").onclick = function() {
  let h = document.getElementById('cone-disk-h')
  let r = document.getElementById('cone-disk-r')
  let result = document.getElementById('cone-disk-ana-vf')
  result.value = vf.coneToDisk(h.value, r.value)
}

// Entry point to our application
function init() {
  canvas.width = 1000; // window.innerWidth;
  canvas.height = 250; // window.innerHeight;

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
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aVertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");

  const { width, height } = canvas;
  program.uInverseTextureSize = gl.getUniformLocation(program, 'uInverseTextureSize');
  gl.uniform2f(program.uInverseTextureSize, 1/width, 1/height);
  console.log('width', width);
  console.log('height', height);
  
  /*
    (-1, 1, 0)        (1, 1, 0)
    X---------------------X
    |                     |
    |       (0, 0)        |
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
  // draw();
}

document.getElementById("ds-disk-num-calc").onclick = function() {
  let r = document.getElementById('ds-disk-r');
  let h = document.getElementById('ds-disk-h');
  let theta_deg = document.getElementById('ds-disk-theta');
  let result = document.getElementById('ds-disk-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 0);
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

document.getElementById("ds-disk-parallel-num-calc").onclick = function() {
  let r = document.getElementById('ds-disk-parallel-r');
  let h = document.getElementById('ds-disk-parallel-h');
  let a = document.getElementById('ds-disk-parallel-a');
  let result = document.getElementById('ds-disk-parallel-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 1);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width)
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  let aLoc = gl.getUniformLocation(program, 'uA');
  gl.uniform1f(aLoc, a.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['1']
}

document.getElementById("ds-rect-p-num-calc").onclick = function() {
  let a = document.getElementById('ds-rect-p-a');
  let b = document.getElementById('ds-rect-p-b');
  let c = document.getElementById('ds-rect-p-c');
  let result = document.getElementById('ds-rect-p-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 3);
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

document.getElementById("ds-rect-v-num-calc").onclick = function() {
  let a = document.getElementById('ds-rect-v-a');
  let b = document.getElementById('ds-rect-v-b');
  let c = document.getElementById('ds-rect-v-c');
  let result = document.getElementById('ds-rect-v-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 4);
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
  gl.uniform1i(caseLoc, 5);
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

document.getElementById("ds-cylinder-num-calc").onclick = function() {
  let r = document.getElementById('ds-cylinder-r');
  let h = document.getElementById('ds-cylinder-h');
  let l = document.getElementById('ds-cylinder-l');
  let result = document.getElementById('ds-cylinder-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 6);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  let lLoc = gl.getUniformLocation(program, 'uL');
  gl.uniform1f(lLoc, l.value);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['1']
}

document.getElementById("ds-triangle-num-calc").onclick = function() {
  let h = document.getElementById('ds-triangle-h');
  let l = document.getElementById('ds-triangle-l');
  let theta_deg = document.getElementById('ds-triangle-theta');
  let result = document.getElementById('ds-triangle-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 7);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let hLoc = gl.getUniformLocation(program, 'uH');
  gl.uniform1f(hLoc, h.value);
  let lLoc = gl.getUniformLocation(program, 'uL');
  gl.uniform1f(lLoc, l.value);
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
  gl.uniform1i(caseLoc, 10);
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
  gl.uniform1i(caseLoc, 20);
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
  gl.uniform1i(caseLoc, 21);
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

document.getElementById("sphere-rect-num-calc").onclick = function() {
  let l1 = document.getElementById('sphere-rect-l1');
  let l2 = document.getElementById('sphere-rect-l2');
  let h = document.getElementById('sphere-rect-h');
  let result = document.getElementById('sphere-rect-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 30);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let l1Loc = gl.getUniformLocation(program, 'uL1');
  gl.uniform1f(l1Loc, l1.value);
  let l2Loc = gl.getUniformLocation(program, 'uL2');
  gl.uniform1f(l2Loc, l2.value);
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

document.getElementById("sphere-disk-num-calc").onclick = function() {
  let r = document.getElementById('sphere-disk-r');
  let h = document.getElementById('sphere-disk-h');
  let result = document.getElementById('sphere-disk-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 31);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
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

document.getElementById("sphere-cone-num-calc").onclick = function() {
  let r1 = document.getElementById('sphere-cone-r1');
  let r2 = document.getElementById('sphere-cone-r2');
  let h = document.getElementById('sphere-cone-h');
  let theta_deg = document.getElementById('sphere-cone-theta');
  let result = document.getElementById('sphere-cone-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 33);
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
  let thetaLoc = gl.getUniformLocation(program, 'uTheta');
  gl.uniform1f(thetaLoc, theta_deg.value*Math.PI/180.0);
  draw();

  let array = readInt32Array();
  let count = arrayCount(array);
  let vf = {}
  for( const property in count ) {
    vf[property] = count[property] / (gl.drawingBufferWidth*gl.drawingBufferHeight)
  }
  result.value = vf['2']
}

document.getElementById("cylinder-cylinder-num-calc").onclick = function() {
  let r1 = document.getElementById('cylinder-cylinder-r1');
  let r2 = document.getElementById('cylinder-cylinder-r2');
  let h = document.getElementById('cylinder-cylinder-h');
  let result = document.getElementById('cylinder-cylinder-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 40);
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

document.getElementById("disk-cylinder-num-calc").onclick = function() {
  let r = document.getElementById('disk-cylinder-r');
  let h = document.getElementById('disk-cylinder-h');
  let result = document.getElementById('disk-cylinder-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 11);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
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

document.getElementById("cone-disk-num-calc").onclick = function() {
  let r = document.getElementById('cone-disk-r');
  let h = document.getElementById('cone-disk-h');
  let result = document.getElementById('cone-disk-num-vf')
  
  let caseLoc = gl.getUniformLocation(program, 'uCase');
  gl.uniform1i(caseLoc, 50);
  widthLoc = gl.getUniformLocation(program, 'uWidth');
  gl.uniform1i(widthLoc, canvas.width);
  heightLoc = gl.getUniformLocation(program, 'uHeight');
  gl.uniform1i(heightLoc, canvas.height);
  let rLoc = gl.getUniformLocation(program, 'uR');
  gl.uniform1f(rLoc, r.value);
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

window.onload = init;
canvas.addEventListener('webglcontextlost', restorContext);