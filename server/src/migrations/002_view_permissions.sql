CREATE TABLE IF NOT EXISTS views (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL
);

INSERT OR IGNORE INTO views (key, label) VALUES
    ('overview', 'Visão Geral'),
    ('units', 'Unidades'),
    ('editor', 'Editor de Dados'),
    ('importer', 'Importar Planilha');

CREATE TABLE IF NOT EXISTS user_view_permissions (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    view_key TEXT NOT NULL REFERENCES views(key),
    PRIMARY KEY (user_id, view_key)
);
