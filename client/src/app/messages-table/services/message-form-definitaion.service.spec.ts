import { TestBed } from '@angular/core/testing';

import { MessageFormDefinitionService } from './message-form-definition.service';

describe('MessageFormDefinitaionService', () => {
  let service: MessageFormDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageFormDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
