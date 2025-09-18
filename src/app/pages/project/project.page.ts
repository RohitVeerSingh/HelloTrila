import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Database } from 'src/app/core/db/database';
import { Project } from 'src/app/core/entities/project.entity';
import { ProjectService } from 'src/app/core/project/project-service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: false,
})
export class ProjectPage implements OnInit {
 project: Project | null = null;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private db: Database,
    public router: Router,
    public viewCtrl: ModalController
  ) { }

  async ngOnInit() {
    console.log('ProjectPage ngOnInit');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('checkid', id);
    if (id) {
      // fetch from SQLite
      //  const projects = await this.db.getProjects();
      const projects = this.db.getRepository(); //await this.db.getProjects();
      const repo  = await projects.find();
      this.project = repo.find((p: any) => p.id === id) || null;
      console.log('checkproject', projects);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
    return this.viewCtrl.dismiss(null, 'cancel')
  }

}
