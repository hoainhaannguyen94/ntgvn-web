import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'productCategoryDetails',
    standalone: true,
    pure: true
})
export class ProductCategoryDetailsPipe implements PipeTransform {
    productService = inject(ProductService);

    transform(categoryId: string) {
        if (categoryId)
            return this.productService.getProductCategory$(categoryId).pipe(map(res => res.value));
        return of(null);
    }
}
