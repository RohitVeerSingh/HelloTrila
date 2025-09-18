import { Injectable } from '@angular/core';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Database } from '../db/database';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private repo!: Repository<Project>;
  private sqlite = new SQLiteConnection(CapacitorSQLite);

  constructor(private db: Database) {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    if (Capacitor.getPlatform() === 'web') {
      sqlite.saveToStore('projectdb');
    }
  }

  private async getRepo() {
    if (!this.repo) {
      const conn = await this.db.initDB(); // ensure DB is initialized
      this.repo = this.db.getRepository();
    }
    console.log('checkrepo', this.repo);
    return this.repo;
  }

  async getAll(): Promise<Project[]> {
    const repo = await this.getRepo();
    return repo.find();
  }

  async create(title: string, description: string) {
    try {
      const repo = await this.getRepo();
      const proj = repo.create({ title, description, createdAt: new Date() });
      const savedProj = await repo.save(proj);
      console.log('Saved project:', savedProj);
      if (Capacitor.getPlatform() === 'web' || Capacitor.getPlatform() === 'android') {
        await this.sqlite.saveToStore('projectdb');
      }
      return savedProj;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }


  async update(id: number, title: string, description: string) {
    const repo = await this.getRepo();
    await repo.update(id, { title, description });
    if (Capacitor.getPlatform() === 'web' || Capacitor.getPlatform() === 'android') {
      await this.sqlite.saveToStore('projectdb');
    }
  }

  async delete(id: number) {
    const repo = await this.getRepo();
    await repo.delete(id);
      if (Capacitor.getPlatform() === 'web' || Capacitor.getPlatform() === 'android') {
      await this.sqlite.saveToStore('projectdb');
    }
  }
}
