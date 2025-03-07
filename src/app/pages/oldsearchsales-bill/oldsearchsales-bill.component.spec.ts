import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldsearchsalesBillComponent } from './oldsearchsales-bill.component';

describe('OldsearchsalesBillComponent', () => {
  let component: OldsearchsalesBillComponent;
  let fixture: ComponentFixture<OldsearchsalesBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldsearchsalesBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldsearchsalesBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
