"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useTheme } from "next-themes"

export default function IntricateHologram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create modern, complex house
    const houseGroup = new THREE.Group()

    // Main structure with advanced material
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: theme === "dark" ? 0x4a6d8c : 0x88ccff,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.5,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.8,
    })

    // Main body (more complex shape)
    const mainBodyGeometry = new THREE.BoxGeometry(6, 4, 4)
    const mainBody = new THREE.Mesh(mainBodyGeometry, mainMaterial)
    houseGroup.add(mainBody)

    // Secondary structure (for architectural interest)
    const secondaryGeometry = new THREE.BoxGeometry(3, 5, 3)
    const secondaryStructure = new THREE.Mesh(secondaryGeometry, mainMaterial)
    secondaryStructure.position.set(-2, 0.5, 0)
    houseGroup.add(secondaryStructure)

    // Roof (modern flat design)
    const roofGeometry = new THREE.BoxGeometry(7, 0.5, 5)
    const roof = new THREE.Mesh(roofGeometry, mainMaterial)
    roof.position.y = 2.25
    houseGroup.add(roof)

    // Windows (large and panoramic)
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: theme === "dark" ? 0x7a5fa0 : 0x9333ea,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
    })

    const windowGeometry = new THREE.PlaneGeometry(4, 1.5)
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
    window1.position.set(0, 0.5, 2.01)
    const window2 = window1.clone()
    window2.position.set(0, 0.5, -2.01)
    window2.rotation.y = Math.PI
    houseGroup.add(window1, window2)

    // Balcony
    const balconyGeometry = new THREE.BoxGeometry(4, 0.1, 1)
    const balcony = new THREE.Mesh(balconyGeometry, mainMaterial)
    balcony.position.set(0, -0.5, 2.5)
    houseGroup.add(balcony)

    // Balcony railing
    const railingGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8)
    const railingMaterial = new THREE.MeshPhysicalMaterial({
      color: theme === "dark" ? 0x8a8a8a : 0xcccccc,
      metalness: 0.8,
      roughness: 0.2,
    })
    for (let i = -1.8; i <= 1.8; i += 0.4) {
      const railing = new THREE.Mesh(railingGeometry, railingMaterial)
      railing.position.set(i, 0, 2.5)
      houseGroup.add(railing)
    }

    // Solar panels
    const solarPanelGeometry = new THREE.BoxGeometry(1, 0.1, 0.5)
    const solarPanelMaterial = new THREE.MeshPhysicalMaterial({
      color: theme === "dark" ? 0x1a1a1a : 0x000000,
      metalness: 0.9,
      roughness: 0.1,
    })
    for (let i = -2.5; i <= 2.5; i += 1) {
      const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial)
      solarPanel.position.set(i, 2.55, 0)
      solarPanel.rotation.x = Math.PI / 6
      houseGroup.add(solarPanel)
    }

    // Add holographic grid effect
    const gridHelper = new THREE.GridHelper(
      20,
      40,
      theme === "dark" ? 0x7a5fa0 : 0x9333ea,
      theme === "dark" ? 0x4a3e6b : 0x4f46e5,
    )
    gridHelper.position.y = -2
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.2
    scene.add(gridHelper)

    // Holographic effect
    const hologramGeometry = new THREE.BoxGeometry(8, 6, 6)
    const hologramMaterial = new THREE.MeshPhysicalMaterial({
      color: theme === "dark" ? 0x7a5fa0 : 0x9333ea,
      transparent: true,
      opacity: 0.1,
      transmission: 0.9,
      side: THREE.DoubleSide,
    })

    const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial)
    houseGroup.add(hologram)

    scene.add(houseGroup)

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(theme === "dark" ? 0x202020 : 0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(theme === "dark" ? 0x7a5fa0 : 0x9333ea, 2, 10)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(theme === "dark" ? 0x4a3e6b : 0x4f46e5, 2, 10)
    pointLight2.position.set(-5, -5, -5)
    scene.add(pointLight2)

    camera.position.set(0, 2, 12)

    // Add smooth controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Holographic ripple effect
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Smooth ripple effect
      hologram.scale.x = 1 + Math.sin(time) * 0.05
      hologram.scale.y = 1 + Math.sin(time + Math.PI / 2) * 0.05
      hologram.scale.z = 1 + Math.sin(time + Math.PI) * 0.05

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [theme])

  return <div ref={containerRef} className="w-full h-[50vh] my-8" />
}

