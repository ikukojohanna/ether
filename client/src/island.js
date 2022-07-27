import {
    OrbitControls,
    PerspectiveCamera,
    Environment,
} from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

function IslandScene() {
    return (
        <Suspense fallback={null}>
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[-1.75, 10.85, 20.35]}
            />
            <OrbitControls target={[1, 5, 0]} maxPolarAngle={Math.PI * 0.5} />
        </Suspense>
    );
}

export default function FiberIsland() {
    return (
        <div>
            <Canvas shadows>
                <IslandScene />
            </Canvas>
        </div>
    );
}

//environment (background).. same error cannot access files in public folder
/*
   <Environment
                background={"only"}
                files={"/Users/johannaodersky/dev/ether/client/public/bg.hdr"}
            />
            <Environment
                background={false}
                files={
                    "/Users/johannaodersky/dev/ether/client/public/envmap.hdr"
                }
            />*/
