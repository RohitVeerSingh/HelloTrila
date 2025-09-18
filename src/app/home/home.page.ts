import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, ToastController, NavController } from '@ionic/angular'
import { Project } from '../core/entities/project.entity';
import { environment } from 'src/environments/environment.prod';
import { ProjectService } from '../core/project/project-service';
import { ProjectPage } from '../pages/project/project.page';
import { Database } from '../core/db/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  projects: Project[] = [];
  environmentName = environment.name;
  constructor(public router: Router, public navCtrl: NavController,
    private projectService: ProjectService,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private db: Database
  ) { }

  async ngOnInit() {
    await this.db.initDB();
    await this.loadProjects();
  }

  async loadProjects() {
    // this.projects = await this.projectService.getAll();
    try {
       const repo = this.db.getRepository(); // get the Repository<Project>
    this.projects = await repo.find();
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }


  async addProject() {
    const alert = await this.alertCtrl.create({
      header: 'Add Project',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Project Name' },
        { name: 'description', type: 'text', placeholder: 'Description' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: async (data) => {
            console.log('checkdata', data);
            try {
              await this.projectService.create(data.name, data.description);
              await this.loadProjects();
            } catch (err) {
              console.error('Error creating project:', err);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editProject(project: Project) {
    const editAlert = await this.alertCtrl.create({
      header: 'Edit Project',
      inputs: [
        { name: 'name', type: 'text', value: project.title },
        { name: 'description', type: 'text', value: project.description },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            await this.projectService.update(project.id, data.name, data.description);
            await this.loadProjects();
          },
        },
      ],
    });
    await editAlert.present();
  }

  async deleteProject(projectid: any) {
    await this.projectService.delete(projectid);
    await this.loadProjects();
  }

  openProject(project: Project) {
    this.navCtrl.navigateForward(['/project', project.id]);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  viewDetails(id: number) {
    this.router.navigate(['/project', id]);
  }

  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: ProjectPage,
      componentProps: { mode: 'add' },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.refresh) this.loadProjects();
  }

  rout() {
    this.router.navigate(['/login']);
    console.log("button clicked");
  }

}
