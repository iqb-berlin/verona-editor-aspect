import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { IDError } from 'common/errors';
import { MessageService } from 'editor/src/app/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  constructor(private messageService: MessageService, private _zone: NgZone) { }

  handleError(error: Error): void {
    if (error instanceof IDError) {
      this._zone.run(() => {
        this.messageService.showError(error.message);
      });
    } else {
      this.messageService.showErrorPrompt(error);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}
