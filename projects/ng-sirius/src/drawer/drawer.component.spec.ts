import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SirDrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  let component: SirDrawerComponent;
  let fixture: ComponentFixture<SirDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SirDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SirDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
