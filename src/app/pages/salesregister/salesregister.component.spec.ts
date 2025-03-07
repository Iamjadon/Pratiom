import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesregisterComponent } from './salesregister.component';

describe('SalesregisterComponent', () => {
  let component: SalesregisterComponent;
  let fixture: ComponentFixture<SalesregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
