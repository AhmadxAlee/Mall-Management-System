import { useEffect, useRef } from 'react'

const StarBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    const meteors = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: Math.random() * 150 + 80,
      speed: Math.random() * 8 + 5,
      opacity: 0,
      active: false,
      delay: Math.random() * 3000,
      lastTime: 0,
    }))

    let frame = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw twinkling stars
      stars.forEach(star => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
        const opacity = star.opacity * (0.5 + 0.5 * twinkle)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 200, 230, ${opacity})`
        ctx.fill()
      })

      // Draw meteors
      meteors.forEach(meteor => {
        if (!meteor.active) {
          meteor.delay -= 16
          if (meteor.delay <= 0) {
            meteor.active = true
            meteor.x = Math.random() * canvas.width
            meteor.y = -50
            meteor.opacity = 1
          }
          return
        }

        meteor.x += meteor.speed * 0.6
        meteor.y += meteor.speed

        const tailX = meteor.x - meteor.length * 0.6
        const tailY = meteor.y - meteor.length

        const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
        gradient.addColorStop(0, `rgba(244, 114, 182, 0)`)
        gradient.addColorStop(0.4, `rgba(244, 114, 182, ${meteor.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(251, 146, 60, ${meteor.opacity})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(meteor.x, meteor.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Glow at head
        ctx.beginPath()
        ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251, 200, 100, ${meteor.opacity})`
        ctx.fill()

        if (meteor.y > canvas.height + 100) {
          meteor.active = false
          meteor.delay = Math.random() * 2000 + 500
          meteor.opacity = 0
        }
      })

      frame++
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d1548 30%, #3d1a6e 50%, #1a1a3e 70%, #0f0a2e 100%)'
      }} />
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.9 }} />
    </div>
  )
}

export default StarBackground