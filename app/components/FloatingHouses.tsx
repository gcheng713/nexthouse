"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

export default function FloatingHouses() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create larger, more detailed houses
    const houses: THREE.Group[] = []
    const houseCount = 30 // Reduced count for larger houses

    for (let i = 0; i < houseCount; i++) {
      const houseGroup = new THREE.Group()

      // Main body
      const bodyGeometry = new THREE.BoxGeometry(2, 2, 2)
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: theme === "dark" ? 0xffffff : 0x1a5f7a,
        transparent: true,
        opacity: theme === "dark" ? 0.3 : 0.6,
        shininess: 100,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

      // Roof
      const roofGeometry = new THREE.ConeGeometry(1.5, 1.5, 4)
      const roofMaterial = new THREE.MeshPhongMaterial({
        color: theme === "dark" ? 0xffffff : 0x2a6f8a,
        transparent: true,
        opacity: theme === "dark" ? 0.3 : 0.6,
        shininess: 100,
      })
      const roof = new THREE.Mesh(roofGeometry, roofMaterial)
      roof.position.y = 1.75
      roof.rotation.y = Math.PI / 4

      houseGroup.add(body, roof)
      houseGroup.scale.set(1.5, 1.5, 1.5)

      // Position houses in a wider space
      houseGroup.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50)

      houses.push(houseGroup)
      scene.add(houseGroup)
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(theme === "dark" ? 0x202020 : 0x404040, 2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(theme === "dark" ? 0x8080ff : 0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    camera.position.z = 30

    // Faster floating animation
    const animate = () => {
      requestAnimationFrame(animate)
      houses.forEach((house, index) => {
        // Increased speed for faster motion
        const time = Date.now() * 0.002
        const amplitude = 0.5
        const frequency = 0.3

        // Unique faster motion for each house
        house.position.y += Math.sin(time * frequency + index) * 0.05 * amplitude
        house.position.x += Math.cos(time * frequency + index) * 0.03 * amplitude

        // Faster rotation
        house.rotation.y += 0.005

        // Reset position if house moves too far
        if (Math.abs(house.position.y) > 50) house.position.y = 0
        if (Math.abs(house.position.x) > 50) house.position.x = 0
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [theme])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}
