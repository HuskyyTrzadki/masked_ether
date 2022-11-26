import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { MutableRefObject, Suspense, useEffect, useMemo, useRef} from 'react';
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';

const fragmentShader = `
in vec2 uvInterpolator;
uniform sampler2D u_texture;
uniform float u_freq;

void main() {
  vec2 uv = uvInterpolator;
  uv += vec2(0.0, sin(u_freq*2.0)/4.0);
  gl_FragColor = texture2D(u_texture, uv);
}
`

const vertexShader = `
out vec2 uvInterpolator;

void main() {
  uvInterpolator = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

function getRandomFrequency(time: number) {
  return time%(Math.random()*100 | 0);
}

function Img() {

  const mesh: MutableRefObject<Mesh<PlaneGeometry, ShaderMaterial>> = useRef(null!);

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_freq.value = getRandomFrequency(clock.getElapsedTime());
  });

  const texture = useLoader(TextureLoader, 'icon.png');
  const uniforms = useMemo( () =>({
    u_texture: {type: 't', value: texture},
    u_freq: {value: 0}
  }),[]);
  return (
    <>
      <mesh ref={mesh} position={[0, 0, 0]} scale={1}>
        <planeGeometry args={[5, 5]}/>
        {/* <meshStandardMaterial map={texture} /> */}
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  )
}

function playMusic() {
  const audio = new Audio('sample2.mp3');
  audio.play();
}

export default function Visualize() {

  return (
    <div>
      <Canvas style={{height: "100vh"}} onClick={playMusic}>
        <Suspense fallback={null}>

          {/* <audio src="sample.mp3"/> */}
          <Img />          
        </Suspense>
      </Canvas>
    </div>
  )
}

