import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainFrameComponent } from './components/main-frame/main-frame.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { AppsScreenComponent } from './components/apps-screen/apps-screen.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { SettingsComponent } from './components/settings/settings.component';

import { MapService } from './services/map-service';
import { GlobalsService } from './services/globals-service';
import { AudioService } from './services/audio-service';
import { NgAudioVisualizerModule } from 'ng-audio-visualizer';
import { MediaPlayerService } from './services/media-player-service';
import { Obd2Service } from './services/obd2-service';

@NgModule({
  declarations: [
    AppComponent,
    MainFrameComponent,
    MainScreenComponent,
    AppsScreenComponent,
    MediaPlayerComponent,
    SettingsComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule, 
    NgbModule, BrowserAnimationsModule,
    FormsModule,
    NgAudioVisualizerModule,
    NgxElectronModule,
    HttpClientModule
  ],
  providers: [
    MapService,
    GlobalsService,
    AudioService,
    MediaPlayerService,
    Obd2Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
