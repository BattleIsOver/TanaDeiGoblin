import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { SectionService } from './_services/section.service';
import { Section } from './_models/Section';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'Tana dei Goblin';
  isMediumMonitor = true;
  sections: Section[];
  error; string;

  get isLogged(): boolean {
    if (this.auth.currentTokenValue) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.auth.logout();
  }

  constructor(private s: SectionService, breakpointObserver: BreakpointObserver, private auth: AuthenticationService,
              private snackBar: MatSnackBar) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMediumMonitor = false;
      } else {
        this.isMediumMonitor = true;
      }
    });
    this.snackBar.open('\
Questo sito utilizza cookie e/o local storage tecnici propri per le sue funzionalità \
Chiudendo questo banner, scorrendo questa pagina o cliccando qualunque suo elemento acconsenti all\'uso dei cookie e/o local storage.\
    ', 'Chiudi');

    this.auth.getBehaviourSubject()
    .subscribe(val => {
      if (val !== undefined && val != null && val !== '') {
        s.retrieveSectionList()
        .then(value => {
          this.sections = value instanceof Array ? value : undefined;
        }).catch(err => {
          this.error = err;
        });
      } else {
        this.sections = undefined;
      }
    });
  }

  ngOnDestroy(): void {
  }
}
