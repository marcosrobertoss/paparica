import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useDashboardData } from '../context/DataContext';
import { getFilteredData, aggregateByUnit, getUnitsList } from '../lib/metrics';
import UnitCard from '../components/UnitCard';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';

export default function UnitsView() {
  const { currentMonth, currentYear } = useOutletContext();
  const { rows } = useDashboardData();
  const reducedMotion = usePrefersReducedMotion();

  const unitsList = useMemo(() => getUnitsList(rows), [rows]);
  const filtered = useMemo(() => getFilteredData(rows, currentYear, currentMonth), [rows, currentYear, currentMonth]);
  const isAllMonths = currentMonth === 'all';
  const displayUnits = useMemo(
    () => aggregateByUnit(filtered, unitsList, isAllMonths),
    [filtered, unitsList, isAllMonths]
  );

  useGSAP(
    () => {
      gsap.fromTo(
        '.unit-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: gsapDuration(0.06, reducedMotion), duration: gsapDuration(0.35, reducedMotion) }
      );
    },
    { dependencies: [currentMonth, currentYear, reducedMotion] }
  );

  return (
    <section>
      <div className="units-card-grid">
        {displayUnits.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            Nenhum dado disponível. Preencha informações no painel "Editor de Dados".
          </div>
        )}
        {displayUnits.map((u) => (
          <UnitCard key={u.unit} u={u} />
        ))}
      </div>
    </section>
  );
}
