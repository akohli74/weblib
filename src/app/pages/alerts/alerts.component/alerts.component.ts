// app/pages/checkout/checkout.component.ts
// app/pages/alerts/alerts.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AlertCategory = 'Overdue' | 'Lost' | 'Damage' | 'Hold' | 'Member' | 'System';
type AlertSeverity = 'High' | 'Medium' | 'Low';
type AlertStatus = 'Open' | 'Resolved';

interface Alert {
  id: number;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  relatedType: 'Book' | 'Customer' | 'System';
  relatedName: string;
  createdAt: Date;
}

@Component({
  standalone: true,
  selector: 'app-alerts-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  searchTerm = '';
  categoryFilter: AlertCategory | 'All' = 'All';
  severityFilter: AlertSeverity | 'All' = 'All';
  statusFilter: AlertStatus | 'All' = 'Open';

  alerts: Alert[] = [
    {
      id: 1,
      title: 'Book overdue by 7 days',
      description: 'The Catcher in the Rye is 7 days overdue.',
      category: 'Overdue',
      severity: 'High',
      status: 'Open',
      relatedType: 'Book',
      relatedName: 'The Catcher in the Rye (Jenny Rodgers)',
      createdAt: new Date('2024-05-08T10:15:00'),
    },
    {
      id: 2,
      title: 'Lost book reported',
      description: 'Brave New World reported lost by Brian Foster.',
      category: 'Lost',
      severity: 'Medium',
      status: 'Open',
      relatedType: 'Book',
      relatedName: 'Brave New World (Brian Foster)',
      createdAt: new Date('2024-05-06T14:30:00'),
    },
    {
      id: 3,
      title: 'Damaged copy returned',
      description: 'Spilled coffee on cover. Evaluate for replacement.',
      category: 'Damage',
      severity: 'Medium',
      status: 'Open',
      relatedType: 'Book',
      relatedName: 'Sapiens (Christina James)',
      createdAt: new Date('2024-05-05T09:00:00'),
    },
    {
      id: 4,
      title: 'Hold ready for pickup',
      description: 'Customer has 2 days left to pick up hold.',
      category: 'Hold',
      severity: 'Low',
      status: 'Open',
      relatedType: 'Customer',
      relatedName: 'Emma Myers',
      createdAt: new Date('2024-05-09T16:45:00'),
    },
    {
      id: 5,
      title: 'Membership expiring soon',
      description: 'Customer membership expires in 3 days.',
      category: 'Member',
      severity: 'Low',
      status: 'Resolved',
      relatedType: 'Customer',
      relatedName: 'Jaden Becker',
      createdAt: new Date('2024-05-01T11:20:00'),
    },
    {
      id: 6,
      title: 'Nightly backup failed',
      description: 'Last backup did not complete successfully.',
      category: 'System',
      severity: 'High',
      status: 'Open',
      relatedType: 'System',
      relatedName: 'WebLib Server',
      createdAt: new Date('2024-05-09T02:05:00'),
    },
  ];

  get openCount(): number {
    return this.alerts.filter(a => a.status === 'Open').length;
  }

  get filteredAlerts(): Alert[] {
    return this.alerts.filter(alert => {
      const matchesSearch =
        !this.searchTerm ||
        alert.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alert.relatedName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.categoryFilter === 'All' || alert.category === this.categoryFilter;

      const matchesSeverity =
        this.severityFilter === 'All' || alert.severity === this.severityFilter;

      const matchesStatus =
        this.statusFilter === 'All' || alert.status === this.statusFilter;

      return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.categoryFilter = 'All';
    this.severityFilter = 'All';
    this.statusFilter = 'Open';
  }

  markResolved(alert: Alert) {
    alert.status = 'Resolved';
  }
}
