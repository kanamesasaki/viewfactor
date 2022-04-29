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

export function dsToRectangleParallel(a, b, c) {
    let vf
    if (a >= 0 && b >= 0 && c > 0) {
        let A = a/c
        let B = b/c
        vf = 1.0/(2.0*Math.PI) * (A/Math.sqrt(1.0+A*A)*Math.atan(B/Math.sqrt(1.0+A*A))+B/Math.sqrt(1.0+B*B)*Math.atan(A/Math.sqrt(1.0+B*B)))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function dsToRectangleVertical(a, b, c) {
    let vf
    if (a >= 0 && b >= 0 && c > 0) {
        let X = a/b
        let Y = c/b
        vf = 1.0/(2.0*Math.PI) * (Math.atan(1/Y)-Y/Math.sqrt(X*X+Y*Y)*Math.atan(1/Math.sqrt(X*X+Y*Y)))
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

export function dsToCylinder(r, h, l) {
    let vf
    if (h > r && r > 0.0 && l >= 0.0) {
        let L = l/r
        let H = h/r
        let X = (1+H)**2 + L*L
        let Y = (1-H)**2 + L*L
        vf = L/(Math.PI*H) * (1/L * Math.atan(L/Math.sqrt(H*H-1)) + (X-2*H)/Math.sqrt(X*Y) * Math.atan(Math.sqrt((X*(H-1))/(Y*(H+1)))) - Math.atan(Math.sqrt((H-1)/(H+1))))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function diskToDisk(a, r1, r2) {
    let vf
    if (a > 0.0 && r1 > 0.0 && r2 >= 0.0) {
        let R1 = r1/a
        let R2 = r2/a
        let X = 1.0 + (1.0+R2*R2) / (R1*R1)
        vf = 0.5 * (X - Math.sqrt(X*X - 4.0*(R2/R1)**2))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function rectToRectParalell(a, b, c) {
    let vf
    if (a > 0.0, b > 0.0, c > 0.0) {
        let X = a/c
        let Y = b/c
        let X2 = X*X
        let Y2 = Y*Y
        vf = 2.0/(Math.PI*X*Y) * (0.5*Math.log((1+X2)*(1+Y2)/(1+X2+Y2)) + X*Math.sqrt(1+Y2)*Math.atan(X/Math.sqrt(1+Y2)) + Y*Math.sqrt(1+X2)*Math.atan(Y/Math.sqrt(1+X2)) - X*Math.atan(X) - Y*Math.atan(Y))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function rectToRectVertical(h, w, l) {
    let vf
    if (h >= 0.0, w > 0.0, l > 0.0) {
        let H = h/l
        let W = w/l
        let W2 = W*W
        let H2 = H*H
        vf = 1.0/(Math.PI*W) * (0.25*Math.log((1+W2)*(1+H2)/(1+W2+H2)*(W2*(1+W2+H2)/((1+W2)*(W2+H2)))**W2*(H2*(1+W2+H2)/((1+H2)*(W2+H2)))**H2) - Math.sqrt(H2+W2)*Math.atan(1/Math.sqrt(H2+W2)) + W*Math.atan(1/W) + H*Math.atan(1/H))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function sphereToRect(h, l1, l2) {
    let vf
    if (h > 1.0 && l1 > 0.0 && l2 > 0.0) {
        let H1 = h/l1
        let H2 = h/l2
        vf = 1/(4*Math.PI) * Math.atan(Math.sqrt(1/(H1*H1+H2*H2+H1*H1*H2*H2)))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function cylinderToCylinder(h, r1, r2) {
    let vf
    let R = r2/r1
    let H = h/r1
    if (r2 > r1 && r1 > 0.0 && h > 0.0) {
        vf = 1/R * (1 - (H*H+R*R-1)/(4*H) - 1/Math.PI*(Math.acos((H*H-R*R+1)/(H*H+R*R-1)) - Math.sqrt((H*H+R*R+1)**2-4*R*R)/(2*H)*Math.acos((H*H-R*R+1)/(R*(H*H+R*R-1))) - (H*H-R*R+1)/(2*H)*Math.asin(1/R)))
    }
    else {
        vf = Number.NaN
    }
    return vf
}

export function diskToCylinder(h, r) {
    let vf
    let H = h/(2*r)
    if (r > 0.0 && h > 0.0) {
        vf = 2.0*H * (Math.sqrt(1+H*H) - H)
    }
    else {
        vf = Number.NaN
    }
    return vf
}
