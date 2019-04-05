import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MediaProvider } from '../providers/media/media';
import { HttpClientModule} from "@angular/common/http";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { SettingsPage } from "../pages/settings/settings";
import { StatisticsPage } from "../pages/statistics/statistics";
import { HistoryPage } from "../pages/history/history";
import { WheelSelector } from "@ionic-native/wheel-selector"
//const config: SocketIoConfig = {url:"http://192.168.8.101/node:2222", options:{path:'/node/socket.io/websocket'}};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    StatisticsPage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
   // SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    StatisticsPage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MediaProvider,
    WheelSelector
  ]
})
export class AppModule {}
