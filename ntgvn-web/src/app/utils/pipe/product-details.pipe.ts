import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductService } from '@utils/service';
import { map, of } from 'rxjs';

@Pipe({
    name: 'productDetails',
    standalone: true,
    pure: true
})
export class ProductDetailsPipe implements PipeTransform {
    productService = inject(ProductService);

    transform(productId: string) {
        if (productId)
            return this.productService.getProduct$(productId).pipe(map(res => res.value));
        return of(null);
    }
}
