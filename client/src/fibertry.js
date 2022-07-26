import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense } from "react";
import { useRef, useEffect } from "react";

import { Ground } from "./ground";
import { Rings } from "./rings";
const { OrbitControls, PerspectiveCamera } = require("@react-three/drei");

function Carshow() {
    return null;
}
function Cube() {
    const meshRef = useRef(null);

    useFrame(() => {
        if (!meshRef.current) {
            return;
        }
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <>
            <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />
            <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />
            <color args={[0, 0, 0]} attach="background" />
            <mesh ref={meshRef} onClick={() => console.log("click")}>
                <boxGeometry attach="geometry" args={[3, 3, 3]} />
                <meshStandardMaterial attach="material" color="blue" />
            </mesh>
            <mesh position={[5, 5, 5]} onClick={() => console.log("click")}>
                <boxGeometry attach="geometry" args={[6, 3, 6]} />
                <meshStandardMaterial attach="material" color="red" />
            </mesh>
            <spotLight
                color={[1, 0.25, 0.7]}
                intensity={1.5}
                angle={0.6}
                penumbra={0.5}
                position={[5, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />
            <spotLight
                color={[0.14, 0.5, 1]}
                intensity={2}
                angle={0.6}
                penumbra={0.5}
                position={[-5, 5, 0]}
                castShadow
                shadow-bias={-0.0001}
            />

            <Ground />
            <Rings />
        </>
    );
}

export default function FiberTry() {
    useEffect(() => {
        document.addEventListener("scroll", () => console.log("scroll"));
    }, []);

    useEffect(() => {
        console.log("react version", React.version);
    }, []);

    return (
        <div className="fiberdiv" onScroll={() => console.log("scroll div")}>
            <Suspense fallback={null}>
                <Canvas onClick={() => console.log("clicked Canvas")} shadows>
                    <Cube />
                    <Carshow />
                </Canvas>
            </Suspense>
        </div>
    );
}

/*

(in canvas tag)
 camera={{ fov: 70, position: [0, 10, 10] }}$

<ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <directionalLight position={[20, 20, 20]} />
  <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                    />*/
