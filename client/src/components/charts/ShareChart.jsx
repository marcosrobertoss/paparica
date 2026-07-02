import { useMemo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './chartSetup';
import { getChartTheme, CHART_COLORS } from '../../lib/format';
import { usePrefersReducedMotion, gsapDuration } from '../../hooks/usePrefersReducedMotion';

export default function ShareChart({ filteredRows, theme }) {
  const cardRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: gsapDuration(0.4, reducedMotion), delay: 0.1 });
  }, [filteredRows.length, reducedMotion]);

  const { data, options } = useMemo(() => {
    const { textColor, isDark } = getChartTheme(theme);
    const unitInvestment = {};
    filteredRows.forEach((d) => {
      unitInvestment[d.unit] = (unitInvestment[d.unit] || 0) + (d.investment || 0);
    });

    const labels = Object.keys(unitInvestment).filter((u) => unitInvestment[u] > 0);
    const values = labels.map((u) => unitInvestment[u]);
    const chartLabels = labels.length ? labels : ['Sem dados'];
    const chartValues = values.length ? values : [1];

    return {
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartValues,
            backgroundColor: CHART_COLORS.slice(0, chartLabels.length),
            borderWidth: isDark ? 2 : 1,
            borderColor: isDark ? '#1a1817' : '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 4 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { family: 'Outfit', size: 11 },
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              boxHeight: 8,
              padding: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (!labels.length) return 'Nenhum dado cadastrado';
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return ` ${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
              },
            },
          },
        },
        cutout: '65%',
      },
    };
  }, [filteredRows, theme]);

  return (
    <div className="chart-card" ref={cardRef}>
      <h3>Participação por Unidade</h3>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
