import {Injectable} from '@angular/core';
import { Subject }    from 'rxjs/Subject';

/**
 * To perform dependency injection in app.
 */
@Injectable()
export class CommonService{
    constructor(){}

    size = new Subject<number>();
    algorithm = new Subject<String>();
    base64Image = new Subject<any>();

    getSize = this.size.asObservable();
    getAlgorithm = this.algorithm.asObservable();
    getBase64ImageEvent = this.base64Image.asObservable();

    setBase64ImageEvent(data : any){
        this.base64Image.next(data);
    }

    manipulate(obj : any){
        this.size.next(obj.size);
        this.algorithm.next(obj.algorithm);
    }
}