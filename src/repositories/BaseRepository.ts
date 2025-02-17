// src/repositories/BaseRepository.ts
import fs from 'fs';
import path from 'path';

export default abstract class BaseRepository<T> {
  protected dbPath: string;

  constructor(fileName: string) {
    this.dbPath = path.join(__dirname, '../../databases', fileName);
  }

  protected findAll(): T[] {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
  }

  public findById(id: string): T | undefined {
    return this.findAll().find((item: any) => item.id === id);
  }

  protected create(entity: T): string {
    const entities = this.findAll();
    entities.push(entity);
    fs.writeFileSync(this.dbPath, JSON.stringify(entities, null, 2));
    return (entity as any).id; // assuming the entity has an `id` field
  }

  protected update(id: string, data: Partial<T>): boolean {
    const entities = this.findAll();
    const index = entities.findIndex((item: any) => item.id === id);

    if (index !== -1) {
      entities[index] = { ...entities[index], ...data };
      fs.writeFileSync(this.dbPath, JSON.stringify(entities, null, 2));
      return true;
    }
    return false;
  }

  protected delete(id: string): boolean {
    const entities = this.findAll();
    const updatedEntities = entities.filter((item: any) => item.id !== id);

    if (entities.length !== updatedEntities.length) {
      fs.writeFileSync(this.dbPath, JSON.stringify(updatedEntities, null, 2));
      return true;
    }
    return false;
  }
}
