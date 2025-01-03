import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const GenerateGalaxy = dynamic(() => import('../models/GalaxyModel'), { ssr: false });


export default function Home() {
  if (typeof window === "undefined") (<div></div>);

  return (
    <div>
      <Head>
        <title>Haile Lakew | Galaxy Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 100, position: [3, 3, 3]}}
          style={{ width: "100vw", height: "100vh", background: 'black' }}
        >
          <OrbitControls/>
          <GenerateGalaxy/>
        </Canvas>
      </main>

      <footer></footer>
    </div>
  )
}
