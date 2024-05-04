import { Component, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, throwError } from 'rxjs';
import { catchError, exhaustMap } from 'rxjs/operators';

import { OrderService } from '../services/order.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-submit-order',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './submit-order.component.html',
  styleUrls: ['./submit-order.component.css']
})

export class SubmitOrderComponent implements OnDestroy {
   _submitOrder = new Subject<NgForm>();
  private _submitSubscription: any;

  @ViewChild('orderForm') orderForm!: NgForm;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this._submitSubscription = this._submitOrder.pipe(
      exhaustMap((orderForm: NgForm) =>
        this.orderService.submitOrder(orderForm.value)
      ),
      catchError((error) => {
        console.error('Error:', error);
        this.showNotification({ message: 'An error occurred while submitting the order.' });
        return throwError(error);
      })
    ).subscribe((result) => {
      this.resetForm();
      this.showNotification(result);
    });
  }

  submitOrder() {
    this._submitOrder.next(this.orderForm);
  }

  resetForm() {
    this.orderForm.resetForm();
  }

  showNotification(result: any) {
    this.snackBar.open(
      result.message
        ? result.message
        : `Thanks! Order submitted successfully. Order Id: ${result}`,
      'OK',
      { duration: 3000, verticalPosition: 'top', horizontalPosition: 'left' }
    );
  }

  ngOnDestroy(): void {
    this._submitSubscription.unsubscribe();
  }

  // Expose a public method to trigger order submission
  // This method can be called from outside the component
  public triggerSubmitOrder() {
    this._submitOrder.next(this.orderForm);
  }
}