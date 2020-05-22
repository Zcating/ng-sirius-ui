import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SirSkuComponent } from './sku.component';

describe('SkuComponent', () => {
  let component: SirSkuComponent;
  let fixture: ComponentFixture<SirSkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SirSkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SirSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
