
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { AppRoutes } from '../../../../shared/routes.model';
import { Message, GetMessageParams, MessageSortDirection, GetPagedMessageResponse } from '../../../../shared/messages.model';



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


  constructor(private _httpClient: HttpClient, private titleCasePipe: TitleCasePipe,
    private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
  }


  getMessagesFromServer({ pageNumber = 0, pageSize = 3, sortColumn = 'sender', filter, searchBefore, searchAfter, searchBeforeOrAfterId,
    direction = MessageSortDirection[MessageSortDirection.asc] as any }: Partial<GetMessageParams>) {
    const url = `http://localhost:8080${AppRoutes.endPoint}${AppRoutes.getPagingMessages}`;
    const stringifiedParams = JSON.stringify({ pageNumber, pageSize, sortColumn, direction, filter, searchAfter, searchBefore, searchBeforeOrAfterId });
    const params = new HttpParams().append('directionParams', stringifiedParams);
    this.isLoadingResults = true;

    this._httpClient.get<GetPagedMessageResponse>(url, { params }
    ).pipe(first()).subscribe(
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
    const isAscOrder = (this.sort.direction) === MessageSortDirection[MessageSortDirection.asc];
    const beforeOrAfter = ((isAscOrder && isNextPage) || (!isAscOrder && !isNextPage) ? 'searchAfter' : 'searchBefore');
    const itemIndex = isNextPage ? this.dataSource.data.length - 1 : 0;


    return {
      [beforeOrAfter]: this.dataSource.data[itemIndex][this.sort.active as keyof Message],
      searchBeforeOrAfterId: this.dataSource.data[itemIndex]._id
    }
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


