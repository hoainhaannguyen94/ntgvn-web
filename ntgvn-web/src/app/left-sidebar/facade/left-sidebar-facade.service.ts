import { Injectable } from '@angular/core';
import { INavLink } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class LeftSidebarFacadeService {
    getNavLinks(): INavLink[] {
        return [
            {
                displayName: 'Announcements',
                url: '/announcement',
                icon: 'campaign',
                activated: false
            },
            {
                displayName: 'Map',
                url: '/map',
                icon: 'map',
                activated: false
            },
            {
                displayName: 'Simulator',
                url: '/simulator',
                icon: 'gps_fixed',
                activated: false
            },
            {
                displayName: 'Devices',
                url: '/device',
                icon: 'smartphone',
                activated: false
            },
            {
                displayName: 'Scheduler',
                url: '/scheduler',
                icon: 'pending_actions',
                activated: true
            },
            {
                displayName: 'Events',
                url: '/event',
                icon: 'event',
                activated: true
            },
            {
                displayName: 'Warehouses',
                url: '/warehouse',
                icon: 'store',
                activated: false
            },
            {
                displayName: 'Products',
                url: '/product',
                icon: 'category',
                activated: false
            },
            {
                displayName: 'Orders',
                url: '/order',
                icon: 'receipt',
                activated: false
            },
            {
                displayName: 'Rooms',
                url: '/room',
                icon: 'home',
                activated: true
            },
            {
                displayName: 'Users',
                url: '/user',
                icon: 'account_circle',
                activated: true
            },
            {
                displayName: 'Groups',
                url: '/group',
                icon: 'group',
                activated: true
            },
            {
                displayName: 'Customers',
                url: '/customer',
                icon: 'groups',
                activated: false
            },
            {
                displayName: 'Tags',
                url: '/tag',
                icon: 'label',
                activated: true
            },
            {
                displayName: 'Audit Logs',
                url: '/audit-log',
                icon: 'verified_user',
                activated: true
            },
            {
                displayName: 'Analytics',
                url: '/analytic',
                icon: 'analytics',
                activated: false
            },
            {
                displayName: 'Policy',
                url: '/policy',
                icon: 'policy',
                activated: false
            },
            {
                displayName: 'About Us',
                url: '/about-us',
                icon: 'info',
                activated: false
            },
            {
                displayName: 'Settings',
                url: '/setting',
                icon: 'settings',
                activated: true
            }
        ];
    }
}
