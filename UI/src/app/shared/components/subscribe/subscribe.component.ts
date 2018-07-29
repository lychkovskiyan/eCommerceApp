import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  constructor(private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  public OnSubmit(email: string) {
    // tslint:disable-next-line:max-line-length
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const validEmail = regexp.test(email);
    if (validEmail) {
      this.toastr.success('User subscribe successful');
    } else {
      this.toastr.error('Email is not valid.');
    }
  }

}
