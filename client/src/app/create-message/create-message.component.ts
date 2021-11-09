import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { take, first } from 'rxjs/operators';
import { AppRoutes } from '../../../../shared/routes.model';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit {
  isSendingMessage: boolean = false;
  isSendSuccessful: boolean = false;
  isSendError: boolean = false;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  messageForm = this.fb.group({
    sender: ['', Validators.required],
  });


  constructor(private fb: FormBuilder, private _ngZone: NgZone, private http: HttpClient) { }

  ngOnInit() {
    this.messageForm.errors
  }

  async submit(messageBody: string) {
    try {
      this.isSendingMessage = true;
      this.isSendSuccessful = false;
      this.isSendError = false;

      await this.http.post(`http://localhost:8080${AppRoutes.endPoint}${AppRoutes.saveMessage}`,
        { body: messageBody || "", sender: this.messageForm.get('sender')?.value })
        .pipe(first()).toPromise();
      this.isSendingMessage = false;
      this.isSendSuccessful = true;
    } catch (e) {
      console.error('error saving message', e);
      this.isSendingMessage = false;
      this.isSendError = true;
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

}
