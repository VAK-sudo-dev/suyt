import { useCallback, useEffect, useRef, useState } from 'react';
export type Stage = 'flower' | 'envelope' | 'revealed';
export type Modal = null | 'photo' | 'letter';
export function useGreetingFlow() {
  const [stage, setStage] = useState<Stage>('flower');
  const [modal, setModal] = useState<Modal>(null);
  const lock = useRef(0);
  const ok = (ms: number) => { const n = performance.now(); if (n < lock.current) return false; lock.current = n + ms; return true; };
  const pickFlower = useCallback(() => { if (stage === 'flower' && ok(2200)) setStage('envelope'); }, [stage]);
  const reveal = useCallback(() => { if (stage === 'envelope' && ok(1800)) setStage('revealed'); }, [stage]);
  const open = useCallback((m: Exclude<Modal, null>) => { if (stage === 'revealed' && !modal && ok(450)) setModal(m); }, [stage, modal]);
  const close = useCallback(() => { if (modal && ok(450)) setModal(null); }, [modal]);
  useEffect(() => {
    if (!modal) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modal, close]);
  return { stage, modal, pickFlower, reveal, open, close };
}
