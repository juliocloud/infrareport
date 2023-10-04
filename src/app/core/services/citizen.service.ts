import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, lastValueFrom, of } from 'rxjs';
import { Citizen } from 'src/app/shared/models/citizen.model';
import { first, switchMap } from 'rxjs/operators';
import {
  User,
  Auth,
  authState,
  AuthModule,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  citizen$: Observable<any>;
  user$: Observable<User>;
  firebaseCitizen;
  citizenId: string;
  citizen: Citizen;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.citizen$ = authState(this.auth as any).pipe(
      switchMap((citizen) => {
        if (citizen) {
          this.firebaseCitizen = citizen;
          this.citizenId = citizen.uid;

          const doca = doc(
            this.firestore,
            `citizens/${citizen.uid}`
          ) as DocumentReference<Citizen>;
        }
        return of(null);
      })
    );
  }

  /**
   * Creates a new citizen
   * @param citizen {Citizen} Citizen to be created
   * @returns {Promise}
   */
  async createCitizen(citizen: Citizen): Promise<void> {
    createUserWithEmailAndPassword(this.auth, citizen.email, citizen.password)
      .then(async (e) => {
        const createdCitizen = await setDoc(
          doc(this.firestore, `citizens/${e.user.uid}`),
          citizen
        );
        return createdCitizen;
      })
      .catch(async (e) => {
        alert(
          'Não foi possível criar o usuário. Por favor, cheque se todos os campos estão preenchidos corretamente'
        );
      });
  }

  /**
   * Sign citizen in
   * @param email {string} Citizen email
   * @param password {string} Citizen passwrod
   */
  async signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(async (info) => {
        console.log('Signing In');
      })
      .catch(async (err) => {
        console.log(err);
        alert(
          'Login não foi bem-sucedido. Por favor, cheque seu email e senha'
        );
      });
  }
}
