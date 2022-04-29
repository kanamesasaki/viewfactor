export default `#version 300 es
precision mediump float;

in vec4 vColor;
uniform vec2 uInverseTextureSize;
out vec4 fragColor;
uniform int uWidth;
uniform int uHeight;
uniform int uInitFlag;

// Calculation case
uniform int uCase;
// 0: dsToDisk
// 1: dsToDiskOffsetParallel
// 2: dsToDiskOffsetVertical
// 3: dsToRectParallel
// 4: dsToRectVertical
// 5: dsToSphere
// 6: dsToCylinder

// 10: diskToDisk
// 11: diskToCylinder
// 20: rectToRectParallel
// 21: rectToRectVertical
// 30: sphereToRect
// 31: sphereToDisk
// 33: spehreToCone
// 40: cylinderToCylinder

// 100: triToTriArbitrary
// 101: rectTorectArbitrary

uniform float uR;
uniform float uH;
uniform float uTheta;
uniform float uA;
uniform float uB;
uniform float uC;
uniform float uR1;
uniform float uR2;
uniform float uL;
uniform float uL1;
uniform float uL2;
uniform float uW;

const float PI = 3.141592653589793238462643383;

// MRG32k3a parameters
uint[3] x1 = uint[3](0u, 0u, 1234567u);
uint[3] x2 = uint[3](0u, 0u, 1234567u);
const uint[9] a1 = uint[9](0u, 1u, 0u, 0u, 0u, 1u, 4294156359u, 1403580u, 0u);
const uint[9] a2 = uint[9](0u, 1u, 0u, 0u, 0u, 1u, 4293573854u, 0u, 527612u);
const uint m1 = 4294967087u;
const uint m2 = 4294944443u;
const uint a11 = 1403580u;
const uint a10 = 810728u;
const uint a22 = 527612u;
const uint a20 = 1370589u;

uint addModM(uint a, uint b, uint m) {
    uint amodm = a % m;
    uint bmodm = b % m;
    uint blim = m - amodm;
    if (bmodm <= blim) {
        return amodm + bmodm; 
    }
    else {
        return amodm - (m - bmodm);
    }
}

uint diffModM(uint a, uint b, uint m) {
    uint amodm = a % m;
    uint bmodm = b % m;
    if (amodm >= bmodm) {
        return amodm - bmodm;
    }
    else {
        return amodm + (m - bmodm);
    }
}

uint multModM(uint a, uint b, uint m) {
    uint amodm = a % m;
    uint bmodm = b % m;
    uint res = 0u;
    while (bmodm > 0u) {
        if ((bmodm&0x1u) == 0x1u) {
            res = addModM(res, amodm, m);
        }
        bmodm = bmodm >> 1;
        amodm = addModM(amodm, amodm, m);
    }
    return res;
}

// calculate c = a*b mod m
void matMultModM(uint[9] a, uint[9] b, uint m, out uint[9] c) {
    c[0] = addModM(addModM(multModM(a[0],b[0],m), multModM(a[1],b[3],m), m), multModM(a[2],b[6],m), m);
    c[1] = addModM(addModM(multModM(a[0],b[1],m), multModM(a[1],b[4],m), m), multModM(a[2],b[7],m), m);
    c[2] = addModM(addModM(multModM(a[0],b[2],m), multModM(a[1],b[5],m), m), multModM(a[2],b[8],m), m);
    c[3] = addModM(addModM(multModM(a[3],b[0],m), multModM(a[4],b[3],m), m), multModM(a[5],b[6],m), m);
    c[4] = addModM(addModM(multModM(a[3],b[1],m), multModM(a[4],b[4],m), m), multModM(a[5],b[7],m), m);
    c[5] = addModM(addModM(multModM(a[3],b[2],m), multModM(a[4],b[5],m), m), multModM(a[5],b[8],m), m);
    c[6] = addModM(addModM(multModM(a[6],b[0],m), multModM(a[7],b[3],m), m), multModM(a[8],b[6],m), m);
    c[7] = addModM(addModM(multModM(a[6],b[1],m), multModM(a[7],b[4],m), m), multModM(a[8],b[7],m), m);
    c[8] = addModM(addModM(multModM(a[6],b[2],m), multModM(a[7],b[5],m), m), multModM(a[8],b[8],m), m);
}

// calculate w = a*v mod m
void matVecMultModM(uint[9] a, uint[3] v, uint m, out uint[3] w) {
    w[0] = addModM(addModM(multModM(a[0],v[0],m), multModM(a[1],v[1],m), m), multModM(a[2],v[2],m), m);
    w[1] = addModM(addModM(multModM(a[3],v[0],m), multModM(a[4],v[1],m), m), multModM(a[5],v[2],m), m);
    w[2] = addModM(addModM(multModM(a[6],v[0],m), multModM(a[7],v[1],m), m), multModM(a[8],v[2],m), m);
}

// calculate c = a+b mod m
void matVecMultModM(uint[3] a, uint[3] b, uint m, out uint[9] c) {
    c[0] = addModM(a[0], b[0], m);
    c[1] = addModM(a[1], b[1], m);
    c[2] = addModM(a[2], b[2], m);
}

// calculate b = a**n mod m
void matPowModM(uint[9] a, uint n, uint m, out uint[9] b) {
    uint[9] apow = a;
    b = uint[9](1u, 0u, 0u, 0u, 1u, 0u, 0u, 0u, 1u);
    while (n > 0u) {
        if ((n&0x1u) == 0x1u) {
            matMultModM(apow, b, m, b);
        }
        n = n >> 1;
        matMultModM(apow, apow, m, apow);
    }
}

uint stepMRG32k3a(void) {
    uint x1i = diffModM(multModM(x1[1], a11, m1), multModM(x1[0], a10, m1), m1);
    uint x2i = diffModM(multModM(x2[2], a22, m2), multModM(x2[0], a20, m2), m2);
    x1[0] = x1[1];
    x1[1] = x1[2];
    x1[2] = x1i;
    x2[0] = x2[1];
    x2[1] = x2[2];
    x2[2] = x2i;
    return diffModM(x1i, x2i, m1);
}

float floatMRG32k3a(void) {
    return float(stepMRG32k3a())*(1.0/4294967086.0);
}

uint skipMRG32k3a(uint n) {
    uint[9] a1pow;
    uint[9] a2pow;
    matPowModM(a1, n, m1, a1pow);
    matPowModM(a2, n, m2, a2pow);
    matVecMultModM(a1pow, x1, m1, x1);
    matVecMultModM(a2pow, x2, m2, x2);
    return diffModM(x1[0], x2[0], m1);
}

vec4 intToVec4(int num) {
    int rIntValue = num & 0x000000FF;
    int gIntValue = (num & 0x0000FF00) >> 8;
    int bIntValue = (num & 0x00FF0000) >> 16;
    int aIntValue = (num & 0xFF000000) >> 24;
    vec4 numColor = vec4(float(rIntValue)/255.0, float(gIntValue)/255.0, float(bIntValue)/255.0, float(aIntValue)/255.0); 
    return numColor; 
} 

vec4 uintToVec4(uint num) {
    uint rIntValue = num & 0x000000FFu;
    uint gIntValue = (num & 0x0000FF00u) >> 8;
    uint bIntValue = (num & 0x00FF0000u) >> 16;
    uint aIntValue = (num & 0xFF000000u) >> 24;
    vec4 numColor = vec4(float(rIntValue)/255.0, float(gIntValue)/255.0, float(bIntValue)/255.0, float(aIntValue)/255.0); 
    return numColor;
}

vec4 floatToVec4(float val) {
    uint conv = floatBitsToUint(val);
    return uintToVec4(conv);
}

uniform struct Ray {
    vec3 ro;
    vec3 rd;
};

uniform struct Intersection {
    float dist;
    int id;
};

uniform struct Disk {
    int id;
    vec3 p1;
    vec3 p2;
    vec3 p3;
    float radius;
};

uniform struct Rectangle {
    int id;
    vec3 p1;
    vec3 p2;
    vec3 p3;
};

uniform struct Triangle {
    int id;
    vec3 p1;
    vec3 p2;
    vec3 p3;
};

uniform struct Sphere {
    int id;
    vec3 p1;
    vec3 p2;
    vec3 p3;
    float radius;
};

uniform struct Cylinder {
    int id;
    vec3 p1;
    vec3 p2;
    vec3 p3;
    float radius;
};

Intersection toDisk(Disk s, Ray ray) {
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    Intersection p;
    p.id = 0;
    p.dist = -1.0;
    if (dot(Rz, ray.rd) == 0.0) {
        return p;
    }
    mat3 Rmat = mat3(Rx, Ry, Rz);
    mat3 Rinv = transpose(Rmat);
    vec3 Ro = Rinv * (ray.ro - s.p1);
    vec3 Rd = Rinv * ray.rd;
    float t = -Ro[2]/Rd[2];
    if (t <= 0.0) {
        return p;
    }
    vec3 pLocal = Ro + Rd * t;
    float dist = pLocal[0]*pLocal[0] + pLocal[1]*pLocal[1];
    if (dist < s.radius*s.radius) {
        p.id = s.id;
        p.dist = t;
    }
    return p;
}

Intersection toRect(Rectangle s, Ray ray) {
    vec3 Ry = normalize(s.p3 - s.p1);
    vec3 Rx = normalize(s.p2 - s.p1);
    vec3 Rz = cross(Rx, Ry);
    Intersection p;
    p.id = 0;
    p.dist = -1.0;
    if (dot(Rz, ray.rd) == 0.0) {
        return p;
    }
    mat3 Rmat = mat3(Rx, Ry, Rz);
    mat3 Rinv = transpose(Rmat);
    vec3 Ro = Rinv * (ray.ro - s.p1);
    vec3 Rd = Rinv * ray.rd;
    float t = -Ro[2]/Rd[2];
    if (t <= 0.0) {
        return p;
    }
    vec3 pLocal = Ro + Rd * t;
    if (0.0 <= pLocal[0] && pLocal[0] <= length(s.p2 - s.p1) && 0.0 <= pLocal[1] && pLocal[1] <= length(s.p3 - s.p1)) {
        p.id = s.id;
        p.dist = t;
    }
    return p;
}

Intersection toSphere(Sphere s, Ray ray) {
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    mat3 Rmat = mat3(Rx, Ry, Rz);
    mat3 Rinv = transpose(Rmat);
    vec3 Ro = Rinv * (ray.ro - s.p1);
    vec3 Rd = Rinv * ray.rd;
    Intersection p;
    p.id = 0;
    p.dist = -1.0;
    float a = dot(Rd, Rd);
    float b = dot(Rd, Ro);
    float c = dot(Ro, Ro) - s.radius*s.radius;
    float d = b*b - a*c;
    if (d < 0.0) {
        return p;
    }
    float tp = (-b+sqrt(d)) / a;
    float tm = (-b-sqrt(d)) / a;
    vec3 pp = Ro + tp * Rd;
    vec3 pm = Ro + tm * Rd;
    
    if (tm > 0.0) {
        p.id = s.id;
        p.dist = tm;
    }
    else if (tp > 0.0) {
        p.id = s.id;
        p.dist = tp;
    }
    return p;
}

Intersection toCylinder(Cylinder s, Ray ray) {
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    Intersection p;
    p.id = 0;
    p.dist = -1.0;
    if (dot(Rz, ray.rd) == 0.0) {
        return p;
    }
    mat3 Rmat = mat3(Rx, Ry, Rz);
    mat3 Rinv = transpose(Rmat);
    vec3 Ro = Rinv * (ray.ro - s.p1);
    vec3 Rd = Rinv * ray.rd;
    float a = Rd[0]*Rd[0] + Rd[1]*Rd[1];
    float b = Ro[0]*Rd[0] + Ro[1]*Rd[1];
    float c = Ro[0]*Ro[0] + Ro[1]*Ro[1] - s.radius*s.radius;
    float d = b*b - a*c;
    if (d < 0.0) {
        return p;
    }
    float tp = (-b+sqrt(d)) / a;
    float tm = (-b-sqrt(d)) / a;
    vec3 pp = Ro + tp * Rd;
    vec3 pm = Ro + tm * Rd;
    float height = length(s.p2 - s.p1);

    if (tm > 0.0) {
        if (pm[2] >= 0.0 && pm[2] <= height) {
            p.id = s.id;
            p.dist = tm;
        }
        else {
            if (pp[2] >= 0.0 && pp[2] <= height) {
                p.id = s.id;
                p.dist = tp;
            }
            else {}
        }
    }
    else {
        if (tp > 0.0) {
            if (pp[2] >= 0.0 && pp[2] <= height) {
                p.id = s.id;
                p.dist = tp;
            }
            else {}
        }
        else {}
    }
    return p;
}

Ray fromDs(vec3 ro, vec3 x, vec3 y, vec3 z) {
    float psi = acos(1.0-2.0*floatMRG32k3a())/2.0;
    float phi = 2.0*PI*floatMRG32k3a();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(x, y, z); 
    vec3 rd = Rmat * rdLocal;
    Ray ray;
    ray.ro = ro;
    ray.rd = rd;
    return ray;
}

Ray fromDisk(Disk s) {
    float r = s.radius*sqrt(floatMRG32k3a());
    float theta = 2.0*PI*floatMRG32k3a();
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    Ray ray;
    ray.ro = s.p1 + r*cos(theta)*Rx + r*sin(theta)*Ry;
    float psi = acos(1.0-2.0*floatMRG32k3a())/2.0;
    float phi = 2.0*PI*floatMRG32k3a();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(Rx, Ry, Rz); 
    ray.rd = Rmat * rdLocal;
    return ray;
}

Ray fromRect(Rectangle s) {
    vec3 xvec = s.p2 - s.p1;
    vec3 yvec = s.p3 - s.p1;
    vec3 Rx = normalize(xvec);
    vec3 Ry = normalize(yvec);
    vec3 Rz = cross(Rx, Ry);
    Ray ray;
    ray.ro = s.p1 + floatMRG32k3a()*xvec + floatMRG32k3a()*yvec;
    float psi = acos(1.0-2.0*floatMRG32k3a())/2.0;
    float phi = 2.0*PI*floatMRG32k3a();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(Rx, Ry, Rz); 
    ray.rd = Rmat * rdLocal;
    return ray;
}

Ray fromCylinder(Cylinder s) {
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    float height = length(s.p2 - s.p1);
    Ray ray;
    float theta = 2.0*PI*floatMRG32k3a();
    ray.ro = s.p1 + height*floatMRG32k3a()*Rz + s.radius*cos(theta)*Rx + s.radius*sin(theta)*Ry;
    vec3 rotRz = cos(theta)*Rx + sin(theta)*Ry;
    vec3 rotRx = cos(theta+PI/2.0)*Rx + sin(theta+PI/2.0)*Ry;
    vec3 rotRy = Rz;
    float psi = acos(1.0-2.0*floatMRG32k3a())/2.0;
    float phi = 2.0*PI*floatMRG32k3a();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(rotRx, rotRy, rotRz); 
    ray.rd = -Rmat * rdLocal;
    return ray;
}

Ray fromSphere(Sphere s) {
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    float theta = acos(1.0-2.0*floatMRG32k3a());
    float thetav = theta + PI/2.0;
    float omega = 2.0*PI*floatMRG32k3a();
    Ray ray;
    vec3 rotRz = vec3(cos(theta)*Rz + sin(theta)*cos(omega)*Rx + sin(theta)*sin(omega)*Ry);
    vec3 rotRx = vec3(cos(thetav)*Rz + sin(thetav)*cos(omega)*Rx + sin(thetav)*sin(omega)*Ry);
    vec3 rotRy = cross(rotRz, rotRx);
    ray.ro = s.p1 + s.radius*rotRz;
    float psi = acos(1.0-2.0*floatMRG32k3a())/2.0;
    float phi = 2.0*PI*floatMRG32k3a();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(rotRx, rotRy, rotRz);
    ray.rd = Rmat * rdLocal;
    return ray;
}

int dsToDisk(void) {
    vec3 x = vec3(cos(uTheta),0.0,-sin(uTheta));
    vec3 y = vec3(0.0, 1.0, 0.0);
    vec3 z = vec3(sin(uTheta),0.0,cos(uTheta));
    Ray ray = fromDs(vec3(0.0, 0.0, 0.0), x, y, z);

    Disk disk;
    disk.p1 = vec3(0.0, 0.0, uH);
    disk.p2 = vec3(0.0, 0.0, uH+1.0);
    disk.p3 = vec3(1.0, 0.0, uH);
    disk.id = 1;
    disk.radius = uR;

    Intersection p = toDisk(disk, ray);
    return p.id;
}

int dsToRectParallel(void) {
    vec3 x = vec3(1.0, 0.0, 0.0);
    vec3 y = vec3(0.0, 1.0, 0.0);
    vec3 z = vec3(0.0, 0.0, 1.0);
    Ray ray = fromDs(vec3(0.0, 0.0, 0.0), x, y, z);

    Rectangle rect;
    rect.p1 = vec3(0.0, 0.0, uC);
    rect.p2 = vec3(uA, 0.0, uC);
    rect.p3 = vec3(0.0, uB, uC);
    rect.id = 1;

    Intersection p = toRect(rect, ray);
    return p.id;
}

int dsToRectVertical(void) {
    vec3 x = vec3(0.0, 1.0, 0.0);
    vec3 y = vec3(0.0, 0.0, 1.0);
    vec3 z = vec3(1.0, 0.0, 0.0);
    Ray ray = fromDs(vec3(0.0, 0.0, 0.0), x, y, z);

    Rectangle rect;
    rect.p1 = vec3(0.0, 0.0, uC);
    rect.p2 = vec3(uA, 0.0, uC);
    rect.p3 = vec3(0.0, uB, uC);
    rect.id = 1;

    Intersection p = toRect(rect, ray);
    return p.id;
}

int dsToSphere(void) {
    vec3 x = vec3(cos(uTheta),0.0,-sin(uTheta));
    vec3 y = vec3(0.0, 1.0, 0.0);
    vec3 z = vec3(sin(uTheta),0.0,cos(uTheta));
    Ray ray = fromDs(vec3(0.0, 0.0, 0.0), x, y, z);

    Sphere sphere;
    sphere.p1 = vec3(0.0, 0.0, uH);
    sphere.p2 = vec3(0.0, 0.0, uH+1.0);
    sphere.p3 = vec3(1.0, 0.0, uH);
    sphere.id = 1;
    sphere.radius = uR;

    Intersection p = toSphere(sphere, ray);
    return p.id;
}

int dsToCylinder(void) {
    vec3 x = vec3(1.0, 0.0, 0.0);
    vec3 y = vec3(0.0, 1.0, 0.0);
    vec3 z = vec3(0.0, 0.0, 1.0);
    Ray ray = fromDs(vec3(0.0, 0.0, 0.0), x, y, z);

    Cylinder cylinder;
    cylinder.p1 = vec3(0.0, 0.0, uH);
    cylinder.p2 = vec3(uL, 0.0, uH);
    cylinder.p3 = vec3(0.0, 0.0, uH+1.0);
    cylinder.id = 1;
    cylinder.radius = uR;

    Intersection p = toCylinder(cylinder, ray);
    return p.id;
}

int diskToDisk(void) {
    Disk fd;
    fd.p1 = vec3(0.0, 0.0, 0.0);
    fd.p2 = vec3(0.0, 0.0, 1.0);
    fd.p3 = vec3(1.0, 0.0, 0.0);
    fd.id = 1;
    fd.radius = uR1;
    Ray ray = fromDisk(fd);

    Disk td;
    td.p1 = vec3(0.0, 0.0, uH);
    td.p2 = vec3(0.0, 0.0, uH+1.0);
    td.p3 = vec3(1.0, 0.0, uH);
    td.id = 2;
    td.radius = uR2;

    Intersection p = toDisk(td, ray);
    return p.id;
}

int rectToRectParallel(void) {
    Rectangle frect;
    frect.p1 = vec3(0.0, 0.0, 0.0);
    frect.p2 = vec3(uA, 0.0, 0.0);
    frect.p3 = vec3(0.0, uB, 0.0);
    frect.id = 1;
    Ray ray = fromRect(frect);

    Rectangle trect;
    trect.p1 = vec3(0.0, 0.0, uC);
    trect.p2 = vec3(uA, 0.0, uC);
    trect.p3 = vec3(0.0, uB, uC);
    trect.id = 2;

    Intersection p = toRect(trect, ray);
    return p.id;
}

int rectToRectVertical(void) {
    Rectangle frect;
    frect.p1 = vec3(0.0, 0.0, 0.0);
    frect.p2 = vec3(uW, 0.0, 0.0);
    frect.p3 = vec3(0.0, uL, 0.0);
    frect.id = 1;
    Ray ray = fromRect(frect);

    Rectangle trect;
    trect.p1 = vec3(0.0, 0.0, 0.0);
    trect.p2 = vec3(0.0, uL, 0.0);
    trect.p3 = vec3(0.0, 0.0, uH);
    trect.id = 2;

    Intersection p = toRect(trect, ray);
    return p.id;
}

int sphereToRect(void) {
    Sphere sphere;
    sphere.p1 = vec3(0.0, 0.0, uH);
    sphere.p2 = vec3(0.0, 0.0, uH+1.0);
    sphere.p3 = vec3(1.0, 0.0, uH);
    sphere.id = 1;
    sphere.radius = 1.0;
    Ray ray = fromSphere(sphere);

    Rectangle rect;
    rect.p1 = vec3(0.0, 0.0, 0.0);
    rect.p2 = vec3(uL1, 0.0, 0.0);
    rect.p3 = vec3(0.0, uL2, 0.0);
    rect.id = 2;

    Intersection p = toRect(rect, ray);
    return p.id;
}

int cylinderToCylinder(void) {
    Cylinder fcylinder;
    fcylinder.p1 = vec3(0.0, 0.0, 0.0);
    fcylinder.p2 = vec3(0.0, 0.0, uH);
    fcylinder.p3 = vec3(1.0, 0.0, 0.0);
    fcylinder.id = 1;
    fcylinder.radius = uR2;
    Ray ray = fromCylinder(fcylinder);

    Cylinder tcylinder;
    tcylinder.p1 = vec3(0.0, 0.0, 0.0);
    tcylinder.p2 = vec3(0.0, 0.0, uH);
    tcylinder.p3 = vec3(1.0, 0.0, 0.0);
    tcylinder.id = 2;
    tcylinder.radius = uR1;

    Intersection p = toCylinder(tcylinder, ray);
    return p.id;
}

int diskToCylinder(void) {
    Disk fd;
    fd.p1 = vec3(0.0, 0.0, 0.0);
    fd.p2 = vec3(0.0, 0.0, 1.0);
    fd.p3 = vec3(1.0, 0.0, 0.0);
    fd.id = 1;
    fd.radius = uR;
    Ray ray = fromDisk(fd);

    Cylinder tcylinder;
    tcylinder.p1 = vec3(0.0, 0.0, 0.0);
    tcylinder.p2 = vec3(0.0, 0.0, uH);
    tcylinder.p3 = vec3(1.0, 0.0, 0.0);
    tcylinder.id = 2;
    tcylinder.radius = uR;

    Intersection p = toCylinder(tcylinder, ray);
    return p.id;
}


void main(void) {
    uint seed = uint(gl_FragCoord.x) + uint(gl_FragCoord.y) * uint(uWidth);
    uint skip = seed * 100u;
    skipMRG32k3a(skip);
    int id;

    switch (uCase) {
        case 0:
            id = dsToDisk();
            break;
        // case 1:
        //     id = dsToDiskOffsetParallel();
        //     break;
        // case 2:
        //     id = dsToDiskOffsetVertical();
        //     break;
        case 3:
            id = dsToRectParallel();
            break;
        case 4:
            id = dsToRectVertical();
            break;
        case 5:
            id = dsToSphere();
            break;
        case 6:
            id = dsToCylinder();
            break;
        case 10:
            id = diskToDisk();
            break;
        case 11:
            id = diskToCylinder();
            break;
        case 20:
            id = rectToRectParallel();
            break;
        case 21:
            id = rectToRectVertical();
            break;
        case 30:
            id = sphereToRect();
            break;
        // case 31:
        //     id = sphereToDisk();
        //     break;
        // case 32:
        //     id = sphereToCylinder();
        //     break;
        // case 33:
        //     id = spehreToCone();
        //     break;
        case 40:
            id = cylinderToCylinder();
            break;
        // case 100:
        //     id = triToTriArbitrary();
        //     break;
        // case 101:
        //     id = rectTorectArbitrary();
        //     break;
        default:
            id = 0x0;
    }
    
    fragColor = intToVec4(id);
}`