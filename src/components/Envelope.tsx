import { motion } from 'motion/react';
import type { Stage } from '../hooks/useGreetingFlow';
import type { GreetingConfig } from '../config/greeting';
import Photo from './Photo';
type Props = { stage: Exclude<Stage, 'flower'>; cfg: GreetingConfig; onReveal: () => void; onPhoto: () => void; onLetter: () => void };
const rev = (s: Props['stage']) => s === 'revealed';
export default function Envelope({ stage, cfg, onReveal, onPhoto, onLetter }: Props) {
  const out = rev(stage);
  const soft = { type: 'spring', stiffness: 70, damping: 18 } as const;
  return (
    <motion.div className="env-wrap" initial={{ opacity: 0, y: 60, scale: 0.8 }} animate={{ opacity: 1, y: out ? 40 : 0, scale: 1 }} transition={{ duration: 1, ease: [0.22, 0.8, 0.2, 1] }}>
      <div className="env">
        <div className="env-back" />
        <motion.button className="photo" aria-label="Phóng to ảnh" tabIndex={out ? 0 : -1} onClick={onPhoto}
          animate={out ? { y: '-62%', rotate: 6, opacity: 1 } : { y: '0%', rotate: 0, opacity: 0 }} transition={{ ...soft, delay: out ? 0.35 : 0 }}>
          <Photo src={cfg.photos[0]} alt={cfg.photoAlt} fallbackSrc={cfg.photoFallback} />
        </motion.button>
        <motion.button className="letter-mini" aria-label={out ? 'Mở rộng lá thư để đọc' : 'Mở lá thư'} onClick={out ? onLetter : onReveal}
          initial={{ y: '0%' }} animate={{ y: out ? '-42%' : '-12%', x: out ? '-4%' : '0%' }} transition={out ? soft : { ...soft, delay: 0.9 }}>
          <b>{cfg.recipient},</b><span>{cfg.title}</span><i /><i /><i />
        </motion.button>
        <div className="env-front" />
        <div className="seal" aria-hidden="true" />
        <motion.div className="flap" initial={{ rotateX: 0, zIndex: 5 }} animate={{ rotateX: 180, zIndex: 1 }}
          transition={{ rotateX: { duration: 0.9, delay: 0.5, ease: 'easeInOut' }, zIndex: { delay: 0.85, duration: 0 } }} />
        {stage === 'envelope' && <button className="env-hit" aria-label="Mở phong bì" onClick={onReveal} />}
      </div>
      <motion.p className="env-hint" initial={{ opacity: 0 }} animate={{ opacity: out ? 0 : 1 }} transition={{ delay: out ? 0 : 1.6 }}>{cfg.envelopeHint}</motion.p>
    </motion.div>
  );
}
