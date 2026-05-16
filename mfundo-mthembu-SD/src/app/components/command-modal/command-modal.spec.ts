import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandModal } from './command-modal';

describe('CommandModal', () => {
  let component: CommandModal;
  let fixture: ComponentFixture<CommandModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
