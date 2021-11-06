import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './components/main-frame/main-frame.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', component: MainFrameComponent },
  { path: 'mp', component: MediaPlayerComponent },
  { path: 'settings', component: SettingsComponent }
]

/*function(): Routes {
  let routesTemp: Routes = [{ path: '', component: MainFrameComponent }]
  const apps = fs.readdirSync('custum-apps');

  return routesTemp;
};*/

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
