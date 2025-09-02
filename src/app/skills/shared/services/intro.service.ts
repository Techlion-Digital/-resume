// intro.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IntroService {
  private key = 'intro-seen-v1';
  hasSeen()  { return localStorage.getItem(this.key) === '1'; }
  markSeen() { localStorage.setItem(this.key, '1'); }
  reset()    { localStorage.removeItem(this.key); } // dev helper
}
