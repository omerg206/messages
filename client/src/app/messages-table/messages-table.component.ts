import { ServerMessageCommunicationService } from './services/server-message-communication.service';
import { TitleCasePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
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

import { GetMessageParams, GetPagedMessageResponse, Message, MessageSortDirection } from '../../../../shared/messages.model';
import { AppRoutes } from '../../../../shared/routes.model';




@Component({
  selector: 'app-messages-table',
  templateUrl: './messages-table.component.html',
  styleUrls: ['./messages-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesTableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: Array<keyof Message> = ['sender', 'creationDate', 'body', 'status',];
  data: Message[] = [];
  totalMessagesInServer = 0;
  isLoadingResults = true;
  destroy$: Subject<void> = new Subject<void>();
  dataSource: MatTableDataSource<Message> = new MatTableDataSource(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;


  constructor(private _httpClient: HttpClient, private serverMessageCommunicationService: ServerMessageCommunicationService,
    private cd: ChangeDetectorRef) { }


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

  getSearchBeforeOrAfterParam($event: PageEvent): Pick<GetMessageParams, 'searchAfter' | 'searchBeforeOrAfterId'> | Pick<GetMessageParams, 'searchBefore' | 'searchBeforeOrAfterId'> {
    const isNextPage = $event.previousPageIndex! < $event.pageIndex;
    const beforeOrAfter = isNextPage ? 'searchAfter' : 'searchBefore';
    const itemIndex = isNextPage ? this.dataSource.data.length - 1 : 0;


    return {
      [beforeOrAfter]: this.dataSource.data[itemIndex][this.sort.active as keyof Message],
      searchBeforeOrAfterId: this.dataSource.data[itemIndex]._id
    }
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

  trackMessage(index: number, item: Message): string {
    return (item as Message & { _id: string })._id
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }
}

/** An example database that the data source uses to retrieve data for the table. */


