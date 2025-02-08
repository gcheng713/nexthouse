"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

type VirtualTourProps = {
  panoramaUrl: string
}

export default function VirtualTour({ panoramaUrl }: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const texture = new THREE.TextureLoader().load(panoramaUrl)
    const material = new THREE.MeshBasicMaterial({ map: texture })

    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false

    camera.position.set(0, 0, 0.1)

    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [panoramaUrl])

  return <div ref={containerRef} className="w-full h-[400px]" />
}

