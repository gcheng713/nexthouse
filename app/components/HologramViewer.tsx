"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function HologramViewer() {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    currentMount.appendChild(renderer.domElement)

    // Create a simple house shape
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Add holographic effect
    const holographicTexture = new THREE.TextureLoader().load("/placeholder.svg?height=256&width=256")
    const holographicMaterial = new THREE.MeshPhongMaterial({
      map: holographicTexture,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    })
    const hologram = new THREE.Mesh(geometry, holographicMaterial)
    hologram.scale.multiplyScalar(1.05)
    scene.add(hologram)

    // Camera position
    camera.position.z = 5

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      hologram.rotation.x += 0.015
      hologram.rotation.y += 0.015
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Clean up
    return () => {
      currentMount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: "100%", height: "400px" }} />
}

