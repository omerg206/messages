import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { GetMessagePropDefinitionResponse, GetPagedMessageResponse, Message } from '../../../../../shared/messages.model';
import { MessageSortDirection, GetMessageParams } from '../../../../../shared/messages.model';
import { AppRoutes } from '../../../../../shared/routes.model';
import { Observable } from 'rxjs';

@Injectable()
export class ServerMessageCommunicationService {
  private serverUrl = `http://localhost:8080${AppRoutes.endPoint}`;


  constructor(private _httpClient: HttpClient) { }

  getMessagesProp(): Observable<GetMessagePropDefinitionResponse>{
    const url = `${this.serverUrl}${AppRoutes.getMessagePropDefinitions}`;

    return this._httpClient.get<GetMessagePropDefinitionResponse>(url,
      ).pipe(first())
  }

  getMessagesFromServer(pagedMessagesParams: Partial<GetMessageParams>): Observable<GetPagedMessageResponse> {
    const url = `${this.serverUrl}${AppRoutes.getPagingMessages}`;
    let paramsWithDefaults = { ...this.getDefaultGetPagedMessagesParams(), ...pagedMessagesParams };
    const stringifiedParams = JSON.stringify({ ...paramsWithDefaults });
    const params = new HttpParams().append('directionParams', stringifiedParams);

    return this._httpClient.get<GetPagedMessageResponse>(url, { params }
    ).pipe(first())
  }

  updateSingleMessagePropInServer(newValue: Partial<Message> & Pick<Message, '_id'>): Observable<Message> {
    return this._httpClient.patch<Message>(`${this.serverUrl}${AppRoutes.updateSingleMessageProp}`,
      { ...newValue }
    ).pipe(first())
  }

  private getDefaultGetPagedMessagesParams(): GetMessageParams {
    return {
      pageNumber: 0, pageSize: 3, sortColumn: 'sender', filter: undefined,
      direction: MessageSortDirection[MessageSortDirection.asc] as any,
      searchBefore: undefined,
      searchAfter: undefined,
      searchBeforeOrAfterId: undefined
    }
  }

}
