"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"

export default function VRTour() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Add VR button
    document.body.appendChild(VRButton.createButton(renderer))

    // Enable VR
    renderer.xr.enabled = true

    // Create a simple room
    const roomGeometry = new THREE.BoxGeometry(5, 3, 5)
    const roomMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.BackSide })
    const room = new THREE.Mesh(roomGeometry, roomMaterial)
    scene.add(room)

    // Add some furniture (simplified as boxes)
    const furnitureGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const furnitureMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 })

    const furniture1 = new THREE.Mesh(furnitureGeometry, furnitureMaterial)
    furniture1.position.set(1, 0, 1)
    scene.add(furniture1)

    const furniture2 = new THREE.Mesh(furnitureGeometry, furnitureMaterial)
    furniture2.position.set(-1, 0, -1)
    scene.add(furniture2)

    camera.position.z = 2

    function animate() {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
      })
    }

    animate()

    return () => {
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-[400px]" />
}

