import { Component } from '@angular/core';

@Component({
  selector: 'app-unit-icon',
  standalone: true,
  template: `
    <span class="unit-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M7 27V8.5A2.5 2.5 0 0 1 9.5 6h9A2.5 2.5 0 0 1 21 8.5V27" />
        <path d="M21 13h2.5A2.5 2.5 0 0 1 26 15.5V27" />
        <path d="M5 27h22" />
        <path d="M11 11h2M16 11h2M11 15h2M16 15h2M11 19h2M16 19h2" />
      </svg>
    </span>
  `,
  styles: [`
    .unit-icon {
      align-items: center;
      background: #e4fffd;
      border-radius: 8px;
      color: var(--teal);
      display: inline-flex;
      height: 36px;
      justify-content: center;
      width: 36px;
    }

    svg {
      height: 24px;
      width: 24px;
    }

    path {
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
    }
  `]
})
export class UnitIconComponent {}
