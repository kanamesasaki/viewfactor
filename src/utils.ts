import {vertex} from './vertex-shader.glsl'
import {fragment} from './fragment-shader.glsl'

// Extract the content's of a shader script from the JavaScript file 
// Return the compiled shader
export function getVertexShader(gl: WebGLRenderingContext): WebGLShader | null {
    let shader: WebGLShader | null 
    shader = gl.createShader(gl.VERTEX_SHADER)
    if (shader === null) {
        throw new Error('Could not create vertex shader')
    }
    gl.shaderSource(shader, vertex)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        return null
    }
    return shader
}

// Extract the content's of a shader script from the JavaScript file 
// Return the compiled shader
export function getFragmentShader(gl: WebGLRenderingContext) {
    let shader: WebGLShader | null 
    shader = gl.createShader(gl.FRAGMENT_SHADER)
    if (shader === null) {
        throw new Error('Could not create fragment shader')
    }
    gl.shaderSource(shader, fragment)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        return null
    }
    return shader
}