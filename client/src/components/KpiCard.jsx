import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';

// Tweens a plain object's numeric value and writes the formatted string into
// the DOM on every tick — avoids re-mounting the card, just re-tweens the
// displayed number when `value` changes (e.g. due to a filter change).
export default function KpiCard({ accentClass, title, icon, value, formatValue, meta }) {
  const valueRef = useRef(null);
  const tweenState = useRef({ current: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const state = tweenState.current;
      const from = state.current;
      gsap.to(state, {
        current: value,
        duration: gsapDuration(0.6, reducedMotion),
        ease: 'power2.out',
        onUpdate: () => {
          if (valueRef.current) {
            valueRef.current.textContent = formatValue(state.current);
          }
        },
      });
      if (reducedMotion && valueRef.current) {
        valueRef.current.textContent = formatValue(value);
      }
      return () => {
        state.current = from === undefined ? value : state.current;
      };
    },
    { dependencies: [value, reducedMotion] }
  );

  return (
    <div className={`kpi-card ${accentClass}`}>
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-icon-wrapper">{icon}</div>
      </div>
      <div className="kpi-value" ref={valueRef}>
        {formatValue(0)}
      </div>
      <div className="kpi-meta">{meta}</div>
    </div>
  );
}
