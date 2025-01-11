import {Component} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  public header: string = 'Підтвердіть операцію';
  public content: string = '';
  public yesButtonName: string = 'Так';
  public noButtonName: string = 'Ні';

  constructor(private readonly dialogRef: NbDialogRef<ConfirmationComponent>) {
  }

  public onClose(isConfirmed: boolean): void {
    this.dialogRef.close(isConfirmed)
  }
}
