import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone, ViewChild, inject, AfterContentChecked, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseFormSingleComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_ORDER, BLANK_PRODUT_IN_ORDER } from '@utils/schema';
import { debounceTime, map, startWith, take, takeUntil, timer } from 'rxjs';
import { OrderFacadeService } from '../../facade/order-facade.service';
import { LogService } from '@utils/service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'new-order',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatAutocompleteModule,
        ErrorMessageComponent
    ],
    templateUrl: './new-order.component.html',
    styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent extends BaseFormSingleComponent implements OnInit, AfterContentChecked, OnDestroy {
    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    logService = inject(LogService);
    orderFacade = inject(OrderFacadeService);
    router = inject(Router);
    ngZone = inject(NgZone);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    products = this.formBuilder.array([]) as any;
    productsAvailableQuantily = new Map();

    override formGroup = this.formBuilder.group({
        _customerId: [BLANK_ORDER._customerId, [Validators.required]],
        _createdBy: [BLANK_ORDER._createdBy, [Validators.required]],
        createdAt: [BLANK_ORDER.createdAt, [Validators.required]],
        deliveryAt: [BLANK_ORDER.deliveryAt, [Validators.required]],
        deliveryBy: [BLANK_ORDER.deliveryBy, [Validators.required]],
        status: [BLANK_ORDER.status, [Validators.required]],
        discount: [BLANK_ORDER.discount, [Validators.required, Validators.min(0)]],
        notes: [BLANK_ORDER.notes],
        total: [BLANK_ORDER.total, [Validators.required, Validators.min(0)]]
    });

    orderStatusList = [];

    productList = [];

    customerList = [];
    customerFilteredOptions;

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1)).subscribe({
            next: () => this.autosize.resizeToFitContent(true)
        });
    }

    ngOnInit() {
        this.registerCoreLayer();
        this.addProduct();
        this.formGroup.get('_createdBy').setValue(this.appState.me._id, { onlySelf: true });
        this.products.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.logService.info('NewOrderComponent', 'products', value);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.logService.info('NewOrderComponent', 'details', value);
            }
        });
        timer(0, 500).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                const prevTotal = this.formGroup.get('total').value;
                this.updateOrderTotal(prevTotal);
            }
        });
    }

    ngAfterContentChecked() {
        this.customerFilteredOptions = this.formGroup.get('_customerId').valueChanges.pipe(
            startWith(''),
            map(value => this.customerFilter(value || ''))
        );
    }

    onProductSelectionChange(event, index: number) {
        const product = this.productList.find(product => product._id === event.value);
        this.products.controls[index].get('quantity').setValue(0);
        this.products.controls[index].get('price').setValue(product.wholesalePrice);
    }

    updateOrderTotal(prevTotal: number) {
        const products = this.products.value;
        const discount = -this.formGroup.get('discount').value;
        const total = products.reduce((acc, cur) => {
            const value = cur.quantity * cur.price;
            acc += value;
            return acc;
        }, discount);
        if (prevTotal !== total) {
            this.formGroup.get('total').setValue(total);
        }
    }

    customerFilter(value: string) {
        const filterValue = value.toLowerCase();
        return this.customerList.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    customerDisplayWithFn(customerId: string) {
        if (customerId && this.customerList) {
            const customer = this.customerList.find(customer => customer._id === customerId);
            if (customer) {
                return customer.name;
            }
        }
        return '';
    }

    override registerCoreLayer() {
        this.orderFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('NewOrderComponent', err);
            }
        });
        this.orderFacade.getOrderStatusList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.orderStatusList = value;
            },
            error: err => {
                this.logService.error('NewOrderComponent', err);
            }
        });
        this.orderFacade.getProductList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.productList = value;
                this.updateProductAvailableQuantily();
            },
            error: err => {
                this.logService.error('NewOrderComponent', err);
            }
        });
        this.orderFacade.getCustomerList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.customerList = value;
            },
            error: err => {
                this.logService.error('NewOrderComponent', err);
            }
        });
        this.orderFacade.loadOrderStatusList({
            $skip: 0,
            $top: 20
        });
        this.orderFacade.loadProductList({
            $orderby: 'name asc'
        });
        this.orderFacade.loadCustomerList({
            $orderby: 'name asc'
        });
    }

    updateProductAvailableQuantily() {
        this.productList.forEach(product => {
            if (product) {
                this.productsAvailableQuantily.set(product._id, product.quantity);
            }
        });
    }

    cancelHandler() {
        this.back();
    }

    submitHandler() {
        const products = this.products.value as any;
        const order = this.formGroup.value as any;
        order['products'] = products;
        this.orderFacade.submitOrder$(order).subscribe({
            next: () => {
                this.matSnackbar.open(`Order ${order._id} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/order/list']);
            },
            error: err => {
                this.logService.error('NewOrderComponent', err);
            }
        });
    }

    addProduct(index?: number) {
        const product = this.formBuilder.group({
            _productId: [BLANK_PRODUT_IN_ORDER._productId],
            quantity: [BLANK_PRODUT_IN_ORDER.quantity, [Validators.min(0)]],
            price: [BLANK_PRODUT_IN_ORDER.price, [Validators.min(0)]]
        });
        if (index != null) {
            this.products.insert(index + 1, product);
        } else {
            this.products.push(product);
        }
        this.cdr.detectChanges();
    }

    removeProduct(index) {
        this.products.removeAt(index);
        this.cdr.detectChanges();
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.productsAvailableQuantily.clear();
    }
}
