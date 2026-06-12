const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

// Créer le dossier data/ si nécessaire
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function openDb() {
  return open({
    filename: path.join(dataDir, 'rapfi.db'),
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await openDb();
  
  // Création des tables principales
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT, prenom TEXT, eglise TEXT, district TEXT,
      responsable TEXT, email TEXT UNIQUE, password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS gl_data (
      user_id INTEGER,
      month TEXT,
      data TEXT,
      PRIMARY KEY (user_id, month)
    );
    CREATE TABLE IF NOT EXISTS depenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      month TEXT,
      data TEXT
    );
    CREATE TABLE IF NOT EXISTS membres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      nom TEXT, prenom TEXT, dateEntree TEXT,
      typeEntree TEXT, dateSortie TEXT, typeSortie TEXT,
      raisonSortie TEXT, actif INTEGER, sexe TEXT, age INTEGER
    );
  `);
  
  // Ajouter les colonnes manquantes à la table users
  const columnsToAdd = [
    { name: 'federation', type: 'TEXT' },
    { name: 'fonction', type: 'TEXT' },
    { name: 'niveau', type: 'INTEGER' },
    { name: 'photo', type: 'TEXT' },
    { name: 'adresse', type: 'TEXT' },
    { name: 'contact', type: 'TEXT' }
  ];
  
  for (const col of columnsToAdd) {
    try {
      await db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
      console.log(`✅ Colonne ${col.name} ajoutée`);
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.warn(`Erreur pour ${col.name}:`, err.message);
      }
    }
  }
  
  return db;
}

module.exports = { initDb, openDb };