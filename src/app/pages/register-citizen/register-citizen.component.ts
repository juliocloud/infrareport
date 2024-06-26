import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { Citizen } from 'src/app/shared/models/citizen.model';
import {
  FIREBASE_ERR_KEYS,
  FIREBASE_ERR_MESSAGES,
} from 'src/app/shared/utils/firebase-error.utils';

@Component({
  selector: 'app-register-citizen',
  templateUrl: './register-citizen.component.html',
  styleUrls: ['./register-citizen.component.scss'],
})
export class RegisterCitizenComponent implements OnInit {
  createUserForm: UntypedFormGroup;
  citizen: Citizen = {
    email: '',
    address: {
      addressLine1: '',
      city: '',
      addressLine2: '',
      cityZipCode: '',
      number: 0,
    },
    password: '',
    displayName: '',
    type: 'citizen',
  };
  type: any = 'citizen';
  citizenFormTypes = [
    {
      value: 'citizen',
      displayName: 'Cidadão',
    },
    {
      value: 'town',
      displayName: 'Cidade',
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifier: NotifierService
  ) {}
  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      displayName: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      addressLine1: [''],
      addressLine2: [''],
      cityZipCode: [''],
      city: [''],
      type: [''],
    });
  }

  async saveUser() {
    this.fillForm();
    let user;
    try {
      user = await this.authService.createUser(this.citizen, this.type);
      this.router.navigate(['/login']);
    } catch (err: any) {
      const errorCode = err.code as string;
      const index = FIREBASE_ERR_KEYS.indexOf(errorCode);
      const message =
        index != -1 ? FIREBASE_ERR_MESSAGES[index] : 'Ocorreu um erro';

      this.notifier.notify('Aviso', 'salmon', message);
    }
  }

  fillForm() {
    this.citizen.displayName = this.createUserForm.get('displayName')?.value;
    this.citizen.email = this.createUserForm.get('email')?.value;
    this.citizen.password = this.createUserForm.get('password')?.value;
    this.citizen.address.addressLine1 =
      this.createUserForm.get('addressLine1')?.value;
    this.citizen.address.addressLine2 =
      this.createUserForm.get('addressLine2')?.value;
    this.citizen.address.cityZipCode =
      this.createUserForm.get('cityZipCode')?.value;
    this.citizen.address.city = this.createUserForm.get('city')?.value;
  }

  onTypeChange(event: any) {
    this.type = event.value;
  }

  registerTown() {
    this.router.navigate(['/register-town']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
