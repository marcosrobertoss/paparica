# Dashboard

## Rodar localmente

```bash
npm run install:all
npm run dev
```

## Produção

```bash
npm run install:all
npm run build
pm2 start ecosystem.config.js
```

Requer Node 20+ e as variáveis de ambiente configuradas (ver documentação interna).
Atualização: `git pull && npm run install:all && npm run build && pm2 restart dashboard-paparica`.
