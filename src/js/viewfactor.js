export function dsToDisk(r, h, theta_deg) {
    let vf
    let theta = theta_deg*Math.PI/180.0
    if (theta <= Math.atan2(h, r)) {
        vf = r*r / (r*r+h*h) * Math.cos(theta)
    }
    else if ((theta >= Math.atan2(r, h) + Math.PI/2)) {
        vf = 0.0
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function dsToRectangle(a, b, c) {
    let vf
    let A = a/c
    let B = b/c
    if (a >= 0 && b >= 0 && c > 0) {
        vf = 1.0/(2.0*Math.PI) * (A/Math.sqrt(1.0+A*A)*Math.atan(B/Math.sqrt(1.0+A*A))+B/Math.sqrt(1.0+B*B)*Math.atan(A/Math.sqrt(1.0+B*B)))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function dsToSphere(r, h, theta_deg) {
    let vf
    let theta = theta_deg*Math.PI/180.0
    if (theta <= Math.acos(r/h) && h > r) {
        vf = (r/h)**2 * Math.cos(theta)
    }
    else if ((theta >= Math.asin(r/h) + Math.PI/2) && h > r) {
        vf = 0.0
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function diskToDisk(a, r1, r2) {
    let vf
    let R1 = r1/a
    let R2 = r2/a
    let X = 1.0 + (1.0+R2*R2) / (R1*R1)
    if (a > 0.0 && r1 > 0.0 && r2 >= 0.0) {
        vf = 0.5 * (X - Math.sqrt(X*X - 4.0*(R2/R1)**2))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function rectToRectParalell(a, b, c) {
    let vf
    let X = a/c
    let Y = b/c
    let X2 = X*X
    let Y2 = Y*Y
    if (a > 0.0, b > 0.0, c > 0.0) {
        vf = 2.0/(Math.PI*X*Y) * (0.5*Math.log((1+X2)*(1+Y2)/(1+X2+Y2)) + X*Math.sqrt(1+Y2)*Math.atan(X/Math.sqrt(1+Y2)) + Y*Math.sqrt(1+X2)*Math.atan(Y/Math.sqrt(1+X2)) - X*Math.atan(X) - Y*Math.atan(Y))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function rectToRectVertical(h, w, l) {
    let vf
    let H = h/l
    let W = w/l
    let W2 = W*W
    let H2 = H*H
    if (h >= 0.0, w > 0.0, l > 0.0) {
        vf = 1.0/(Math.PI*W) * (0.25*Math.log((1+W2)*(1+H2)/(1+W2+H2)*(W2*(1+W2+H2)/((1+W2)*(W2+H2)))**W2*(H2*(1+W2+H2)/((1+H2)*(W2+H2)))**H2) - Math.sqrt(H2+W2)*Math.atan(1/Math.sqrt(H2+W2)) + W*Math.atan(1/W) + H*Math.atan(1/H))
    }
    else {
        vf = Number.NaN
    }
    return vf
}





