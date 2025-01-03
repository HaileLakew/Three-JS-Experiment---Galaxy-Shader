import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from "@react-three/drei"
import * as THREE from "three";

import {GUI} from 'lil-gui'

function calculateGalaxy (parameters) {
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
  
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
  

        let colorInside = new THREE.Color(parameters.insideColor)
        let colorOutside = new THREE.Color(parameters.outsideColor)
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)
  
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
  
        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = 0 + randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    }

    return { positions, colors }
}

export default function GenerateGalaxy() {
    if (typeof window === "undefined") (<div></div>);
    const ref = useRef()

    let [parameters, setParameters] = useState(() => ({
        count: 100000,
        size: 0.05,
        radius: 5,
        branches: 2,
        spin: 5,
        randomness: 0.1,
        randomnessPower: 3,
        insideColor: '#00ff00',
        outsideColor: '#0000ff' 
    }))
    

    const geometry = useMemo(()=> new THREE.BufferGeometry(),[]) 
  
    useFrame(({clock}) => { ref.current.rotation.y = clock.elapsedTime / 10 })
  
    useEffect(()=>{
        const gui = new GUI()
        gui.add(parameters, 'count').min(0).max(100000).step(1).onChange((value) => {setParameters({...parameters, ['count']: value});})
        gui.add(parameters, 'size').min(.1).max(.5).step(.01).onChange((value) => {setParameters({...parameters, ['size']: value});})
        gui.add(parameters, 'radius').min(1).max(5).step(1).onChange((value) => {setParameters({...parameters, ['radius']: value});})
        gui.add(parameters, 'branches').min(1).max(5).step(1).onChange((value) => {setParameters({...parameters, ['branches']: value});})
        gui.add(parameters, 'spin').min(1).max(5).step(1).onChange((value) => {setParameters({...parameters, ['spin']: value});})
        gui.add(parameters, 'randomness').min(.1).max(.5).step(.01).onChange((value) => {setParameters({...parameters, ['randomness']: value});})
        gui.add(parameters, 'randomnessPower').min(1).max(3).step(1).onChange((value) => {setParameters({...parameters, ['randomnessPower']: value});})
        gui.addColor(parameters, 'insideColor')
        gui.addColor(parameters, 'outsideColor')
    })

    useEffect(() => {
        const { positions, colors } = calculateGalaxy(parameters)

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    }, [geometry, parameters])
    
  

    return (
      <group ref={ref}>
        <points args={[geometry]}>
            <pointsMaterial 
                size={parameters.size}
                sizeAttenuation
                vertexColors
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                {...useTexture({
                    map: 'textures/Star.png',
                    alphaMap: 'textures/Star.png',
                })}
                />
        </points>
      </group>
    )
  }

