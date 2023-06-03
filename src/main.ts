import * as vf from './viewfactor'

let nRays: number = 100000;
const worker: Worker = new Worker('worker.js');
const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
const offscreen = canvas.transferControlToOffscreen();
let time_start: number;
let time_end: number;

document.getElementById("ds-disk-ana-calc")!.onclick = function() {
  let r = document.getElementById('ds-disk-r') as HTMLInputElement;
  let h = document.getElementById('ds-disk-h') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-disk-theta') as HTMLInputElement;
  let result = document.getElementById('ds-disk-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToDisk(Number(r.value), Number(h.value), Number(theta_deg.value)));
}

document.getElementById("ds-disk-parallel-ana-calc")!.onclick = function() {
  let r = document.getElementById('ds-disk-parallel-r') as HTMLInputElement;
  let h = document.getElementById('ds-disk-parallel-h') as HTMLInputElement;
  let a = document.getElementById('ds-disk-parallel-a') as HTMLInputElement;
  let result = document.getElementById('ds-disk-parallel-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToDiskOffsetParallel(Number(r.value), Number(h.value), Number(a.value)));
}

document.getElementById("ds-rect-p-ana-calc")!.onclick = function() {
  let a = document.getElementById('ds-rect-p-a') as HTMLInputElement;
  let b = document.getElementById('ds-rect-p-b') as HTMLInputElement;
  let c = document.getElementById('ds-rect-p-c') as HTMLInputElement;
  let result = document.getElementById('ds-rect-p-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToRectangleParallel(Number(a.value), Number(b.value), Number(c.value)));
}

document.getElementById("ds-rect-v-ana-calc")!.onclick = function() {
  let a = document.getElementById('ds-rect-v-a') as HTMLInputElement;
  let b = document.getElementById('ds-rect-v-b') as HTMLInputElement;
  let c = document.getElementById('ds-rect-v-c') as HTMLInputElement;
  let result = document.getElementById('ds-rect-v-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToRectangleVertical(Number(a.value), Number(b.value), Number(c.value)));
}

document.getElementById("ds-sphere-ana-calc")!.onclick = function() {
  let r = document.getElementById('ds-sphere-r') as HTMLInputElement;
  let h = document.getElementById('ds-sphere-h') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-sphere-theta') as HTMLInputElement;
  let result = document.getElementById('ds-sphere-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToSphere(Number(r.value), Number(h.value), Number(theta_deg.value)));
}

document.getElementById("ds-cylinder-ana-calc")!.onclick = function() {
  let r = document.getElementById('ds-cylinder-r') as HTMLInputElement;
  let h = document.getElementById('ds-cylinder-h') as HTMLInputElement;
  let l = document.getElementById('ds-cylinder-l') as HTMLInputElement;
  let result = document.getElementById('ds-cylinder-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToCylinder(Number(r.value), Number(h.value), Number(l.value)))
}

document.getElementById("ds-triangle-ana-calc")!.onclick = function() {
  let h = document.getElementById('ds-triangle-h') as HTMLInputElement;
  let l = document.getElementById('ds-triangle-l') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-triangle-theta') as HTMLInputElement;
  let result = document.getElementById('ds-triangle-ana-vf') as HTMLInputElement;
  result.value = String(vf.dsToTriangle(Number(h.value), Number(l.value), Number(theta_deg.value)*Math.PI/180.0));
}

document.getElementById("disk-disk-ana-calc")!.onclick = function() {
  let r1 = document.getElementById('disk-disk-r1') as HTMLInputElement;
  let r2 = document.getElementById('disk-disk-r2') as HTMLInputElement;
  let h = document.getElementById('disk-disk-h') as HTMLInputElement;
  let result = document.getElementById('disk-disk-ana-vf') as HTMLInputElement;
  result.value = String(vf.diskToDisk(Number(h.value), Number(r1.value), Number(r2.value)));
}

document.getElementById("rect-rect-p-ana-calc")!.onclick = function() {
  let a = document.getElementById('rect-rect-p-a') as HTMLInputElement;
  let b = document.getElementById('rect-rect-p-b') as HTMLInputElement;
  let c = document.getElementById('rect-rect-p-c') as HTMLInputElement;
  let result = document.getElementById('rect-rect-p-ana-vf') as HTMLInputElement;
  result.value = String(vf.rectToRectParalell(Number(a.value), Number(b.value), Number(c.value)));
}

document.getElementById("rect-rect-v-ana-calc")!.onclick = function() {
  let h = document.getElementById('rect-rect-v-h') as HTMLInputElement;
  let w = document.getElementById('rect-rect-v-w') as HTMLInputElement;
  let l = document.getElementById('rect-rect-v-l') as HTMLInputElement;
  let result = document.getElementById('rect-rect-v-ana-vf') as HTMLInputElement;
  result.value = String(vf.rectToRectVertical(Number(h.value), Number(w.value), Number(l.value)));
}

document.getElementById("sphere-rect-ana-calc")!.onclick = function() {
  let h = document.getElementById('sphere-rect-h') as HTMLInputElement;
  let l1 = document.getElementById('sphere-rect-l1') as HTMLInputElement;
  let l2 = document.getElementById('sphere-rect-l2') as HTMLInputElement;
  let result = document.getElementById('sphere-rect-ana-vf') as HTMLInputElement;
  result.value = String(vf.sphereToRect(Number(h.value), Number(l1.value), Number(l2.value)));
}

document.getElementById("sphere-disk-ana-calc")!.onclick = function() {
  let h = document.getElementById('sphere-disk-h') as HTMLInputElement;
  let r = document.getElementById('sphere-disk-r') as HTMLInputElement;
  let result = document.getElementById('sphere-disk-ana-vf') as HTMLInputElement;
  result.value = String(vf.sphereToDisk(Number(h.value), Number(r.value)));
}

document.getElementById("sphere-cone-ana-calc")!.onclick = function() {
  let h = document.getElementById('sphere-cone-h') as HTMLInputElement;
  let r1 = document.getElementById('sphere-cone-r1') as HTMLInputElement;
  let r2 = document.getElementById('sphere-cone-r2') as HTMLInputElement;
  let theta_deg = document.getElementById('sphere-cone-theta') as HTMLInputElement;
  let result = document.getElementById('sphere-cone-ana-vf') as HTMLInputElement;
  result.value = String(vf.sphereToCone(Number(h.value), Number(r1.value), Number(r2.value), Number(theta_deg.value)*Math.PI/180.0));
}

document.getElementById("cylinder-cylinder-ana-calc")!.onclick = function() {
  let h = document.getElementById('cylinder-cylinder-h') as HTMLInputElement;
  let r1 = document.getElementById('cylinder-cylinder-r1') as HTMLInputElement;
  let r2 = document.getElementById('cylinder-cylinder-r2') as HTMLInputElement;
  let result = document.getElementById('cylinder-cylinder-ana-vf') as HTMLInputElement;
  result.value = String(vf.cylinderToCylinder(Number(h.value), Number(r1.value), Number(r2.value)));
}

document.getElementById("disk-cylinder-ana-calc")!.onclick = function() {
  let h = document.getElementById('disk-cylinder-h') as HTMLInputElement;
  let r = document.getElementById('disk-cylinder-r') as HTMLInputElement;
  let result = document.getElementById('disk-cylinder-ana-vf') as HTMLInputElement;
  result.value = String(vf.diskToCylinder(Number(h.value), Number(r.value)));
}

document.getElementById("cone-disk-ana-calc")!.onclick = function() {
  let h = document.getElementById('cone-disk-h') as HTMLInputElement;
  let r = document.getElementById('cone-disk-r') as HTMLInputElement;
  let result = document.getElementById('cone-disk-ana-vf') as HTMLInputElement;
  result.value = String(vf.coneToDisk(Number(h.value), Number(r.value)));
}

document.getElementById("ds-disk-num-calc")!.onclick = function() {
  time_start = new Date().getTime();
  let r = document.getElementById('ds-disk-r') as HTMLInputElement;
  let h = document.getElementById('ds-disk-h') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-disk-theta') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-disk', 'r': Number(r.value), 'h': Number(h.value), 'theta': Number(theta_deg.value)*Math.PI/180.0});
}

document.getElementById("ds-disk-parallel-num-calc")!.onclick = function() {
  let r = document.getElementById('ds-disk-parallel-r') as HTMLInputElement;
  let h = document.getElementById('ds-disk-parallel-h') as HTMLInputElement;
  let a = document.getElementById('ds-disk-parallel-a') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-disk-parallel', 'r': Number(r.value), 'h': Number(h.value), 'a': Number(a.value)});
}

document.getElementById("ds-rect-p-num-calc")!.onclick = function() {
  let a = document.getElementById('ds-rect-p-a') as HTMLInputElement;
  let b = document.getElementById('ds-rect-p-b') as HTMLInputElement;
  let c = document.getElementById('ds-rect-p-c') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-rect-p', 'a': Number(a.value), 'b': Number(b.value), 'c': Number(c.value)});
}

document.getElementById("ds-rect-v-num-calc")!.onclick = function() {
  let a = document.getElementById('ds-rect-v-a') as HTMLInputElement;
  let b = document.getElementById('ds-rect-v-b') as HTMLInputElement;
  let c = document.getElementById('ds-rect-v-c') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-rect-v', 'a': Number(a.value), 'b': Number(b.value), 'c': Number(c.value)});
}

document.getElementById("ds-sphere-num-calc")!.onclick = function() {
  let r = document.getElementById('ds-sphere-r') as HTMLInputElement;
  let h = document.getElementById('ds-sphere-h') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-sphere-theta') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-sphere', 'r': Number(r.value), 'h': Number(h.value), 'theta': Number(theta_deg.value)*Math.PI/180.0});
}

document.getElementById("ds-cylinder-num-calc")!.onclick = function() {
  let r = document.getElementById('ds-cylinder-r') as HTMLInputElement;
  let h = document.getElementById('ds-cylinder-h') as HTMLInputElement;
  let l = document.getElementById('ds-cylinder-l') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-cylinder', 'r': Number(r.value), 'h': Number(h.value), 'l': Number(l.value)});
}

document.getElementById("ds-triangle-num-calc")!.onclick = function() {
  let h = document.getElementById('ds-triangle-h') as HTMLInputElement;
  let l = document.getElementById('ds-triangle-l') as HTMLInputElement;
  let theta_deg = document.getElementById('ds-triangle-theta') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'ds-triangle', 'h': Number(h.value), 'l': Number(l.value), 'theta': Number(theta_deg.value)*Math.PI/180.0});
}

