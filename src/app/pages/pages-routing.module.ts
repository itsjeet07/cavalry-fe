import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingUsersTableComponent } from './tables/pending-users-table/pending-users-table.component';
import { ClientTableComponent } from './tables/client-table/client-table.component';

const routes: Routes = [
  {
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'custom-clients',
      component: ClientTableComponent,
    },
    // {
    //   path: 'project-locations',
    //   component: ProjectLocationsComponent,
    // },
    // {
    //   path: 'users',
    //   component: UserTableComponent,
    // },
    {
      path: 'pending-users',
      component: PendingUsersTableComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    // {
    //   path: 'forms',
    //   loadChildren: () => import('./forms/forms.module')
    //     .then(m => m.FormsModule),
    // },
    // {
    //   path: 'ui-features',
    //   loadChildren: () => import('./ui-features/ui-features.module')
    //     .then(m => m.UiFeaturesModule),
    // },
    // {
    //   path: 'modal-overlays',
    //   loadChildren: () => import('./modal-overlays/modal-overlays.module')
    //     .then(m => m.ModalOverlaysModule),
    // },
    // {
    //   path: 'extra-components',
    //   loadChildren: () => import('./extra-components/extra-components.module')
    //     .then(m => m.ExtraComponentsModule),
    // },
    // {
    //   path: 'maps',
    //   loadChildren: () => import('./maps/maps.module')
    //     .then(m => m.MapsModule),
    // },
    // {
    //   path: 'charts',
    //   loadChildren: () => import('./charts/charts.module')
    //     .then(m => m.ChartsModule),
    // },
    // {
    //   path: 'editors',
    //   loadChildren: () => import('./editors/editors.module')
    //     .then(m => m.EditorsModule),
    // },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    // {
    //   path: 'miscellaneous',
    //   loadChildren: () => import('./miscellaneous/miscellaneous.module')
    //     .then(m => m.MiscellaneousModule),
    // },
    {
      path: '**',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
  ],

},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
