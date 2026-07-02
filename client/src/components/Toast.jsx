import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';

export function Toast({ message, type = 'success', onDismiss }) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: gsapDuration(0.3, reducedMotion) }
    );
  }, [reducedMotion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ref.current) return onDismiss();
      gsap.to(ref.current, {
        opacity: 0,
        x: 40,
        duration: gsapDuration(0.25, reducedMotion),
        onComplete: onDismiss,
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss, reducedMotion]);

  return (
    <div className={`toast toast-${type}`} ref={ref}>
      {message}
    </div>
  );
}

export function ToastContainer({ toasts, dismissToast }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
