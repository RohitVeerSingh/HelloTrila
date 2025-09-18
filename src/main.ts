import 'reflect-metadata';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as localforage from 'localforage';
import { defineCustomElements } from 'jeep-sqlite/loader';

platformBrowserDynamic().bootstrapModule(AppModule, )
  .catch(err => console.log(err));
(window as any).localforage = localforage; 
defineCustomElements(window);