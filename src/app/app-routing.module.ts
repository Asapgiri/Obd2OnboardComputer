import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainFrameComponent } from './components/main-frame/main-frame.component';
import { MapComponent } from './components/map/map.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { OverwievComponent } from './components/overwiev/overwiev.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppsLoader } from './services/repo/apps-loader';

const routes: Routes = [
  { path: '', component: MainFrameComponent },
  { path: 'mp', component: MediaPlayerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/:ret', component: SettingsComponent },
  { path: 'map', component: MapComponent },
  { path: 'overwiev', component: OverwievComponent }
]

function getRoutes(): Routes {
  let routesTemp: Routes = routes
  const loader = new AppsLoader()
  const loadedRoutes = loader.getComponents()
  loadedRoutes.forEach(route => routesTemp.push(route))

  console.log(routesTemp)
  return routesTemp;
};

@NgModule({
  imports: [RouterModule.forRoot(getRoutes(), {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
