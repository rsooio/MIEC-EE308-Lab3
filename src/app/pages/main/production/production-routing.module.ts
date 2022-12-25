import { ScheduleselectComponent } from './scheduleselect/scheduleselect.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ColorComponent } from './color/color.component';
import { TextureComponent } from './texture/texture.component';
import { TechnologyComponent } from './technology/technology.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleeditorComponent } from './scheduleeditor/scheduleeditor.component';

const routes: Routes = [
  // { path: '', redirectTo: '/main/production/technologies' },
  { path: 'technologies', component: TechnologyComponent, data: { keep: true } },
  { path: 'technologies/:id', component: TextureComponent, data: { keep: true } },
  { path: 'technologies/:id/:texture', component: ColorComponent, data: { keep: true } },
  { path: 'schedule', component: ScheduleComponent, data: { keep: true } },
  { path: 'schedule/:id', component: ScheduleeditorComponent, data: { keep: true } },
  { path: 'schedule/:id/select', component: ScheduleselectComponent, data: { keep: true, singleRoute: 'scheduleselect' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
