const StarBackground = () => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 2 + 1}px`,
    height: `${Math.random() * 80 + 40}px`,
    duration: `${Math.random() * 3 + 2}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  const shapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 8 + 4,
    type: ['circle', 'triangle', 'plus'][Math.floor(Math.random() * 3)],
    opacity: Math.random() * 0.15 + 0.05,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d1548 30%, #3d1a6e 50%, #1a1a3e 70%, #0f0a2e 100%)'
      }} />

      {/* Animated falling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: '-100px',
            width: star.width,
            height: star.height,
            background: 'linear-gradient(180deg, rgba(244,114,182,0) 0%, rgba(244,114,182,0.8) 50%, rgba(251,146,60,0.4) 100%)',
            animation: `fall ${star.duration} ${star.delay} infinite linear`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Floating shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute"
          style={{
            left: shape.left,
            top: shape.top,
            opacity: shape.opacity,
            color: 'rgba(244,114,182,0.6)',
            fontSize: `${shape.size * 2}px`,
          }}
        >
          {shape.type === 'circle' && (
            <div style={{
              width: shape.size,
              height: shape.size,
              borderRadius: '50%',
              border: '1px solid rgba(244,114,182,0.4)',
            }} />
          )}
          {shape.type === 'triangle' && (
            <div style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid rgba(244,114,182,0.3)`,
            }} />
          )}
          {shape.type === 'plus' && (
            <div style={{ color: 'rgba(244,114,182,0.3)', fontSize: shape.size * 2, lineHeight: 1 }}>+</div>
          )}
        </div>
      ))}

      {/* Gradient orbs */}
      <div className="absolute" style={{
        top: '-20%', right: '-10%',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
      }} />
      <div className="absolute" style={{
        bottom: '-20%', left: '-10%',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)',
      }} />
    </div>
  )
}

export default StarBackground