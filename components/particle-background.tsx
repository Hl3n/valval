"use client"

import { useEffect, useRef, useState } from "react"

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => setIsMouseInCanvas(true)
    const handleMouseLeave = () => setIsMouseInCanvas(false)

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Particle properties
    const particleCount = 200 // More particles
    const particles: Particle[] = []
    const connectionColors = [
      "rgba(147, 51, 234, alpha)", // Purple
      "rgba(139, 92, 246, alpha)", // Light purple
      "rgba(168, 85, 247, alpha)", // Medium purple
      "rgba(217, 70, 239, alpha)", // Pink-purple
      "rgba(79, 70, 229, alpha)", // Indigo
    ]

    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      speedX: number
      speedY: number
      color: string
      pulse: number
      pulseSpeed: number
      connectionColor: string
      connectionWidth: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.baseX = this.x // Original position to return to
        this.baseY = this.y
        this.size = Math.random() * 2 + 0.5 // Smaller particles
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.7 + 0.3})`
        this.pulse = Math.random() * Math.PI * 2 // Random starting phase
        this.pulseSpeed = Math.random() * 0.05 + 0.01
        this.connectionColor = connectionColors[Math.floor(Math.random() * connectionColors.length)]
        this.connectionWidth = Math.random() * 0.8 + 0.2
      }

      update(mouseX: number, mouseY: number, isMouseInCanvas: boolean) {
        // Random movement
        this.x += this.speedX
        this.y += this.speedY

        // Pulse effect
        this.pulse += this.pulseSpeed
        if (this.pulse > Math.PI * 2) this.pulse = 0

        // Mouse attraction
        if (isMouseInCanvas) {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Only attract if mouse is within certain range
          if (distance < 120) {
            const attractionForce = 0.5 // Strength of attraction
            const angle = Math.atan2(dy, dx)
            const attractionX = Math.cos(angle) * attractionForce
            const attractionY = Math.sin(angle) * attractionForce

            // Apply attraction with distance falloff
            const falloff = (120 - distance) / 120
            this.x += attractionX * falloff
            this.y += attractionY * falloff
          }
        }

        // Return to original position when mouse is far away
        const returnSpeed = 0.01
        this.x += (this.baseX - this.x) * returnSpeed
        this.y += (this.baseY - this.y) * returnSpeed

        // Wrap around edges with a small buffer
        const buffer = 50
        if (this.x > canvas.width + buffer) this.x = -buffer
        else if (this.x < -buffer) this.x = canvas.width + buffer
        if (this.y > canvas.height + buffer) this.y = -buffer
        else if (this.y < -buffer) this.y = canvas.height + buffer

        // Occasionally change direction
        if (Math.random() < 0.01) {
          this.speedX = (Math.random() - 0.5) * 0.5
          this.speedY = (Math.random() - 0.5) * 0.5
        }
      }

      draw() {
        if (!ctx) return

        // Pulsing size effect (subtle for small particles)
        const pulseSize = this.size + Math.sin(this.pulse) * 0.5

        // Glow effect
        ctx.shadowBlur = 5
        ctx.shadowColor = this.color

        ctx.beginPath()
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Reset shadow for performance
        ctx.shadowBlur = 0
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Connect particles with animated lines
    function connectParticles(time: number) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Maximum distance for connection
          const maxDistance = 100

          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = (1 - distance / maxDistance) * 0.8

            // Animated line width based on time and particle properties
            const lineWidthBase = particles[i].connectionWidth
            const lineWidthPulse = Math.sin(time * 0.001 + particles[i].pulse) * 0.5 + 0.5
            const lineWidth = lineWidthBase * lineWidthPulse

            // Get color with proper opacity
            const color = particles[i].connectionColor.replace("alpha", opacity.toString())

            // Draw the connection
            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()

            // Add glow effect to connections
            if (opacity > 0.5) {
              ctx.shadowBlur = 3
              ctx.shadowColor = color
              ctx.stroke()
              ctx.shadowBlur = 0
            }
          }
        }
      }
    }

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    function animate(timestamp: number) {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      // Use a semi-transparent clear for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update(mousePosition.x, mousePosition.y, isMouseInCanvas)
        particle.draw()
      }

      // Connect particles with animated lines
      connectParticles(timestamp)

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePosition, isMouseInCanvas])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
}

