import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule, NbChatModule,
  NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbIconModule,
  NbInputModule,
  NbLayoutModule, NbListModule,
  NbMenuModule, NbSelectModule,
  NbSidebarModule, NbSpinnerModule, NbTabsetModule, NbTagModule,
  NbThemeModule, NbToastrModule,
  NbUserModule, NbWindowModule
} from '@nebular/theme';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import {MainComponent} from "./main/main.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {SharedModule} from "./shared/shared.module";
import {UsersComponent} from './main/users/users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptorService} from "./interceptors/auth-interceptor.service";
import {LogoutComponent} from "./main/logout/logout.component";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {ConfirmationComponent} from "./shared/confirmation/confirmation.component";
import {ChatComponent} from "./main/chat/chat.component";
import {ChatRoomComponent} from "./main/chat-room/chat-room.component";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UsersComponent,
    MainComponent,
    ConfirmationComponent,
    LogoutComponent,
    ChatComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NbThemeModule.forRoot(),
    NbIconModule,       // Required for icons
    NbEvaIconsModule,   // Registers Eva Icons pack
    NbToastrModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',

          baseEndpoint: environment.backendUrl,
          login: {
            endpoint: '/auth/login',
            method: 'post',
            defaultErrors: ['Поштова скринька або пароль введені невірно.'],
            redirect: {
              success: '/main'
            },
          },
          token: {
            key: 'token'
          },
          register: {
            endpoint: '/api/users',
            method: 'post'
          }
        })
      ]
    }),
    NbSidebarModule.forRoot(),
    NbLayoutModule,
    NbUserModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    NbCardModule,
    NbWindowModule.forRoot(),
    NbDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    NbListModule,
    SharedModule,
    NbTabsetModule,
    NbInputModule,
    FormsModule,
    NbSelectModule,
    NbBadgeModule,
    NbDatepickerModule,
    NbToastrModule.forRoot(),
    ReactiveFormsModule,
    NbSpinnerModule,
    NgOptimizedImage,
    NbTagModule,
    NbChatModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
