"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


export default function HolographicHouse() {
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
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Create a detailed house
    const houseGroup = new THREE.Group()

    // Enhanced materials with holographic effect
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.05,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 1,
      iridescence: 1,
      iridescenceIOR: 1.3,
      transparent: true,
      opacity: 0.9,
    })

    const glowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      emissive: 0x9333ea,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.8,
    })

    const energyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x4f46e5,
      emissiveIntensity: 1,
      metalness: 1,
      roughness: 0,
      transmission: 1,
      transparent: true,
      opacity: 0.5,
    })

    // Create environment map
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const envMap = cubeTextureLoader.load([
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ])
    scene.environment = envMap
    scene.background = null

    // Create main building structure using custom geometry
    const createMainStructure = () => {
      const structure = new THREE.Group()
      
      // Base shape with multiple levels
      const levels = 4
      const levelHeight = 1.5
      const baseWidth = 5
      
      for (let i = 0; i < levels; i++) {
        const scale = 1 - (i * 0.15)
        const baseGeometry = new THREE.BoxGeometry(
          baseWidth * scale,
          levelHeight,
          baseWidth * scale,
          4, 4, 4
        )
        const base = new THREE.Mesh(baseGeometry, chromeMaterial)
        base.position.y = i * levelHeight
        structure.add(base)
        
        // Add corner pillars
        const pillarRadius = 0.2 * scale
        const pillarHeight = levelHeight * 1.2
        const positions = [
          [baseWidth * scale / 2, baseWidth * scale / 2],
          [baseWidth * scale / 2, -baseWidth * scale / 2],
          [-baseWidth * scale / 2, baseWidth * scale / 2],
          [-baseWidth * scale / 2, -baseWidth * scale / 2],
        ]
        
        positions.forEach(([x, z]) => {
          const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 8),
            chromeMaterial
          )
          pillar.position.set(x, i * levelHeight, z)
          structure.add(pillar)
        })
      }
      
      return structure
    }

    // Create intricate roof structure
    const createRoof = () => {
      const roofGroup = new THREE.Group()
      
      // Main pyramid roof
      const roofGeometry = new THREE.ConeGeometry(3, 2.5, 8)
      const roof = new THREE.Mesh(roofGeometry, chromeMaterial)
      roof.position.y = 6
      roofGroup.add(roof)
      
      // Floating roof elements
      for (let i = 0; i < 3; i++) {
        const floatingRoof = new THREE.Mesh(
          new THREE.ConeGeometry(2 - i * 0.5, 1, 8),
          glowMaterial.clone()
        )
        floatingRoof.position.y = 7 + i * 0.8
        roofGroup.add(floatingRoof)
      }
      
      return roofGroup
    }

    // Create detailed window panels
    const createWindowPanel = (width: number, height: number) => {
      const panel = new THREE.Group()
      
      // Window frame
      const frameShape = new THREE.Shape()
      frameShape.moveTo(-width/2, -height/2)
      frameShape.lineTo(width/2, -height/2)
      frameShape.lineTo(width/2, height/2)
      frameShape.lineTo(-width/2, height/2)
      frameShape.lineTo(-width/2, -height/2)
      
      const frameHoles = []
      const holeWidth = width * 0.8
      const holeHeight = height * 0.8
      
      const hole = new THREE.Path()
      hole.moveTo(-holeWidth/2, -holeHeight/2)
      hole.lineTo(holeWidth/2, -holeHeight/2)
      hole.lineTo(holeWidth/2, holeHeight/2)
      hole.lineTo(-holeWidth/2, holeHeight/2)
      frameHoles.push(hole)
      
      frameShape.holes = frameHoles
      
      const frameGeometry = new THREE.ExtrudeGeometry(frameShape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3
      })
      
      const frame = new THREE.Mesh(frameGeometry, chromeMaterial)
      
      // Window glass
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(holeWidth, holeHeight),
        glowMaterial
      )
      glass.position.z = 0.05
      
      panel.add(frame, glass)
      return panel
    }

    // Create energy field effects
    const createEnergyFields = () => {
      const fieldGroup = new THREE.Group()
      
      // Vertical energy beams
      for (let i = 0; i < 4; i++) {
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 12, 8),
          energyMaterial
        )
        beam.position.set(
          Math.cos(i * Math.PI/2) * 3,
          5,
          Math.sin(i * Math.PI/2) * 3
        )
        fieldGroup.add(beam)
      }
      
      // Energy rings
      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(3 + i * 0.5, 0.05, 16, 50),
          energyMaterial.clone()
        )
        ring.rotation.x = Math.PI/2
        ring.position.y = -2
        fieldGroup.add(ring)
      }
      
      return fieldGroup
    }

    // Create floating platforms
    const createPlatforms = () => {
      const platformGroup = new THREE.Group()
      
      for (let i = 0; i < 3; i++) {
        const platform = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5 - i * 0.3, 1.8 - i * 0.3, 0.2, 8),
          chromeMaterial
        )
        platform.position.y = -3 - i * 1
        platformGroup.add(platform)
      }
      
      return platformGroup
    }

    // Assemble all components
    const mainStructure = createMainStructure()
    const roof = createRoof()
    const energyFields = createEnergyFields()
    const platforms = createPlatforms()
    
    // Add windows to each level
    for (let i = 0; i < 4; i++) {
      const y = i * 1.5 + 0.5
      for (let j = 0; j < 4; j++) {
        const window = createWindowPanel(1, 0.8)
        window.position.y = y
        window.rotation.y = j * Math.PI/2
        window.position.x = Math.cos(j * Math.PI/2) * 2.5
        window.position.z = Math.sin(j * Math.PI/2) * 2.5
        mainStructure.add(window)
      }
    }

    houseGroup.add(mainStructure, roof, energyFields, platforms)
    houseGroup.scale.set(1.5, 1.5, 1.5)

    // Add the house to the scene
    scene.add(houseGroup)

    // Position camera
    camera.position.set(15, 8, 15)
    camera.lookAt(0, 5, 0)

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x9333ea, 2)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x4f46e5, 2)
    pointLight2.position.set(-10, -5, -10)
    scene.add(pointLight2)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(0, 5, 0)

    // Animation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      // Rotate entire structure
      houseGroup.rotation.y += 0.001

      // Animate floating roof elements
      roof.children.forEach((child, i) => {
        if (i > 0) {
          child.position.y = 7 + i * 0.8 + Math.sin(time * 2 + i) * 0.2
          child.rotation.y = time * (1 - i * 0.2)
        }
      })

      // Animate energy fields
      energyFields.children.forEach((field, i) => {
        if (field.geometry.type === 'TorusGeometry') {
          field.rotation.z = time * (1 - i * 0.1)
          field.position.y = -2 + Math.sin(time + i * Math.PI/3) * 0.3
          field.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1)
        } else {
          field.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.2
        }
      })

      // Animate platforms
      platforms.children.forEach((platform, i) => {
        platform.rotation.y = time * (1 - i * 0.2)
        platform.position.y = -3 - i * 1 + Math.sin(time + i * Math.PI/2) * 0.2
      })

      // Animate window glow
      mainStructure.children.forEach((child, i) => {
        if (child.type === 'Group') {
          const glass = child.children[1]
          if (glass) {
            glass.material.opacity = 0.8 + Math.sin(time * 2 + i) * 0.2
            glass.material.emissiveIntensity = 0.5 + Math.sin(time * 2 + i) * 0.3
          }
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="w-screen h-[80vh] -mx-4 sm:-mx-8 md:-mx-16">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}
