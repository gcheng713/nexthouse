"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

type HolographicPreviewProps = {
  modelUrl: string
}

export default function HolographicPreview({ modelUrl }: HolographicPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    camera.position.z = 5

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true

    // Add holographic effect
    const holographicTexture = new THREE.TextureLoader().load("/holographic-texture.jpg")
    const holographicMaterial = new THREE.MeshPhongMaterial({
      map: holographicTexture,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    })
    const hologram = new THREE.Mesh(geometry, holographicMaterial)
    hologram.scale.multiplyScalar(1.05)
    scene.add(hologram)

    // Holographic projection effect
    const projectionGeometry = new THREE.CylinderGeometry(0.5, 2, 4, 32, 1, true)
    const projectionMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    })
    const projection = new THREE.Mesh(projectionGeometry, projectionMaterial)
    projection.position.y = -2
    scene.add(projection)

    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      hologram.rotation.x += 0.015
      hologram.rotation.y += 0.015
      projection.rotation.y += 0.02
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-[400px] bg-black rounded-lg" />
}

