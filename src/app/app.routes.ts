import { Routes } from '@angular/router';
import { SubmitOrderComponent } from './submit-order/submit-order.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';

export const routes: Routes = [
    {
      path:'',
      pathMatch:'full',
      redirectTo:'list',
    },
    {
      path:'submit',
      component:SubmitOrderComponent
    },
    {
      path:'list',
      component:OrderlistComponent
    },
    {
      path:'detail',
      component:OrderdetailComponent
    }
  ];
