import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import {MainComponent} from "./main/main.component";
import {UsersComponent} from './main/users/users.component';
import {LogoutComponent} from "./main/logout/logout.component";
import {AuthGuard} from "./guards/auth.guard";
import {ChatComponent} from "./main/chat/chat.component";
import {ChatRoomComponent} from "./main/chat-room/chat-room.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chats',
        component: ChatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chat-room/:id',
        component: ChatRoomComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/main'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
