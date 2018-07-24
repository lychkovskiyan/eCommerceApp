import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public signUpForm: FormGroup = null;
  public userData: IUser = null;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService) {
    const pwdValidators: ValidatorFn[] = [Validators.required, Validators.minLength(6), Validators.maxLength(20)];

    this.signUpForm = formBuilder.group({
      userName: ['', [Validators.required, this.userNameValidator()]],
      passwords: formBuilder.group({
        password: ['', pwdValidators],
        passwordConfirm: ['', pwdValidators]
      }, {validator: this.passwordsAreEqual()}),
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      firstName: ['', Validators.required],
      lastName: ['']
    });
  }

  ngOnInit() {
    this.signUpForm.statusChanges.subscribe((status) => {
      if (status === 'INVALID' && !!this.userData) {
        this.userData = null;
      }
    });
  }

  private userNameValidator(): ValidatorFn {
    const pattern: RegExp = /^[\w\.\$@\*\!]{5,30}$/;
    return (control: AbstractControl): { [key: string]: any } => {
      if (!(control.dirty || control.touched)) {
        return null;
      } else {
        return pattern.test(control.value) ? null : {custom: `Min length:5, can't contain whitespaces & special symbols.`};
      }
    };
  }

  private passwordsAreEqual(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (!(group.dirty || group.touched) || group.get('password').value === group.get('passwordConfirm').value) {
        return null;
      }
      return {
        custom: 'Passwords are not equal'
      };
    };
  }

  private phoneValidator(): ValidatorFn {
    const pattern: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return (control: AbstractControl): { [key: string]: any } => {
      if (!(control.dirty || control.touched)) {
        return null;
      } else {
        return pattern.test(control.value) ? null : {custom: `Invalid phone number`};
      }
    };
  }


  public submitForm(e: Event) {
    e.preventDefault();

    if (this.signUpForm.invalid) {
      this.markFormGroupTouched(this.signUpForm);
      return false;
    }

    this.userData = this.signUpForm.value;
    this.userService.registerUser(this.userData)
      .subscribe((data: any) => {
        if (data.Succeeded === true) {
          /* this.resetForm(form); */
          this.toastr.success('User registration successful');
        } else {
          this.toastr.error(data.Errors[0]);
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

}
