import { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './chartSetup';
import { MONTHS_NAMES } from '../../lib/constants';
import { getChartTheme } from '../../lib/format';
import { usePrefersReducedMotion, gsapDuration } from '../../hooks/usePrefersReducedMotion';

export default function TrendChart({ rows, year, theme }) {
  const cardRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: gsapDuration(0.4, reducedMotion) });
  }, [year, reducedMotion]);

  const { data, options } = useMemo(() => {
    const { textColor, gridColor } = getChartTheme(theme);
    const yearNum = parseInt(year, 10);
    const monthlyInvest = Array(12).fill(0);
    const monthlyOrders = Array(12).fill(0);

    rows.filter((d) => d.year === yearNum).forEach((d) => {
      monthlyInvest[d.month] += d.investment || 0;
      monthlyOrders[d.month] += d.total_orders || 0;
    });

    return {
      data: {
        labels: MONTHS_NAMES,
        datasets: [
          {
            label: 'Investimento (R$)',
            data: monthlyInvest,
            borderColor: 'rgb(230, 43, 76)',
            backgroundColor: 'rgba(230, 43, 76, 0.1)',
            yAxisID: 'yInvest',
            tension: 0.3,
            borderWidth: 3,
            fill: true,
          },
          {
            label: 'Pedidos Totais',
            data: monthlyOrders,
            borderColor: '#0088cb',
            backgroundColor: 'rgba(0, 136, 203, 0.1)',
            yAxisID: 'yOrders',
            tension: 0.3,
            borderWidth: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Outfit' } } },
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } } },
          yInvest: {
            type: 'linear',
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Plus Jakarta Sans' },
              callback: (value) => 'R$ ' + value.toLocaleString('pt-BR'),
            },
          },
          yOrders: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } },
          },
        },
      },
    };
  }, [rows, year, theme]);

  return (
    <div className="chart-card" ref={cardRef}>
      <h3>Tendência Mensal (Histórico)</h3>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
