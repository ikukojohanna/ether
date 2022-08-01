import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";

export default function Sound({ url }) {
    const sound = useRef();
    const [listener] = useState(() => new THREE.AudioListener());
    const buffer = useLoader(THREE.AudioLoader, url);
    useEffect(() => {
        sound.current.setBuffer(buffer);
        sound.current.setRefDistance(1);
        sound.current.setLoop(true);
        sound.current.play();
    }, []);
    return <positionalAudio ref={sound} args={[listener]} />;
}
