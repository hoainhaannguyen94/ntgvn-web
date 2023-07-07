import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'test',
        loadChildren: () => import('./test/test.routes').then((m) => m.routes)
    },
    {
        path: 'setting',
        loadChildren: () => import('./setting/setting.routes').then((m) => m.routes)
    },
    {
        path: 'about-us',
        loadChildren: () => import('./about-us/about-us.routes').then((m) => m.routes)
    },
    {
        path: 'policy',
        loadChildren: () => import('./policy/policy.routes').then((m) => m.routes)
    },
    {
        path: 'lowtech',
        loadChildren: () => import('./lowtech/lowtech.routes').then((m) => m.routes)
    },
    {
        path: 'tag',
        loadChildren: () => import('./tag/tag.routes').then((m) => m.routes)
    },
    {
        path: 'customer',
        loadChildren: () => import('./customer/customer.routes').then((m) => m.routes)
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then((m) => m.routes)
    },
    {
        path: 'group',
        loadChildren: () => import('./group/group.routes').then((m) => m.routes)
    },
    {
        path: 'order',
        loadChildren: () => import('./order/order.routes').then((m) => m.routes)
    },
    {
        path: 'product',
        loadChildren: () => import('./product/product.routes').then((m) => m.routes)
    },
    {
        path: 'warehouse',
        loadChildren: () => import('./warehouse/warehouse.routes').then((m) => m.routes)
    },
    {
        path: 'event',
        loadChildren: () => import('./event/event.routes').then((m) => m.routes)
    },
    {
        path: 'scheduler',
        loadChildren: () => import('./scheduler/scheduler.routes').then((m) => m.routes)
    },
    {
        path: 'room',
        loadChildren: () => import('./room/room.routes').then((m) => m.routes)
    },
    {
        path: 'device',
        loadChildren: () => import('./device/device.routes').then((m) => m.routes)
    },
    {
        path: 'simulator',
        loadChildren: () => import('./simulator/simulator.routes').then((m) => m.routes)
    },
    {
        path: 'map',
        loadChildren: () => import('./map/map.routes').then((m) => m.routes)
    },
    {
        path: 'analytic',
        loadChildren: () => import('./analytic/analytic.routes').then((m) => m.routes)
    },
    {
        path: 'audit-log',
        loadChildren: () => import('./audit-log/audit-log.routes').then((m) => m.routes)
    },
    {
        path: 'announcement',
        loadChildren: () => import('./announcement/announcement.routes').then((m) => m.routes)
    },
    {
        path: 'shell',
        loadChildren: () => import('./app-shell/app-shell.routes').then((m) => m.routes)
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'shell',
        pathMatch: 'full'
    },
    {
        path: '**',
        loadChildren: () => import('./not-found/not-found.routes').then((m) => m.routes)
    }
];
