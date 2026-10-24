import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Modal } from '../hooks/useGreetingFlow';
import type { GreetingConfig } from '../config/greeting';
import Photo from './Photo';
export default function Modals({ modal, cfg, onClose }: { modal: Modal; cfg: GreetingConfig; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => {
    if (modal === 'photo') setPhotoIndex(0);
  }, [modal]);
  const photos = cfg.photos;

  return (
    <AnimatePresence>
      {modal && (
        <motion.div key={modal} className="overlay" role="dialog" aria-modal="true" aria-label={modal === 'photo' ? 'Ảnh phóng to' : 'Nội dung thư'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} onClick={onClose}>
          <motion.div className={modal === 'photo' ? 'box photo-box' : 'box letter-box'} onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}>
            <button className="close" autoFocus onClick={onClose} aria-label="Đóng"><X size={22} /></button>
            {modal === 'photo' ? (
              <div className="photo-gallery">
                <Photo className="big-photo" src={photos[photoIndex]} alt={cfg.photoAlt} fallbackSrc={cfg.photoFallback} />
                {photos.length > 1 && (
                  <>
                    <button className="photo-nav photo-prev" aria-label="Ảnh trước" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="photo-nav photo-next" aria-label="Ảnh tiếp theo" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}>
                      <ChevronRight size={24} />
                    </button>
                    <span className="photo-count" aria-live="polite">{photoIndex + 1} / {photos.length}</span>
                  </>
                )}
              </div>
            ) : (
              <article className="paper">
                <h2>{cfg.title}</h2><p className="sub">{cfg.subtitle}</p>
                <p className="to">{cfg.recipient},</p>
                {cfg.message.map((m, i) => <p key={i}>{m}</p>)}
                <p className="sig">{cfg.signature}</p>
              </article>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
