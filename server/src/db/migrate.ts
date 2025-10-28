import { initDb } from './database.js';

console.log('🔄 Executando migrações...');
initDb();
console.log('✅ Migrações concluídas!');

