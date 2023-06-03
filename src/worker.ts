import { getVertexShader, getFragmentShader } from './utils'

let gl: WebGL2RenderingContext | null
let program: WebGLProgram | null
let tfBuffer: WebGLBuffer | null
let vao: WebGLVertexArrayObject | null
let tf: WebGLTransformFeedback | null
let seed: number[]

onmessage = (evt: MessageEvent) => {
    let vf: number = 0.0;
    switch (evt.data.type) {
        case 'init':
            init(evt);
            postMessage({'type': 'init'});
            break;
        case 'ds-disk':
            vf = dsDisk(evt);
            postMessage({'vf': vf, 'type': 'ds-disk'});
            break;
        case 'ds-disk-parallel':
            vf = dsDiskParallel(evt);
            postMessage({'vf': vf, 'type': 'ds-disk-parallel'});
            break;
        case 'ds-rect-p':
            vf = dsRectP(evt);
            postMessage({'vf': vf, 'type': 'ds-rect-p'});
            break;
        case 'ds-rect-v':
            vf = dsRectV(evt);
            postMessage({'vf': vf, 'type': 'ds-rect-v'});
            break;
        case 'ds-sphere':
            vf = dsSphere(evt);
            postMessage({'vf': vf, 'type': 'ds-sphere'});
            break;
        case 'ds-cylinder':
            vf = dsCylinder(evt);
            postMessage({'vf': vf, 'type': 'ds-cylinder'});
            break;
        case 'ds-triangle':
            vf = dsTriangle(evt);
            postMessage({'vf': vf, 'type': 'ds-triangle'});
            break;
        case 'disk-disk':
            vf = diskDisk(evt);
            postMessage({'vf': vf, 'type': 'disk-disk'});
            break;
        case 'rect-rect-p':
            vf = rectRectP(evt);
            postMessage({'vf': vf, 'type': 'rect-rect-p'});
            break;
        case 'rect-rect-v':
            vf = rectRectV(evt);
            postMessage({'vf': vf, 'type': 'rect-rect-v'});
            break;
        case 'sphere-rect':
            vf = sphereRect(evt);
            postMessage({'vf': vf, 'type': 'sphere-rect'});
            break;
        case 'sphere-disk':
            vf = sphereDisk(evt);
            postMessage({'vf': vf, 'type': 'sphere-disk'});
            break;
        case 'sphere-cone':
            vf = sphereCone(evt);
            postMessage({'vf': vf, 'type': 'sphere-cone'});
            break;
        case 'cylinder-cylinder':
            vf = cylinderCylinder(evt);
            postMessage({'vf': vf, 'type': 'cylinder-cylinder'});
            break;
        case 'disk-cylinder':
            vf = diskCylinder(evt);
            postMessage({'vf': vf, 'type': 'disk-cylinder'});
            break;
        case 'cone-disk':
            vf = coneDisk(evt);
            postMessage({'vf': vf, 'type': 'cone-disk'});
            break;
        default:
            throw new Error('Unknown message type');
    }
}

/**
 * Counts the number of occurrences of each element in a Float32Array
 * @param {Float32Array} arr - The array to count the occurrences of each element
 * @returns {number[]} An array containing the count of each element
 */
function arrayCount(arr: Float32Array) {
    let count: number[] = [];
  
    for (let i: number = 0; i < arr.length; i++) {
      let elm = Math.floor(arr[i]);
      // if count[elm] is falsey, set 0 + 1, otherwise count[elm] + 1
      count[elm] = (count[elm] || 0) + 1;
    }
    return count;
}

function draw(): Float32Array {
    if (gl === null) {
        throw new Error('Could not get WebGL2 context');
    }
    // Activate the program and bind the VAO
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // Disable the rasterizer and bind the Transform Feedback
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

    // Start the Transform Feedback and execute the draw call
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, seed.length);
    gl.endTransformFeedback();

    // Unbind the Transform Feedback and enable the rasterizer
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);

    // Unbind the VAO and deactivate the program
    gl.bindVertexArray(null);
    gl.useProgram(null);

    // Create a Float32Array and get the data from the Transform Feedback buffer
    let result = new Float32Array(seed.length);
    gl.bindBuffer(gl.ARRAY_BUFFER, tfBuffer);
    gl.getBufferSubData(
        gl.ARRAY_BUFFER,
        0,    // byte offset into GPU buffer,
        result,
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    return result;
}

function dsDisk(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 0);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let thetaLoc = gl.getUniformLocation(program, 'uTheta');
    gl.uniform1f(thetaLoc, evt.data.theta);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsDiskParallel(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 1);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let aLoc = gl.getUniformLocation(program, 'uA');
    gl.uniform1f(aLoc, evt.data.a);
    let array: Float32Array = draw();
    gl.useProgram(null);
  
    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsRectP(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 3);
    let aLoc = gl.getUniformLocation(program, 'uA');
    gl.uniform1f(aLoc, evt.data.a);
    let bLoc = gl.getUniformLocation(program, 'uB');
    gl.uniform1f(bLoc, evt.data.b);
    let cLoc = gl.getUniformLocation(program, 'uC');
    gl.uniform1f(cLoc, evt.data.c);
    let array: Float32Array = draw();
    gl.useProgram(null);
  
    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsRectV(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 4);
    let aLoc = gl.getUniformLocation(program, 'uA');
    gl.uniform1f(aLoc, evt.data.a);
    let bLoc = gl.getUniformLocation(program, 'uB');
    gl.uniform1f(bLoc, evt.data.b);
    let cLoc = gl.getUniformLocation(program, 'uC');
    gl.uniform1f(cLoc, evt.data.c);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsSphere(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 5);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let thetaLoc = gl.getUniformLocation(program, 'uTheta');
    gl.uniform1f(thetaLoc, evt.data.theta);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsCylinder(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 6);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let lLoc = gl.getUniformLocation(program, 'uL');
    gl.uniform1f(lLoc, evt.data.l);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function dsTriangle(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 7);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let lLoc = gl.getUniformLocation(program, 'uL');
    gl.uniform1f(lLoc, evt.data.l);
    let thetaLoc = gl.getUniformLocation(program, 'uTheta');
    gl.uniform1f(thetaLoc, evt.data.theta);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[1];
}

