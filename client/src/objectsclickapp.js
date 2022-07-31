import { Canvas } from "@react-three/fiber";
//import { Clicks } from "./objectclicked";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

import { useEffect, useState } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Ground } from "./ground";
import * as THREE from "three";

//postprocessing:
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
function Clicks({
    p = new THREE.Vector3(),
    q = new THREE.Quaternion(),
    c = new THREE.PerspectiveCamera(),
}) {
    // We will need access to our camera, so grab the three state
    const state = useThree();

    // We need to know what object was clicked
    // Keeping track of this in state is not super advisable but this setup
    // relies on a new selection causing a re-render. It's probably better
    // to keep track of this in a ref
    const [clicked, setClicked] = useState(null);
    const [hovered, setHover] = useState(false);

    // On first render just point the camera where we want it
    useEffect(() => {
        state.camera.lookAt(0, 0, 0);
    }, []);

    useEffect(() => {
        (function (history) {
            var pushState = history.pushState;
            history.pushState = function (state) {
                if (typeof history.onpushstate == "function") {
                    history.onpushstate({ state: state });
                }

                // ... whatever else you want to do
                // maybe call onhashchange e.handler
                return pushState.apply(history, arguments);
            };
        })(window.history);
    }, []);

    useEffect(() => {
        // ...check if there is a currently selected object
        if (clicked !== null) {
            // Update the selected objects world matrix (not sure this is necessary)
            // (true, true) updates it's children and parent matrices I believe
            clicked.updateWorldMatrix(true, true);

            // Put our object into a const because I want to
            const selection = clicked;

            // Grab the position of our selection
            const { position } = selection;

            // Grab the values we assign to object userData.
            // In the return block you can see the value viewPos is a three entry array representing
            // the x, y, and z we want to view the selection from **with relation to the selection**.

            // Make that a Vector3
            const viewPos = new THREE.Vector3(...selection.userData.viewPos);

            // Using the position of the selection, we add our view position.
            // This will give us the world position for our target camera.
            const camPosTarget = new THREE.Vector3(...position).add(viewPos);

            // Put the target camera in the right position.
            c.position.set(...camPosTarget);

            // Point the target camera where you want to look.
            // In this case we are just going to look right at the selection.
            c.lookAt(...position);

            // copy the quaternion of the target camera into q.
            // You can also use .set(...c.quaternion) but copy is cleaner.
            q.copy(c.quaternion);

            // copy the position of the target camera into p.
            p.copy(c.position);
        } else {
            // If nothing is clicked we want to set p back to our start position.
            // In our case we are just hardcoding our camera position back in.
            p.set(0, 2, 60);

            // .identity() resets a quaternion to no rotation.
            // This doesn't bring us back to our original rotation that we set on line 27.
            // You could do that if you want using the same method we use to animate
            // to our target positions.
            // You'll actually notice if you refresh that the camera instanly pans up because of this.
        }
    });

    // On every frame...
    useFrame((state, dt) => {
        // ...lerp (linear interpolate) the camera position to p.
        state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt));

        // ...slerp (spherical linear interpolate) the camera rotation to quaternion q.
        state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt));

        // I don't have anything to say about lerp and slerp that the docs don't have.
        // No idea what damp actually does, probably just smooths it out.
    });

    // The only thing of note below is that in each Box I provide the viewPos to userData.
    // Make sure that mouse events in r3f are not propogating unless you want them to.
    // Objects behind will also trigger if you don't.
    // I don't know why my shadows aren't working but I don't have time to fix it.

    return (
        <>
            <color args={[0, 0, 0]} attach="background" />
            <Ground />
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[0, 15, -5]}
                fontSize={2}
            >
                Choose a Planet
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[0, 1, 0]}
                fontSize={2}
            >
                {" "}
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[-10, 5, 0]}
                fontSize={1}
            >
                Arakis{" "}
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[-20, 5, 5]}
                fontSize={1}
            >
                Solaris{" "}
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[-30, 5, 10]}
                fontSize={1}
            >
                Philia
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[10, 5, 0]}
                fontSize={1}
            >
                LV-426
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[20, 5, 5]}
                fontSize={1}
            >
                Dagobah
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[0, 0, 0]}
                position={[30, 5, 10]}
                fontSize={1}
            >
                Vogsphere
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[Math.PI / 2, Math.PI, 0]}
                position={[-10, 3, -3]}
                fontSize={1}
                onClick={() => history.push({}, "", "arakis")}
            >
                other page{" "}
            </Text>
            <Text
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                rotation={[Math.PI / 2, Math.PI / 2, Math.PI / -2]}
                position={[12.1, 3, 0]}
                fontSize={0.3}
            >
                other page{" "}
            </Text>
            <Sphere
                castShadow
                args={[2, 30, 30]}
                position={[10, 2, 0]}
                userData={{ viewPos: [0, 0, 0.5] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("lv-426", "", "lv-426");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
            </Sphere>

            <Sphere
                castShadow
                args={[2, 30, 30]}
                position={[20, 2, 5]}
                userData={{ viewPos: [6, 9, 5] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("dagobah", "", "dagobah");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {" "}
                <meshStandardMaterial color={hovered ? "green" : "blue"} />
            </Sphere>
            <Sphere
                castShadow
                args={[2, 30, 30]}
                position={[-10, 2, 0]}
                userData={{ viewPos: [-6, 9, -5] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("arakis", "", "arakis");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
            >
                <meshStandardMaterial color={"yellow"} />
            </Sphere>
            <Sphere
                castShadow
                args={[2, 30, 30]}
                position={[-20, 2, 5]}
                userData={{ viewPos: [-6, 9, -5] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("solaris", "", "solaris");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
            >
                <meshStandardMaterial color={"red"} />
            </Sphere>
            <Sphere
                castShadow
                args={[3, 30, 30]}
                position={[-30, 2, 10]}
                userData={{ viewPos: [-6, 9, -5] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("philia", "", "philia");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
            >
                <meshStandardMaterial color={"grey"} />
            </Sphere>
            <Sphere
                castShadow
                args={[3, 30, 30]}
                position={[30, 2, 10]}
                userData={{ viewPos: [5, 5, 0] }}
                onClick={(e) => {
                    e.stopPropagation();

                    if (clicked === e.object) {
                        window.history.pushState("empty", "", "chat");

                        setClicked(null);
                    } else {
                        setClicked(e.object);
                        window.history.pushState("vogsphere", "", "vogsphere");
                        console.log("lv clicked");
                    }
                }}
                onPointerMissed={() => {
                    setClicked(null);
                    window.history.pushState("empty", "", "chat");
                }}
            >
                <meshStandardMaterial color={"orange"} />
            </Sphere>
            <spotLight
                color={[1, 0.25, 0.7]}
                intensity={0.5}
                angle={1}
                penumbra={1}
                position={[100, 200, -100]}
                castShadow
                shadow-bias={-1}
            />
            <spotLight
                color={[0.14, 0.5, 1]}
                intensity={0.5}
                angle={1}
                penumbra={1}
                position={[-100, 200, -100]}
                castShadow
                shadow-bias={-1}
            />
            <EffectComposer>
                <Bloom
                    blendFunction={BlendFunction.ADD}
                    intensity={0.5} // The bloom intensity.
                    width={1000} // render width
                    height={1000} // render height
                    kernelSize={5} // blur kernel size
                    luminanceThreshold={0.15} // luminance threshold. Raise this value to mask out darker elements in the scene.
                    luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
                />
                <ChromaticAberration
                    blendFunction={BlendFunction.NORMAL} // blend mode
                    offset={[0.0005, 0.0012]} // color offset
                />
            </EffectComposer>
        </>
    );
}
export default function ClickApp() {
    return (
        <div className="clickdiv" onScroll={() => console.log("scroll div")}>
            <Suspense fallback={null}>
                <Canvas mode="concurrent" shadows>
                    <PerspectiveCamera makeDefault position={[0, 10, 40]} />
                    <Clicks />
                </Canvas>
            </Suspense>
        </div>
    );
}

/* <Plane
                receiveShadow
                rotation={[Math.PI / -2, 0, 0]}
                args={[0, 0, 0]}
                color="transparent"
            >
                <meshStandardMaterial color={"white"} />
            </Plane>*/
