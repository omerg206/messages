import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit {
  messageForm = this.fb.group({
    sender: ['', Validators.required],
    sender2: ['', Validators.required],

  });


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
