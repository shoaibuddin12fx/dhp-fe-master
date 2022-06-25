/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatCountService } from './chat-count.service';

describe('Service: ChatCount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatCountService]
    });
  });

  it('should ...', inject([ChatCountService], (service: ChatCountService) => {
    expect(service).toBeTruthy();
  }));
});
