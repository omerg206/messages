import { DeleteMessageResponse, GetMessagePropDefinitionResponse } from './../../../../shared/messages.model';
import { ServerMessageCommunicationService } from './services/server-message-communication.service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map, takeUntil } from 'rxjs/operators';
import { GetMessageParams, GetPagedMessageResponse, Message, MessageSortDirection, SingleMessagePropDefinition } from '../../../../shared/messages.model';
import { reduce } from 'lodash';
import { MessageForm, TypeToMessageForm, SupportedMessagePropTypes } from './model/message-forms';
import { MessageFormDefinitionService } from 'src/app/messages-table/services/message-form-definition.service';
import { ContextMenuParams } from 'src/app/conext-menu/context-menu.component';


@Component({
  selector: 'app-messages-table',
  templateUrl: './messages-table.component.html',
  styleUrls: ['./messages-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesTableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: Array<keyof Message> = ['sender', 'creationDate', 'body', 'status',];
  totalMessagesInServer = 0;
  isLoadingResults = true;
  dataSource: MatTableDataSource<Message> = new MatTableDataSource([] as Message[]);
  messagePropDefinitions!: Record<string, MessageForm>;
  contextMenuParams: ContextMenuParams<Message> | undefined;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;


  constructor(private serverMessageCommunicationService: ServerMessageCommunicationService,
    private cd: ChangeDetectorRef, private messageFormDefinitionService: MessageFormDefinitionService) { }


  ngOnInit(): void {
  }


  getMessagesFromServer(messageParams: Partial<GetMessageParams>) {
    this.isLoadingResults = true;

    this.serverMessageCommunicationService.getMessagesFromServer(messageParams)
      .pipe(first()).subscribe(
        (data: GetPagedMessageResponse) => {
          this.isLoadingResults = false;
          if (this.paginator.pageIndex === 0) {
            this.totalMessagesInServer = data.totalCount

          }
          this.dataSource.data = data.messages;
          this.cd.detectChanges();
        });

  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.sort.active = 'sernder';
    // this.sort.direction = 'asc'
    this.getMessagePropDefinitionsFromServer();

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(300),
        map(($event: any) => $event.srcElement.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.paginator.pageIndex = 0;
        this.getMessagesFromServer({
          filter: value, pageNumber: this.paginator.pageIndex, pageSize: this.paginator.pageSize,
          sortColumn: this.sort.active as keyof Message, direction: this.sort.direction as unknown as MessageSortDirection
        });
      });

    this.getMessagesFromServer({});
  }

  onPageChange($event: PageEvent) {
    const searchBeforeOrAfter = this.getSearchBeforeOrAfterParam($event);

    this.getMessagesFromServer({
      pageNumber: $event.pageIndex, pageSize: $event.pageSize, filter: this.filter.nativeElement.value, ...searchBeforeOrAfter,
      sortColumn: this.sort.active as keyof Message, direction: this.sort.direction as unknown as MessageSortDirection
    })
  }

  onSortChange($event: Sort) {
    this.paginator.pageIndex = 0;
    this.getMessagesFromServer({
      sortColumn: $event.active as keyof Message, direction: $event.direction as unknown as MessageSortDirection, filter: this.filter.nativeElement.value,
      pageNumber: 0, pageSize: this.paginator.pageSize
    });
  }

  onCellEdit(newValue: Partial<Message> & Pick<Message, '_id'>) {
    this.serverMessageCommunicationService.updateSingleMessagePropInServer(newValue).pipe(first()).subscribe(
      (updatedMessage: Message) => {
        const index = this.dataSource.data.findIndex((msg: Message) => msg._id === updatedMessage._id);

        if (index === -1) {
          console.error(`updated message doc  does not match any existing doc ${updatedMessage}`)
        } else {
          let data: null | Message[] = [...this.dataSource.data];
          data[index] = updatedMessage;
          this.dataSource.data = [];
          this.dataSource.data = data;
          data = null;
        }
      }, (error: any) => {
        console.log(error)
      });
  }

  onContextMenuClick(event: MouseEvent, item: Message) {
    this.contextMenuParams = { event, item };
  }


  onDeleteRow($event: MouseEvent) {
    this.serverMessageCommunicationService.deleteMessage(this.contextMenuParams!.item).pipe(first()).subscribe(
      ({ deletedId }: DeleteMessageResponse) => {
        const index = this.dataSource.data.findIndex((msg: Message) => msg._id === deletedId);

        if (index === -1) {
          console.error(`updated message doc  does not match any existing doc ${deletedId}`)
        } else {
          let data: null | Message[] = [...this.dataSource.data];
          data.splice(index, 1);
          this.dataSource.data = [];
          this.dataSource.data = data;
          data = null;
        }
      }, (error: any) => {
        console.log(error)
      });
  }


  trackMessage(index: number, item: Message): string {
    return (item as Message & { _id: string })._id
  }

  private getSearchBeforeOrAfterParam($event: PageEvent): Pick<GetMessageParams, 'searchAfter' | 'searchBeforeOrAfterId'> | Pick<GetMessageParams, 'searchBefore' | 'searchBeforeOrAfterId'> {
    const isNextPage = $event.previousPageIndex! < $event.pageIndex;
    const beforeOrAfter = isNextPage ? 'searchAfter' : 'searchBefore';
    const itemIndex = isNextPage ? this.dataSource.data.length - 1 : 0;

    return {
      [beforeOrAfter]: this.dataSource.data[itemIndex][this.sort.active as keyof Message],
      searchBeforeOrAfterId: this.dataSource.data[itemIndex]._id
    }
  }

  private getMessagePropDefinitionsFromServer() {
    this.serverMessageCommunicationService.getMessagesProp().pipe(takeUntil(this.destroy$))
      .subscribe((definitions: GetMessagePropDefinitionResponse) => {
        this.messagePropDefinitions = this.messageFormDefinitionService.createFormDefinitionsForMessageProps(definitions);
      })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }
}

/** An example database that the data source uses to retrieve data for the table. */


