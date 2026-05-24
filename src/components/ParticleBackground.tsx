import React, { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 20 + 10, // 10-30s
      delay: Math.random() * 5,
      color: Math.random() > 0.85 ? 'bg-jade-400' : 'bg-saffron-200', // mostly gold, some cyan flakes
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color === 'bg-jade-400' ? 'rgba(104, 180, 173, 0.4)' : 'rgba(214, 176, 82, 0.4)'}`,
            animation: `float ${particle.duration}s ease-in-out infinite alternate ${particle.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-50px) translateX(20px);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
