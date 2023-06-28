import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { ProductService } from '@utils/service';
import { OdataParams } from '@utils/http';
import { IWarehouse } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class ProductApiService extends ProductService { }
