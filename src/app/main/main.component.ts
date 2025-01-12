import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NbIconLibraries, NbMenuItem, NbMenuService} from "@nebular/theme";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  items = [
    { title: 'Profile', link: '/profile' },
    { title: 'Logout', link: '/auth/logout'}
  ];

  menuItems : NbMenuItem[]= [
    {
      title: 'Керування користувачами',
      link: '/main/users'
    },
    {
      title: 'Чат',
      link: '/main/chats'
    }
  ];

  username:string = '';
  showUserName: boolean = false;


  constructor(private nbMenuService: NbMenuService,
              private nbIconLib: NbIconLibraries,
              private authService: AuthService,
              private router: Router) {
    this.nbIconLib.registerSvgPack("custom",
      {"myIcon": "<img src='./assets/icons/search-svgrepo-com.svg' width='25px'/>"}
    )
  }

  ngOnInit(): void {
    this.filterMenuItems();
    this.initUserName();

    this.nbMenuService.onItemClick().subscribe(({ item }) => this.router.navigate([item.link]));
  }

  private initUserName() {
    let user = this.authService.getCurrentUser();
    this.showUserName = user;

   if(user) {
     if (user?.firstName && user.lastName) {
       this.username = user.firstName + ' ' + user.lastName;
     } else if (user.firstName) {
       this.username = user.firstName;
     } else if (user.lastName) {
       this.username = user.lastName;
     } else {
       this.username = 'Користувач'
     }
   }
  }

  private filterMenuItems() {
    if (!this.authService.isAdmin()) {
      this.menuItems = this.menuItems.filter(item => item.title !== 'Адмін панель');
    }
  }

  protected redirectToRegistration(): void {
    this.router.navigate(['/auth/login']);
  }
}
