import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, Clock, Gift, Star, DollarSign, Trophy } from 'lucide-react';

const PRIZES = [
  { id: 0, label: '50 XP',        color: '#60A5FA', icon: Star,       value: '50 XP'          },
  { id: 1, label: '100 DC',       color: '#F5C842', icon: Zap,        value: '100 Dark Coins'  },
  { id: 2, label: '200 XP',       color: '#34D399', icon: Star,       value: '200 XP'          },
  { id: 3, label: 'Bonus Access', color: '#A78BFA', icon: Gift,       value: 'Exclusive Deal'  },
  { id: 4, label: '500 XP',       color: '#F97316', icon: Trophy,     value: '500 XP'          },
  { id: 5, label: '250 DC',       color: '#EC4899', icon: Zap,        value: '250 Dark Coins'  },
  { id: 6, label: '$5 Rakeback',  color: '#C8A951', icon: DollarSign, value: '$5 Rakeback'     },
  { id: 7, label: 'Try Again',    color: '#6B7280', icon: Star,       value: 'Better luck!'    },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;
const RADIUS = 120;
const CENTER = 140;

function WheelCanvas({ rotation }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = CENTER * 2;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    PRIZES.forEach((prize, i) => {
      const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

      // Segment
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color + (i % 2 === 0 ? 'dd' : '99');
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px system-ui';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.label, RADIUS - 10, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#080C14';
    ctx.fill();
    ctx.strokeStyle = '#C8A951';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center icon text
    ctx.fillStyle = '#C8A951';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', CENTER, CENTER + 4);
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      width={CENTER * 2}
      height={CENTER * 2}
      style={{
        borderRadius: '50%',
        transform: `rotate(${rotation}deg)`,
        boxShadow: '0 0 32px rgba(200,169,81,0.3)',
      }}
    />
  );
}

export default function LuckyWheel({ hasSpun = false, onSpin }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spunThisSession, setSpunThisSession] = useState(hasSpun);
  // Countdown to next Sunday midnight
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7 || 7);
      nextSunday.setHours(0, 0, 0, 0);
      const diff = nextSunday - now;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m`);
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const handleSpin = () => {
    if (spinning || spunThisSession) return;

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];

    // Calculate rotation: multiple full spins + land on prize
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const totalRotation = rotation + 1800 + targetAngle - (rotation % 360);

    setSpinning(true);
    setResult(null);

    // Animate rotation via CSS
    const startTime = performance.now();
    const duration = 4500;
    const startRot = rotation;
    const diff = totalRotation - startRot;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const currentRot = startRot + diff * easeOut(t);
      setRotation(currentRot);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setRotation(totalRotation);
        setSpinning(false);
        setSpunThisSession(true);
        setResult(prize);

        if (prize.id !== 7) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: [prize.color, '#C8A951', '#ffffff'],
          });
        }
        if (onSpin) onSpin(prize);
      }
    }
    requestAnimationFrame(frame);
  };

  const PrizeIcon = result?.icon;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4" style={{ color: '#C8A951' }} />
        <h3 className="text-sm font-semibold text-white">Lucky Wheel</h3>
        <span className="text-[10px] text-gray-500">Weekly spin</span>
      </div>

      {/* Wheel container */}
      <div className="relative" style={{ width: CENTER * 2, height: CENTER * 2 }}>
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
          style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '20px solid #C8A951' }}
        />
        <WheelCanvas rotation={rotation} />
      </div>

      {/* Spin button or disabled state */}
      {!spunThisSession ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSpin}
          disabled={spinning}
          className="px-8 py-2.5 rounded-xl text-sm font-bold"
          style={{
            background: spinning ? 'rgba(200,169,81,0.3)' : 'linear-gradient(135deg, #C8A951, #F5C842)',
            color: '#080C14',
            opacity: spinning ? 0.7 : 1,
            cursor: spinning ? 'not-allowed' : 'pointer',
          }}
        >
          {spinning ? 'Spinning...' : 'SPIN!'}
        </motion.button>
      ) : (
        <div className="text-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Next spin in: <span className="text-gray-300 font-semibold">{countdown}</span></span>
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{
              background: result.color + '18',
              border: `1px solid ${result.color}44`,
              boxShadow: `0 0 16px ${result.color}30`,
            }}
          >
            {PrizeIcon && <PrizeIcon className="w-4 h-4" style={{ color: result.color }} />}
            <div>
              <div className="text-xs font-bold text-white">You won: {result.value}</div>
              <div className="text-[10px] text-gray-500">Added to your account</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prize list legend */}
      <div className="grid grid-cols-2 gap-1.5 w-full mt-1">
        {PRIZES.map(p => {
          const PIcon = p.icon;
          return (
            <div key={p.id} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-gray-500">{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
