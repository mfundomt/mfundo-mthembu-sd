import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandTerminal } from './command-terminal';

describe('CommandTerminal', () => {
  let component: CommandTerminal;
  let fixture: ComponentFixture<CommandTerminal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandTerminal],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandTerminal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
