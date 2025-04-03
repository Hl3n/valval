"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ParticleBackground from "@/components/particle-background"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    const handleMouseMove = (e: MouseEvent) => {
      // Update background parallax effect
      if (backgroundRef.current) {
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight
        backgroundRef.current.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center cursor-crosshair">
      {/* Enhanced background with hexagon grid */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <ParticleBackground />

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-900/20"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 20}s infinite linear`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center space-y-12 px-4">
        {/* Loading animation for the text */}
        <div className="relative">
          {loading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}

          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-tighter flex flex-wrap justify-center"
            initial="hidden"
            animate={loading ? "hidden" : "visible"}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {/* Animate each letter of "getvalor" */}
            <span className="text-white flex">
              {"getvalor".split("").map((letter, i) => (
                <motion.span
                  key={`getvalor-${i}`}
                  custom={i}
                  variants={letterVariants}
                  className="relative inline-block"
                >
                  {letter}
                  <span className="absolute inset-0 blur-[10px] opacity-70 text-white" aria-hidden="true">
                    {letter}
                  </span>
                </motion.span>
              ))}
            </span>

            {/* Animate each letter of ".xyz" */}
            <span className="text-purple-500 flex">
              {".xyz".split("").map((letter, i) => (
                <motion.span
                  key={`xyz-${i}`}
                  custom={i + "getvalor".length}
                  variants={letterVariants}
                  className="relative inline-block"
                >
                  {letter}
                  <span className="absolute inset-0 blur-[15px] opacity-70 text-purple-500" aria-hidden="true">
                    {letter}
                  </span>
                </motion.span>
              ))}
            </span>
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              asChild
              className="text-xl px-8 py-6 bg-purple-900 hover:bg-purple-800 text-white border border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] relative overflow-hidden group cursor-crosshair"
            >
              <a href="https://discord.gg/getvalor" target="_blank" rel="noopener noreferrer">
                Join Discord
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></span>
              </a>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Button
              asChild
              className="text-xl px-8 py-6 bg-black hover:bg-gray-900 text-white border border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] relative overflow-hidden group cursor-crosshair"
            >
              <a href="https://ads.luarmor.net/get_key?for=-gbVzmkCtUCcn">
                Get Key
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></span>
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-900/30 to-transparent" />
    </div>
  )
}

