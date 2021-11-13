import { TestBed } from '@angular/core/testing';

import { ServerMessageCommunicationService } from './server-message-communication.service';

describe('ServerMessageCommunicationService', () => {
  let service: ServerMessageCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerMessageCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
