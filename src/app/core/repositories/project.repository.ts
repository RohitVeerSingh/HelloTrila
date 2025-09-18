import { Injectable } from '@angular/core';
import { Repository } from 'typeorm/browser';
import { Database } from '../db/database';
import { Project } from '../entities/project.entity';


@Injectable({ providedIn: 'root' })
export class ProjectRepository {
    private repo!: Repository<Project>;

    constructor(private db: Database) { }

    async init() {
        await this.db.initDB();
        this.repo = this.db.getDataSource().getRepository(Project);
    }


    async findAll(): Promise<Project[]> {
        if (!this.repo) await this.init();
        return this.repo.find();
    }


    async findById(id: number): Promise<Project | null> {
        if (!this.repo) await this.init();
        return this.repo.findOneBy({ id });
    }


    async create(project: Partial<Project>): Promise<Project> {
        if (!this.repo) await this.init();
        const p = this.repo.create({ ...project, createdAt: new Date().toISOString() });
        return this.repo.save(p);
    }


    async update(id: number, patch: Partial<Project>): Promise<Project> {
        if (!this.repo) await this.init();
        const existing = await this.repo.findOneBy({ id });
        if (!existing) throw new Error('Not found');
        Object.assign(existing, patch);
        return this.repo.save(existing);
    }


    async delete(id: number): Promise<void> {
        if (!this.repo) await this.init();
        const ex = await this.repo.findOneBy({ id });
        if (!ex) return;
        await this.repo.remove(ex);
    }
}