document.getElementById("disk-disk-num-calc")!.onclick = function() {
  let r1 = document.getElementById('disk-disk-r1') as HTMLInputElement;
  let r2 = document.getElementById('disk-disk-r2') as HTMLInputElement;
  let h = document.getElementById('disk-disk-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'disk-disk', 'r1': Number(r1.value), 'r2': Number(r2.value), 'h': Number(h.value)});
}

document.getElementById("rect-rect-p-num-calc")!.onclick = function() {
  let a = document.getElementById('rect-rect-p-a') as HTMLInputElement;
  let b = document.getElementById('rect-rect-p-b') as HTMLInputElement;
  let c = document.getElementById('rect-rect-p-c') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'rect-rect-p', 'a': Number(a.value), 'b': Number(b.value), 'c': Number(c.value)});
}

document.getElementById("rect-rect-v-num-calc")!.onclick = function() {
  let l = document.getElementById('rect-rect-v-l') as HTMLInputElement;
  let w = document.getElementById('rect-rect-v-w') as HTMLInputElement;
  let h = document.getElementById('rect-rect-v-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'rect-rect-v', 'l': Number(l.value), 'w': Number(w.value), 'h': Number(h.value)});
}

document.getElementById("sphere-rect-num-calc")!.onclick = function() {
  let l1 = document.getElementById('sphere-rect-l1') as HTMLInputElement;
  let l2 = document.getElementById('sphere-rect-l2') as HTMLInputElement;
  let h = document.getElementById('sphere-rect-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'sphere-rect', 'l1': Number(l1.value), 'l2': Number(l2.value), 'h': Number(h.value)});
}

document.getElementById("sphere-disk-num-calc")!.onclick = function() {
  let r = document.getElementById('sphere-disk-r') as HTMLInputElement;
  let h = document.getElementById('sphere-disk-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'sphere-disk', 'r': Number(r.value), 'h': Number(h.value)});
}

document.getElementById("sphere-cone-num-calc")!.onclick = function() {
  let r1 = document.getElementById('sphere-cone-r1') as HTMLInputElement;
  let r2 = document.getElementById('sphere-cone-r2') as HTMLInputElement;
  let h = document.getElementById('sphere-cone-h') as HTMLInputElement;
  let theta_deg = document.getElementById('sphere-cone-theta') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'sphere-cone', 'r1': Number(r1.value), 'r2': Number(r2.value), 'h': Number(h.value), 'theta': Number(theta_deg.value)*Math.PI/180.0});
}

document.getElementById("cylinder-cylinder-num-calc")!.onclick = function() {
  let r1 = document.getElementById('cylinder-cylinder-r1') as HTMLInputElement;
  let r2 = document.getElementById('cylinder-cylinder-r2') as HTMLInputElement;
  let h = document.getElementById('cylinder-cylinder-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'cylinder-cylinder', 'r1': Number(r1.value), 'r2': Number(r2.value), 'h': Number(h.value)});
}

document.getElementById("disk-cylinder-num-calc")!.onclick = function() {
  let r = document.getElementById('disk-cylinder-r') as HTMLInputElement;
  let h = document.getElementById('disk-cylinder-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'disk-cylinder', 'r': Number(r.value), 'h': Number(h.value)});
}

document.getElementById("cone-disk-num-calc")!.onclick = function() {
  let r = document.getElementById('cone-disk-r') as HTMLInputElement;
  let h = document.getElementById('cone-disk-h') as HTMLInputElement;
  worker.postMessage({'nRays': nRays, 'type': 'cone-disk', 'r': Number(r.value), 'h': Number(h.value)});
}

function init() {
  time_start = new Date().getTime();
  worker.postMessage({'canvas': offscreen, 'nRays': nRays, 'type': 'init'}, [offscreen]);
}

worker.onmessage = (evt) => {
  let result: HTMLInputElement;
  console.log(evt.data);
  switch (evt.data.type) {
    case 'init':
      time_end = new Date().getTime();
      console.log('init time: ' + (time_end - time_start) + 'ms');
      break;
    case 'ds-disk':
      result = document.getElementById('ds-disk-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-disk-parallel':
      result = document.getElementById('ds-disk-parallel-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-rect-p':
      result = document.getElementById('ds-rect-p-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-rect-v':
      result = document.getElementById('ds-rect-v-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-sphere':
      result = document.getElementById('ds-sphere-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-cylinder':
      result = document.getElementById('ds-cylinder-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'ds-triangle':
      result = document.getElementById('ds-triangle-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'disk-disk':
      result = document.getElementById('disk-disk-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'rect-rect-p':
      result = document.getElementById('rect-rect-p-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'rect-rect-v':
      result = document.getElementById('rect-rect-v-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'sphere-rect':
      result = document.getElementById('sphere-rect-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'sphere-disk':
      result = document.getElementById('sphere-disk-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'sphere-cone':
      result = document.getElementById('sphere-cone-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'cylinder-cylinder':
      result = document.getElementById('cylinder-cylinder-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'disk-cylinder':
      result = document.getElementById('disk-cylinder-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
    case 'cone-disk':
      result = document.getElementById('cone-disk-num-vf') as HTMLInputElement;
      result.value = evt.data.vf.toString();
      break;
  }
};
  
// Call init once the webpage has loaded
window.onload = init;