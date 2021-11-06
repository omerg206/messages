
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
  displayedColumns: string[] = ['sender', 'creationDate', 'body', 'status',];
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


  getMessagesFromServer({ pageNumber = 0, pageSize = 3, sortColumn = 'sender', filter,
    direction = MessageSortDirection[MessageSortDirection.asc] as any }: Partial<GetMessageParams>) {
    const url = `http://localhost:8080${AppRoutes.endPoint}${AppRoutes.getPagingMessages}`;
    const stringifiedParams = JSON.stringify({ pageNumber, pageSize, sortColumn, direction, filter });
    const params = new HttpParams().append('directionParams', stringifiedParams);
    this.isLoadingResults = true;

    this._httpClient.get<GetPagedMessageResponse>(url, { params }
    ).pipe(first()).subscribe(
      (data: GetPagedMessageResponse) => {
        this.isLoadingResults = false;
        this.totalMessagesInServer = data.totalCount
        this.dataSource.data = data.messages;
        this.cd.detectChanges();
      });

  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(300),
        map(($event: any) => $event.srcElement.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.getMessagesFromServer({ filter: value });
      });

    this.getMessagesFromServer({});
  }

  onPageChange($event: PageEvent) {
    this.getMessagesFromServer({ pageNumber: $event.pageIndex, pageSize: $event.pageSize })
  }

  onSortChange($event: Sort) {
    this.paginator.pageIndex = 0;
    this.getMessagesFromServer({ sortColumn: $event.active as keyof Message, direction: $event.direction as unknown as MessageSortDirection });
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

