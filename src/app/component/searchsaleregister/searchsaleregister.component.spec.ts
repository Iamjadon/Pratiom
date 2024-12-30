import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsaleregisterComponent } from './searchsaleregister.component';

describe('SearchsaleregisterComponent', () => {
  let component: SearchsaleregisterComponent;
  let fixture: ComponentFixture<SearchsaleregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchsaleregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchsaleregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
