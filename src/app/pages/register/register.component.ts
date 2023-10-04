import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CitizenService } from 'src/app/core/services/citizen.service';
import { Citizen } from 'src/app/shared/models/citizen.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
  };
  type;
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
    private auth: AngularFireAuth,
    private fb: UntypedFormBuilder,
    private citizenService: CitizenService
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
    let id;
    if (this.type == 'citizen') {
      id = this.citizenService.createCitizen(this.citizen).then((result) => {
        console.log('Creating user');
      });
    }
    return id;
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

  onTypeChange(event) {
    this.type = event.value;
  }
}