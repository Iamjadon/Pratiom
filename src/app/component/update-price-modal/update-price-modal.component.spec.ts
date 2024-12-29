import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePriceModalComponent } from './update-price-modal.component';

describe('UpdatePriceModalComponent', () => {
  let component: UpdatePriceModalComponent;
  let fixture: ComponentFixture<UpdatePriceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePriceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePriceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
