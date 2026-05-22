import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandIntroduction } from './command-introduction';

describe('CommandIntroduction', () => {
  let component: CommandIntroduction;
  let fixture: ComponentFixture<CommandIntroduction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandIntroduction],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandIntroduction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
