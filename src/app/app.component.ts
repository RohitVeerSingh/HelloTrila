import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    const jeepEl = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepEl);
  }

  ngOnInit() {
      console.log('PlatformIs', Capacitor.getPlatform())
      if (Capacitor.getPlatform() === 'web') {
      const jeepEl = document.createElement('jeep-sqlite');
      jeepEl.setAttribute('wasm-path', 'assets/sql-wasm.wasm');
      document.body.appendChild(jeepEl);
      customElements.whenDefined('jeep-sqlite').then(() => {
      console.log('<jeep-sqlite> is ready');
    });
    }
  }
}
