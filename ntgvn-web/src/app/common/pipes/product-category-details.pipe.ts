import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductService } from '@common/services';
import { map } from 'rxjs';

@Pipe({
    name: 'productCategoryDetails',
    standalone: true,
    pure: true
})
export class ProductCategoryDetailsPipe implements PipeTransform {
    productService = inject(ProductService);

    transform(categoryId: string) {
        return this.productService.getProductCategory$(categoryId).pipe(map(res => res.value));
    }
}
