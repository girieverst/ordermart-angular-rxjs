import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA, PipeTransform } from '@angular/core';
import {NgFor, NgForOf, CommonModule} from "@angular/common";
import { OrderService } from '../services/order.service';


import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { Subject } from 'rxjs';
import { concatMap, mergeMap, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, 
    FormsModule, MatFormFieldModule,NgForOf,NgFor,CommonModule,
     MatInputModule, MatIconModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './orderlist.component.html',
  styleUrl: './orderlist.component.css'
})
export class OrderlistComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  searchValue = new Subject<Event>();
  remove = new Subject<string>();
  private searchResultSubscription: any = null;
  private orderSubscription: any = null;
  private removeSubscription: any = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.searchResultSubscription = this.searchValue.pipe(
      switchMap((s: Event) =>
        this.orderService.searchOrder((s.target as HTMLInputElement).value)
      )
    ).subscribe(this.setOrders.bind(this));

    this.orderSubscription = this.orderService.fetchOrders().subscribe(this.setOrders.bind(this));

    this.removeSubscription = this.remove.pipe(
      tap((id: string) => console.log(`Delete Order: ${id}`)),
      mergeMap((id: string) => this.orderService.removeOrder(id)),
      concatMap(() => this.orderService.fetchOrders())
    ).subscribe(this.setOrders.bind(this));
  }

  setOrders(orders: any[]): void {
    this.orders = orders;
  }

  ngOnDestroy(): void {
    if (this.searchResultSubscription) {
      this.searchResultSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.removeSubscription) {
      this.removeSubscription.unsubscribe();
    }
  }
}