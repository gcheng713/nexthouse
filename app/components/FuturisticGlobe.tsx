"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useTheme } from "next-themes"

export default function FuturisticGlobe() {
  const mountRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

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

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64)
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: theme === "dark" ? 0x2a4d69 : 0x4a9ff5,
      emissive: theme === "dark" ? 0x0a2948 : 0x0d47a1,
      specular: theme === "dark" ? 0x3a6d89 : 0x4a9ff5,
      shininess: 10,
      transparent: true,
      opacity: 0.9,
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    scene.add(globe)

    // Add atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(5.2, 64, 64)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { type: "f", value: 0.3 },
        p: { type: "f", value: 5 },
        glowColor: { type: "c", value: new THREE.Color(theme === "dark" ? 0x2a4d69 : 0x4a9ff5) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowMesh)

    // Add point lights to create a shimmering effect
    const lights: THREE.PointLight[] = []
    for (let i = 0; i < 5; i++) {
      const light = new THREE.PointLight(theme === "dark" ? 0x3a6d89 : 0x4a9ff5, 0.5, 20)
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI
      const r = 5 + Math.random() * 0.2
      light.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta))
      scene.add(light)
      lights.push(light)
    }

    camera.position.z = 15

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      globe.rotation.y += 0.002
      glowMesh.rotation.y += 0.002

      // Animate point lights
      lights.forEach((light, index) => {
        const time = Date.now() * 0.001 + index * 1000
        light.intensity = 0.5 + Math.sin(time) * 0.3
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
  }, [theme])

  return <div ref={mountRef} className="w-full h-full" />
}

