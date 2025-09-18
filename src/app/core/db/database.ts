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

  addProject(project: Partial<Project>) { // add new projects
    const newProject = this.repo.create({ ...project, createdAt: new Date() });
    return this.repo.save(newProject);
  }

  updateProject(project: Project) {
    return this.repo.save(project); // update projects
  }

  deleteProject(id: number) {
    return this.repo.delete(id);// delete projects by id
  }


  // public async initialize(): Promise<DataSource> {

  //   const sqlite = new SQLiteConnection(CapacitorSQLite);
  //   if (Capacitor.getPlatform() === 'web') {
  //     await sqlite.initWebStore();
  //     // this.sqlite.initWebStore();
  //   }
  //   if (this.initialized && this.ds) {
  //     return this.ds;
  //   }
  //   const dbFile = await this.loadDatabaseFile();
  //   this.ds = new DataSource({
  //     type: 'sqljs',
  //     location: 'browser',
  //     driver: sqlite,
  //     autoSave: true,
  //     useLocalForage: true,
  //     sqlJsConfig: {
  //       locateFile: (file: string) => `/assets/sqlite3/sqlite3.db`,
  //     },
  //     entities: [Project],
  //     synchronize: true,
  //     database: dbFile,
  //   });

  //   console.log('Initializing DataSource...', this.ds);
  //   await this.ds.initialize();
  //   this.initialized = true;
  //   return this.ds;
  // }

  async loadDatabaseFile(): Promise<Uint8Array> {
    const response = await fetch('/assets/sqlite3/sqlite3.db');
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }


  public getDataSource(): DataSource {
    if (!this.ds) throw new Error('DataSource not initialized');
    return this.ds!;
  }
}
