import React, { useEffect, useRef } from 'react';

export default function TacticalBackground({ 
  showGrid = true, 
  showScanLines = true, 
  showDataParticles = true,
  intensity = 'medium',
  className = '' 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!showDataParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = intensity === 'high' ? 100 : intensity === 'low' ? 30 : 60;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.01) * 0.5;

        if (this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00D9FF';
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showDataParticles, intensity]);

  return (
    <div className={`tactical-background fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Tactical Grid */}
      {showGrid && (
        <div 
          className="absolute inset-0 tactical-grid opacity-20"
          style={{
            backgroundSize: '50px 50px'
          }}
        />
      )}

      {/* Scan Lines */}
      {showScanLines && (
        <>
          <div 
            className="grid-scan-line animate-grid-scan" 
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="grid-scan-line animate-grid-scan" 
            style={{ animationDelay: '1.5s', top: '50%' }}
          />
        </>
      )}

      {/* Data Particles Canvas */}
      {showDataParticles && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 opacity-30"
        />
      )}

      {/* Floating Card Suits */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute text-[8rem] text-intel-cyan animate-pulse" 
          style={{ 
            top: '10%', 
            left: '5%',
            animationDuration: '4s',
            animationDelay: '0s'
          }}
        >
          ♠
        </div>
        <div 
          className="absolute text-[6rem] text-poker-heart-red animate-pulse" 
          style={{ 
            top: '60%', 
            right: '10%',
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        >
          ♥
        </div>
        <div 
          className="absolute text-[7rem] text-poker-diamond-red animate-pulse" 
          style={{ 
            bottom: '20%', 
            left: '15%',
            animationDuration: '5s',
            animationDelay: '2s'
          }}
        >
          ♦
        </div>
        <div 
          className="absolute text-[5rem] text-intel-cyan animate-pulse" 
          style={{ 
            top: '30%', 
            right: '30%',
            animationDuration: '4.5s',
            animationDelay: '0.5s'
          }}
        >
          ♣
        </div>
      </div>

      {/* Glowing orbs for ambiance */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-intel-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-intel-blue/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-mission-gold/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

// Simplified version for cards/panels
export function TacticalCardBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="tactical-grid opacity-10 absolute inset-0" style={{ backgroundSize: '20px 20px' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-intel-blue/5 to-intel-cyan/5" />
    </div>
  );
}