function diskDisk(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 10);
    let r1Loc = gl.getUniformLocation(program, 'uR1');
    gl.uniform1f(r1Loc, evt.data.r1);
    let r2Loc = gl.getUniformLocation(program, 'uR2');
    gl.uniform1f(r2Loc, evt.data.r2);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function rectRectP(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 20);
    let aLoc = gl.getUniformLocation(program, 'uA');
    gl.uniform1f(aLoc, evt.data.a);
    let bLoc = gl.getUniformLocation(program, 'uB');
    gl.uniform1f(bLoc, evt.data.b);
    let cLoc = gl.getUniformLocation(program, 'uC');
    gl.uniform1f(cLoc, evt.data.c);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function rectRectV(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 21);
    let lLoc = gl.getUniformLocation(program, 'uL');
    gl.uniform1f(lLoc, evt.data.l);
    let wLoc = gl.getUniformLocation(program, 'uW');
    gl.uniform1f(wLoc, evt.data.w);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function sphereRect(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 30);
    let l1Loc = gl.getUniformLocation(program, 'uL1');
    gl.uniform1f(l1Loc, evt.data.l1);
    let l2Loc = gl.getUniformLocation(program, 'uL2');
    gl.uniform1f(l2Loc, evt.data.l2);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function sphereDisk(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 31);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function sphereCone(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 33);
    let r1Loc = gl.getUniformLocation(program, 'uR1');
    gl.uniform1f(r1Loc, evt.data.r1);
    let r2Loc = gl.getUniformLocation(program, 'uR2');
    gl.uniform1f(r2Loc, evt.data.r2);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let thetaLoc = gl.getUniformLocation(program, 'uTheta');
    gl.uniform1f(thetaLoc, evt.data.theta);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function cylinderCylinder(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 40);
    let r1Loc = gl.getUniformLocation(program, 'uR1');
    gl.uniform1f(r1Loc, evt.data.r1);
    let r2Loc = gl.getUniformLocation(program, 'uR2');
    gl.uniform1f(r2Loc, evt.data.r2);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function diskCylinder(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 11);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function coneDisk(evt: MessageEvent): number {
    if (gl === null || program === null) {
        throw new Error('gl or program is null')
    }
    gl.useProgram(program);
    let caseLoc = gl.getUniformLocation(program, 'uCase');
    gl.uniform1i(caseLoc, 50);
    let rLoc = gl.getUniformLocation(program, 'uR');
    gl.uniform1f(rLoc, evt.data.r);
    let hLoc = gl.getUniformLocation(program, 'uH');
    gl.uniform1f(hLoc, evt.data.h);
    let array: Float32Array = draw();
    gl.useProgram(null);

    let count: number[] = arrayCount(array);
    let vf = count.map((c) => (c / evt.data.nRays) || 0);
    return vf[2];
}

function init(evt: MessageEvent): void {
    const nRays = evt.data.nRays;
    const canvas = evt.data.canvas;

    gl = canvas.getContext('webgl2') 
    if (gl === null) {
        throw new Error('Could not get WebGL2 context')
    }

    // Call the functions in an appropriate order
    const vertexShader = getVertexShader(gl);
    const fragmentShader = getFragmentShader(gl);
    if (vertexShader === null || fragmentShader === null) {
        throw new Error('Could not create shaders')
    }

    // Create a program
    program = gl.createProgram();
    if (program === null) {
        throw new Error('Could not create program')
    }
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader); 
    gl.transformFeedbackVaryings(
        program,
        ['oCalc'],
        gl.SEPARATE_ATTRIBS
    );
    gl.linkProgram(program);
    // Check if the program linked successfully
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Could not initialize shaders');
    }

    // get the locations of the attributes in the related program
    let iSeedLoc: number = gl.getAttribLocation(program, 'iSeed');
    
    // create a vertex array object (vao)
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    // create the seed array [0, 1, 2, ..., nRays-1]
    seed = Array.from({length: nRays}, (_, i) => i);

    // make a buffer for the seed in GPU memory
    const seedBuf = gl.createBuffer();
    // set the gl.ARRAY_BUFFER (buffer containing vertex attributes) to seedBuf 
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
    // copy the data from the seed array into the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(seed), gl.STATIC_DRAW);
    // enable the attribute at location iSeedLoc 
    gl.enableVertexAttribArray(iSeedLoc);
    // set the layout of the attribute at location iSeedLoc
    gl.vertexAttribPointer(
        iSeedLoc,
        1,         // size (num components)
        gl.FLOAT,  // type of data in buffer
        false,     // normalize
        0,         // stride (0 = auto)
        0,         // offset
    );
    gl.bindVertexArray(null);

    // transform feedback object
    tf = gl.createTransformFeedback();
    
    // make buffers for output
    tfBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tfBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nRays), gl.DYNAMIC_COPY)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    // bind the buffers to the transform feedback
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, tfBuffer);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
}

  