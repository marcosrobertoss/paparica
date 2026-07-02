import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from '../components/Sidebar';
import { useDashboardData } from '../context/DataContext';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';

const TITLES = {
  '/': { title: 'Visão Geral do Negócio', subtitle: 'Acompanhe as métricas agregadas de todas as unidades.' },
  '/units': { title: 'Monitoramento de Unidades', subtitle: 'Visualize a performance individual de cada franquia Papa Rica.' },
  '/editor': { title: 'Editor Manual de Dados', subtitle: 'Insira, modifique ou gerencie os dados das unidades mês a mês.' },
  '/importer': { title: 'Importação e Configurações', subtitle: 'Envie planilhas Excel para atualizar o dashboard automaticamente.' },
  '/admin': { title: 'Administração', subtitle: 'Gerencie usuários, permissões e a conexão com o Google Sheets.' },
};

export default function DashboardLayout() {
  const location = useLocation();
  const contentRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { rows } = useDashboardData();
  const [currentMonth, setCurrentMonth] = useState(String(new Date().getMonth()));
  const [currentYear, setCurrentYear] = useState(String(new Date().getFullYear()));

  const yearOptions = useMemo(() => {
    const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);
    return years.length ? years : [new Date().getFullYear()];
  }, [rows]);

  // On first data load, point the filters at the most recent month that has
  // data — the current calendar month is often still empty in the sheet.
  const didInitFilters = useRef(false);
  useEffect(() => {
    if (didInitFilters.current || !rows.length) return;
    didInitFilters.current = true;
    const latest = rows.reduce((acc, r) => (r.year * 12 + r.month > acc.year * 12 + acc.month ? r : acc));
    setCurrentYear(String(latest.year));
    setCurrentMonth(String(latest.month));
  }, [rows]);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: gsapDuration(0.25, reducedMotion) }
      );
    },
    { dependencies: [location.pathname, reducedMotion] }
  );

  const meta = TITLES[location.pathname] || TITLES['/'];

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-title-wrapper">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
          <div className="header-controls">
            <select
              className="custom-select"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            >
              <option value="all">Ano Inteiro</option>
              <option value="0">Janeiro</option>
              <option value="1">Fevereiro</option>
              <option value="2">Março</option>
              <option value="3">Abril</option>
              <option value="4">Maio</option>
              <option value="5">Junho</option>
              <option value="6">Julho</option>
              <option value="7">Agosto</option>
              <option value="8">Setembro</option>
              <option value="9">Outubro</option>
              <option value="10">Novembro</option>
              <option value="11">Dezembro</option>
            </select>
            <select
              className="custom-select"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
            >
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
              {!yearOptions.includes(parseInt(currentYear, 10)) && (
                <option value={currentYear}>{currentYear}</option>
              )}
            </select>
          </div>
        </header>

        <div className="route-transition-content" ref={contentRef}>
          <Outlet context={{ currentMonth, currentYear }} />
        </div>
      </main>
    </div>
  );
}
