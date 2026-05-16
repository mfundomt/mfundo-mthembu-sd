import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable } from '@angular/core';
import {CommandModal} from '../components/command-modal/command-modal';
@Injectable({
  providedIn: 'root',
})
export class CommandModalService {
  newModalComponent!: ComponentRef<CommandModal>;

  constructor(private appRef: ApplicationRef,
              private injector: EnvironmentInjector) {
  }

  


}
