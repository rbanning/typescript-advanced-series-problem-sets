import fs from 'fs/promises';

export async function saveData(path: string, data: string) {
  try {
    await fs.writeFile(path, data);    
  } catch (error) {
    console.warn(`Failed to save data to file system`, {path, error});
    throw new Error('saveData() failed');
  }
}