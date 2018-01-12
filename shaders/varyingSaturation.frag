#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform int saturatedComponent;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	
	if(saturatedComponent == 0)
		color.r = (color.r + timeFactor > 1.0) ? 1.0 : color.r + timeFactor;
	if(saturatedComponent == 1)
		color.g = (color.g + timeFactor > 1.0) ? 1.0 : color.g + timeFactor;
	if(saturatedComponent == 2)
		color.b = (color.b + timeFactor > 1.0) ? 1.0 : color.b + timeFactor;
	
	gl_FragColor = color;		
}