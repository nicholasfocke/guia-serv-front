import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status" [class.error]="type === 'error'" [class.success]="type === 'success'" *ngIf="message">
      {{ message }}
    </div>
  `,
  styles: [`
    .status {
      border-radius: 8px;
      padding: 0.85rem 1rem;
      background: #eef8f7;
      color: #0d5c54;
      font-weight: 600;
    }

    .status.error {
      background: #fff1f2;
      color: #9f1239;
    }

    .status.success {
      background: #ecfdf5;
      color: #047857;
    }
  `]
})
export class StatusMessageComponent {
  @Input() message = '';
  @Input() type: 'info' | 'error' | 'success' = 'info';
}
