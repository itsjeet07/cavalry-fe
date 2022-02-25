import { DynamicTableViewComponent } from './dynamic-table-view/dynamic-table-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { TreeGridComponent } from './tree-grid/tree-grid.component';
import { ListTableComponent } from './list-table/list-table.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { AddEditTableComponent } from './add-edit-table/add-edit-table.component';
import { ClientTableComponent } from './client-table/client-table.component';
import { UserTableComponent } from './user-table/user-table.component';
import { DynamicTreeTableComponent } from './dynamic-tree-table/dynamic-tree-table.component';
import { PendingUsersTableComponent } from './pending-users-table/pending-users-table.component';
import { TableConfigComponent } from './table-config/table-config.component';
import { EmailComponent } from './email/email.component';
import { TaskComponent } from './list-task/task.component';
import { NotificationsComponent } from './notifications/notifications.component'
import { ViewHandlerComponent } from './view-handler/view-handler.component';


const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    {
      path: 'smart-table',
      component: SmartTableComponent,
    },
    {
      path: 'list',
      component: ListTableComponent,
    },
    {
      path: 'add',
      component: AddEditTableComponent,
    },
    {
      path: 'edit/:id',
      component: AddEditTableComponent,
    },
    {
      path: 'view/:id',
      component: ViewTableComponent,
    },
    {
      path: 'tableConfig/:tableId',
      component: TableConfigComponent,
    },
    {
      path: 'tableConfig/:tableId/:selectedMenu',
      component: TableConfigComponent,
    },
    {
      path: 'tree-grid',
      component: TreeGridComponent,
    },
    {
      path: 'pending-users',
      component: PendingUsersTableComponent,
    },
    {
      path: 'custom-clients',
      component: ClientTableComponent,
    },
    {
      path: 'email',
      component: EmailComponent,
    },
    // {
    //   path: 'Tasks',
    //   component: TaskComponent,
    // },
    {
      path: 'notifications',
      component: NotificationsComponent,
    },
    // {
    //   path: 'clients',
    //   component: ClientTableComponent,
    // },
    // {
    //   path: 'users',
    //   component: UserTableComponent,
    // },
    // {
    //   path: 'dynamic/:tableId/Tasks/:id/taskType/:taskType',
    //   component: TaskComponent,
    // },
    // {
    //   path: 'dynamic/:tableId/Tasks/:id/Chats',
    //   component: TaskComponent,
    // },
    // {
    //   path: 'dynamic/:tableId/Tasks/:id',
    //   component: TaskComponent,
    // },
    {
      path: 'dynamic/:tableId/:tableName/:id',
      component: ViewHandlerComponent,
    },
    {
      path: 'dynamic/:tableId/:tableName/:id/:tabTitle',
      component: ViewHandlerComponent,
    },
    {
      path: 'dynamic/:tableId/:tableName/:id/:tabTitle/:childResourceId/taskType/:taskType',
      component: ViewHandlerComponent,
    },
    {
      path: '**',
      component: DynamicTreeTableComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  SmartTableComponent,
  TreeGridComponent,
  ListTableComponent,
  ViewTableComponent,
  AddEditTableComponent,
  ClientTableComponent,
  UserTableComponent,
  PendingUsersTableComponent,
];
