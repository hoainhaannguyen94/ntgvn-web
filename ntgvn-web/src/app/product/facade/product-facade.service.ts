import { Injectable, inject } from '@angular/core';
import { ProductApiService } from '../core/product-api.service';
import { ProductStateService } from '../core/product-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IProduct } from '@utils/schema';
import { WarehouseService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class ProductFacadeService {
    productAPI = inject(ProductApiService);
    productState = inject(ProductStateService);
    warehouseService = inject(WarehouseService);

    isLoading$() {
        return this.productState.isLoading$();
    }

    getCountProducts$() {
        return this.productState.getCountProducts$();
    }

    loadCountProducts(params?: OdataParams) {
        this.productState.setLoading(true);
        this.productAPI.countProducts$(params).pipe(
            finalize(() => {
                this.productState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.productState.setCountProducts(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadProductList(params?: OdataParams) {
        this.productState.setLoading(true);
        this.productAPI.getProductList$(params).pipe(
            finalize(() => {
                this.productState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.productState.setProductList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getProductList$() {
        return this.productState.getProductList$();
    }

    getProduct$(productId: string, params?: OdataParams) {
        return this.productAPI.getProduct$(productId, params);
    }

    submitProduct$(product: Omit<IProduct, '_id'>) {
        return new Observable((observer) => {
            this.productState.setLoading(true);
            this.productAPI.submitProduct$(product).pipe(
                finalize(() => {
                    this.productState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    updateProduct$(productId: string, product: Omit<IProduct, '_id'>) {
        return new Observable((observer) => {
            this.productState.setLoading(true);
            this.productAPI.updateProduct$(productId, product).pipe(
                finalize(() => {
                    this.productState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    deleteProduct$(productId: string) {
        return new Observable((observer) => {
            this.productState.setLoading(true);
            this.productAPI.deleteProduct$(productId).pipe(
                finalize(() => {
                    this.productState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    loadProductCategoryList(params?: OdataParams) {
        this.productState.setLoading(true);
        this.productAPI.getProductCategoryList$(params).pipe(
            finalize(() => {
                this.productState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.productState.setProductCategoryList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getProductCategoryList$() {
        return this.productState.getProductCategoryList$();
    }

    loadWarehouseList(params?: OdataParams) {
        this.productState.setLoading(true);
        this.warehouseService.getWarehouseList$(params).pipe(
            finalize(() => {
                this.productState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.productState.setWarehouseList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getWarehouseList$() {
        return this.productState.getWarehouseList$();
    }
}
