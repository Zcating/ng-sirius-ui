import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDocComponent } from './sku-doc.component';

describe('SkuDocComponent', () => {
  let component: SkuDocComponent;
  let fixture: ComponentFixture<SkuDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
