import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable({ providedIn: 'root' })

export class ProjectStore {
    private projectsSub = new BehaviorSubject<Project[]>([]);
    projects$ = this.projectsSub.asObservable();


    private loading = false;


    constructor(private repo: ProjectRepository) {
        this.load();
    }


    async load() {
        if (this.loading) return;
        this.loading = true;
        try {
            const data = await this.repo.findAll();
            this.projectsSub.next(data);
        } catch (err) {
            console.error('Error loading projects..', err);
        } finally {
            this.loading = false;
        }
    }


    async add(project: Partial<Project>) {
        try {
            const created = await this.repo.create(project);
            const cur = this.projectsSub.value.slice();
            cur.unshift(created);
            this.projectsSub.next(cur);
        } catch (err) {
            console.error('Error creating project', err);
            throw err;
        }
    }


    async update(id: number, patch: Partial<Project>) {
        try {
            const updated = await this.repo.update(id, patch);
            const cur = this.projectsSub.value.map(p => (p.id === id ? updated : p));
            this.projectsSub.next(cur);
        } catch (err) {
            console.error('Error updating project', err);
            throw err;
        }
    }


    async remove(id: number) {
        try {
            await this.repo.delete(id);
            const cur = this.projectsSub.value.filter(p => p.id !== id);
            this.projectsSub.next(cur);
        } catch (err) {
            console.error('Error deleting project', err);
            throw err;
        }
    }
}