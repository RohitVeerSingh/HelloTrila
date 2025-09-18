import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm/browser';
import { Project } from '../entities/project.entity';
import 'reflect-metadata'; // important for typeorm
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { createConnection, getConnection, Repository, Connection } from 'typeorm';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class Database {
  private ds: DataSource | null = null;
  private initialized = false;
  private connection!: Connection;
  private repo!: Repository<Project>;
  // private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private dbInitialized = false;
  constructor() {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    if (Capacitor.getPlatform() === 'web') {
      sqlite.initWebStore();
       sqlite.saveToStore('projectdb');
    }
  }

  async initDB() {
    if (this.dbInitialized) return;
    try {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      if (Capacitor.getPlatform() === 'web') {
        await sqlite.initWebStore();
        // this.sqlite.initWebStore();
      }
      const connection: Connection = await createConnection({
        type: 'capacitor',
        database: 'projectdb',
        driver: sqlite,
        entities: [Project],
        synchronize: true,
      });
      this.ds = new DataSource({
        type: 'capacitor',
        database: '/assets/sqlite3/sqlite3.db', // Use the determined path
        driver: sqlite,
        entities: [Project],
        synchronize: true, // Auto-create tables (use only in development)
        logging: true, // Enable to debug SQL queries
      });
      await this.ds.initialize();
      this.repo = connection.getRepository(Project);
      this.dbInitialized = true;
      console.log('Database initialized', this.repo);
    } catch (error) {
      console.error('Database initialization failed:', error);
      // this.dbInitialized = false;
      // return false;
    }
  }

  async getProjects() { // fetch all projects
   await this.initDB(); // Ensure DB is initialized
    if (!this.repo) throw new Error('Repository not initialized');
    return this.repo.find();
  }

  public getRepository(): Repository<Project> {
    if (!this.repo) {
      throw new Error('Repository not initialized');
    }
    return this.repo;
  }


  public getDataSource(): DataSource {
    if (!this.ds) throw new Error('DataSource not initialized');
    return this.ds!;
  }
}
