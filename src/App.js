import React, { useRef, useEffect, useState, Suspense } from 'react';
import './App.scss';

// Components
import Header from "./components/header";
import { Section } from "./components/section";

// Page State
import state from "./components/state";

// React Three Fiber
import { Canvas, useFrame } from "react-three-fiber";
import { Html, useProgress, useGLTF } from "@react-three/drei";

// React Spring
import { a, useTransition } from "@react-spring/web";

// Intersection Observer
import { useInView } from "react-intersection-observer";

const Model = ({ url }) => {
  const gltf = useGLTF(url, true);
  return <primitive object={gltf.scene} dispose={null} />;
}

const Lights = () => {
  return (
    <>
      {/* Ambient Lights */}
      <ambientLight intensity={0.3} />
      {/* Directional Lights */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight */}
      <spotLight intensity={1} position={[500, 0, 0]} castShadow />
    </>
  );
}

const HTMLContent = ({ domContent, children, modelPath, positionY, bgColor }) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));
  const [refItem, inView] = useInView({
    threshold: 0
  });

  useEffect(() => {
    inView && (document.body.style.background = bgColor)
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, positionY, 0]} >
        <mesh ref={ref} position={[0, -10, 0]} >
          <Model url={modelPath} />
        </mesh>
        <Html portal={domContent} fullscreen>
          <div ref={refItem}>
            {children}
          </div>          
        </Html>
      </group>
    </Section>
  );
}

const App = () => {
  const domContent = useRef()
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      {/* R3F Canvas */}
      <Canvas
        concurrent
        colorManagement
        shadows
        camera={{ position: [0, 0, 40], fov:70 }}
      > 
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent 
            domContent={domContent} 
            modelPath='/lumine.gltf' 
            positionY={80} 
            bgColor={'#93cafa'}
          >
            <div className='container'>
              <h2 className='title'>Lumine</h2>
            </div>
          </HTMLContent>
          <HTMLContent 
            domContent={domContent} 
            modelPath='/jean.gltf' 
            positionY={0}
            bgColor={'#7af09f'} 
          >
            <div className='container'>
              <h2 className='title'>Jean</h2>
            </div>
          </HTMLContent>
          <HTMLContent 
            domContent={domContent} 
            modelPath='/barbara.gltf' 
            positionY={-80} 
            bgColor={'#0c88f5'}
          >
            <div className='container'>
              <h2 className='title'>Barbara</h2>
            </div>
          </HTMLContent>
        </Suspense>
      </Canvas>
      <div className='scrollArea' ref={scrollArea} onScroll={onScroll} > 
        <div style={{ position: 'sticky', top: 0 }} ref={domContent}></div>
        <div style={{ height: `${state.sections * 100}vh`}}></div>
      </div>
    </>
  );
}

export default App;
