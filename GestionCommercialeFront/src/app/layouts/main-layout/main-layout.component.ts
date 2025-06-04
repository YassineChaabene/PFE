import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'], // ✅ fix typo: styleUrl → styleUrls
  animations: [
    trigger('fadePage', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MainLayoutComponent implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.isActivated && outlet.activatedRoute;
  }

  ngAfterViewInit(): void {
    // 🔄 Fix "ExpressionChangedAfterItHasBeenCheckedError"
    this.cdr.detectChanges();
  }
}
