export default `#version 300 es
precision mediump float;

in vec4 vColor;
uniform vec2 uInverseTextureSize;
out vec4 fragColor;
uniform int uWidth;
uniform int uHeight;

// Calculation case
uniform int uCase;
// 1: dsToDisk
// 2: dsToRect
// 3: dsToSphere
// 4: diskToDisk
// 5: rectToRectParallel
// 6: rectToRectVertical

uniform float uR;
uniform float uH;
uniform float uTheta;
uniform float uA;
uniform float uB;
uniform float uC;
uniform float uR1;
uniform float uR2;
uniform float uL;
uniform float uW;

const float PI = 3.141592653589793238462643383;
const uint MATRIX_A = 0x9908B0DFu;
const uint UPPER_MASK = 0x80000000u;
const uint LOWER_MASK = 0x7FFFFFFFu;
const uint FULL_MASK = 0xFFFFFFFFu;
const int N = 624;
const int M = 397;
const int KEY_LENGTH = 4;
uint mt[N];
int mti = N+1;

void initSeedMT(uint s) {
    mt[0]= s;
    for (int i=1; i<N; i++) {
         mt[i] = (1812433253u * (mt[i-1]^(mt[i-1]>>30)) + uint(i));
    }
}

void initArrayMT(uint initKey[KEY_LENGTH]) {
    int i, j, k;
    initSeedMT(19650218u);
    i = 1;
    j = 0;
    k = (N>KEY_LENGTH ? N : KEY_LENGTH);
    for (; k>0; k--) {
        mt[i] = (mt[i] ^ ((mt[i-1] ^ (mt[i-1] >> 30)) * 1664525u)) + initKey[j] + uint(j);
        i++;
        j++;
        if (i>=N) {
            mt[0] = mt[N-1];
            i = 1;
        }
        if (j>=KEY_LENGTH) {
            j = 0;
        }
    }
    for (k=N-1; k>0; k--) {
        mt[i] = (mt[i] ^ ((mt[i-1] ^ (mt[i-1] >> 30)) * 1566083941u)) - uint(i);
        i++;
        if (i>=N) {
            mt[0] = mt[N-1];
            i = 1;
        }
    }
    mt[0] = 0x80000000u;
}

uint uintMT(void) {
    uint y;
    uint mag01[2];
    mag01[0] = 0x0u;
    mag01[1] = MATRIX_A;
    if (mti >= N) {
        int kk;
        for (kk=0;kk<N-M;kk++) {
            y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
            mt[kk] = mt[kk+M] ^ (y >> 1u) ^ mag01[int(y&0x1u)];
        }
        for (;kk<N-1;kk++) {
            y = (mt[kk]&UPPER_MASK)|(mt[kk+1]&LOWER_MASK);
            mt[kk] = mt[kk+(M-N)] ^ (y >> 1u) ^ mag01[int(y&0x1u)];
        }
        y = (mt[N-1]&UPPER_MASK)|(mt[0]&LOWER_MASK);
        mt[N-1] = mt[M-1] ^ (y >> 1u) ^ mag01[int(y&0x1u)];
        mti = 0;
    }
    y = mt[mti++];
    // Tempering
    y ^= (y >> 11);
    y ^= (y << 7) & 0x9D2C5680u;
    y ^= (y << 15) & 0xEFC60000u;
    y ^= (y >> 18);
    return y;
}

float floatMT(void) {
    return float(uintMT())*(1.0/4294967295.0);
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

uniform struct Sphere {
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

Ray fromDs(vec3 ro, vec3 x, vec3 y, vec3 z) {
    float psi = acos(1.0-2.0*floatMT())/2.0;
    float phi = 2.0*PI*floatMT();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(x, y, z); 
    vec3 rd = Rmat * rdLocal;
    Ray ray;
    ray.ro = ro;
    ray.rd = rd;
    return ray;
}

Ray fromDisk(Disk s) {
    float r = s.radius*sqrt(floatMT());
    float theta = 2.0*PI*floatMT();
    vec3 Rx = normalize(s.p3 - s.p1);
    vec3 Rz = normalize(s.p2 - s.p1);
    vec3 Ry = cross(Rz, Rx);
    Ray ray;
    ray.ro = s.p1 + r*cos(theta)*Rx + r*sin(theta)*Ry;
    float psi = acos(1.0-2.0*floatMT())/2.0;
    float phi = 2.0*PI*floatMT();
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
    ray.ro = s.p1 + floatMT()*xvec + floatMT()*yvec;
    float psi = acos(1.0-2.0*floatMT())/2.0;
    float phi = 2.0*PI*floatMT();
    vec3 rdLocal = vec3(sin(psi)*cos(phi), sin(psi)*sin(phi), cos(psi));
    mat3 Rmat = mat3(Rx, Ry, Rz); 
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

int dsToRect(void) {
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

void main(void) {
    vec3 ro = vec3(0.0, 0.0, 0.0);
    uint seed = uint(gl_FragCoord.x) + uint(gl_FragCoord.y) * uint(uWidth);
    initSeedMT(seed);
    int id;

    switch (uCase) {
        case 1:
            id = dsToDisk();
            break;
        case 2:
            id = dsToRect();
            break;
        case 3:
            id = dsToSphere();
            break;
        case 4:
            id = diskToDisk();
            break;
        case 5:
            id = rectToRectParallel();
            break;
        case 6:
            id = rectToRectVertical();
            break;
    }
    
    fragColor = intToVec4(id);
}`