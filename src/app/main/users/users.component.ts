import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  getModuleFactory,
  OnInit,
  TemplateRef
} from '@angular/core';
import {NbDialogService, NbToastrService} from "@nebular/theme";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {Page} from "../../models/page";
import {SpinnerService} from "../../services/spinner-service";
import {finalize} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class UsersComponent implements OnInit{
  userForm: any = {}
  users: User[] = [];
  originalUsers: User[] = [];
  passwordToggle: boolean = false;

  constructor(
    private dialogService: NbDialogService,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private toastrService: NbToastrService
  ) {

  }

  open(dialog: TemplateRef<any>, user?: any) {
    this.userForm = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      role: user?.role,
      password: user?.password
    }
    this.passwordToggle = user === undefined;
    this.dialogService.open(dialog, {
      closeOnBackdropClick: true
    }).onClose.subscribe(() => {
      this.spinnerService.show();
      if (user?.id) {
        const index = this.users.findIndex((i: any) => i.id == user.id);
        let copiedUser: User = this.users[index];
        let formUser = {...copiedUser, ...this.userForm }

        if ( JSON.stringify(this.users[index]) !== JSON.stringify(formUser) ) {
          //кол до апі і по респонсу вже винуєм наступні рядки.
          this.userService.updateUser$(formUser).pipe(finalize( () => this.spinnerService.hide() )).subscribe({
            next: (user: User) => {
              this.toastrService.success('Користувача успішно змінено', 'Успіх', {
                status: 'success', // Green color
              });
            },
            error: (err: HttpErrorResponse) => {
              this.toastrService.danger(err.error, 'Помилка', {
                status: 'danger', // Red color
              });
            }
          });
          this.users[index] = {
            ...this.users[index],
            ...this.userForm
          }
        }

      } else {
        console.log(this.userForm)
        this.userService.createUser$(this.userForm).subscribe({
          next: () => {
            this.toastrService.success('Користувача успішно створено', 'Успіх', {
              status: 'success', // Green color
            });
            this.users.push({
              id: this.users.length,
              ...this.userForm
            })
          },
          error: (err: HttpErrorResponse) => {
            // this.toastrService.danger(err.error, 'Помилка', {
            //   status: 'danger', // Red color
            // });
          }
        });

      }

      this.originalUsers = [
        ...this.users
      ];

      this.cd.markForCheck();
    });
  }

  search(event: any) {
    const searchValue = event.target.value.trim().toLowerCase();
    if (searchValue) {
      this.users = this.users.filter((user: any) =>
        user.email.toLowerCase().includes(searchValue)
      );
    } else {
      this.users = [...this.originalUsers]
    }
    this.cd.markForCheck();
  }

  ngOnInit(): void {
    this.userService.getUsers$().subscribe((page: Page) => {
      this.users = page.content;
      this.originalUsers = this.users;
      this.cd.markForCheck();
    });
  }

  openDeleteDialog(deleteDialogTemplate: TemplateRef<any>, user?: any) {
    this.dialogService.open(deleteDialogTemplate, {
      context: user
    });
  }

  confirmDelete(user: any, dialogReff: any) {
    this.userService.deleteUser$(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(existingUser => existingUser.id !== user.id)
        this.toastrService.success('Користувача успішно видалено', 'Успіх', {
          status: 'success', // Green color
        });
        dialogReff.close(); // Close the dialog after successful deletion
      },
      error: (err: any) => {
        this.toastrService.danger('Сталася помилка, спробуйте ще раз', 'Помилка', {
          status: 'danger', // Red color
        });
      },
    });
  }

  protected readonly getModuleFactory = getModuleFactory;
}
