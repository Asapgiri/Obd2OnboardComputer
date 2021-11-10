import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverwievComponent } from './overwiev.component';

describe('OverwievComponent', () => {
  let component: OverwievComponent;
  let fixture: ComponentFixture<OverwievComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverwievComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverwievComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
