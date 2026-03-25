import Dexie from 'dexie';

// 1. Create the database and name it
export const db = new Dexie('ALSOfflineDB');

// 2. Define the tables and their indexed keys
db.version(1).stores({
  // Stores the actual reading materials (e.g., HUMSS or CBF text)
  modules: 'id, module_type, title, content, updated_at', 
  
  // Stores the student's quiz scores while they are offline
  progressQueue: '++id, user_id, module_name, score, is_synced' 
});