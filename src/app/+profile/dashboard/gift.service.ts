// reactive extensions
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

// imports
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// data models
import { Gift } from './gift.model';

@Injectable()
export class GiftService {

  constructor(
    private http: Http,
  ) {}

  /*
   *  @method getGiftsFromServer
   *
   *  Get gifts any[] from REST
   *  API or localStorage cache.
   *
   *  If retrieved from REST API cache
   *  any[] in localStorage.
   *
   *  Type cast any[] to Gift[].
   *
   *  Return any[] as Observable<Gift[]>.
   */
  getGiftsFromServer(forceHttpGet?: boolean): Observable<Gift[]> {
    const endpoint = "http://localhost:3000/api/gifts/";
    let gifts = JSON.parse(localStorage.getItem("gilt.secret-santa.GiftService.gifts"));
    if(gifts && !forceHttpGet) {
      console.info("GiftService: (getGifts) getting cached any[]")
      return Observable.of(gifts);
    } else {
      console.info("GiftService: (getGifts) GET -> " + endpoint);
      return this.http
        .get(endpoint)
        .map(response => {
          let gifts = response.json().gifts || [];
          if(gifts.length == 0) {
            console.error("GiftService: (getGifts) provided any[] has no elements");
            return [];
          } else {
            localStorage.setItem("gilt.secret-santa.GiftService.gifts", JSON.stringify(gifts));
            return gifts;
          }
        })
        .catch(error => {
          console.error(error);
          return Observable.of([]); // empty observable
        })
    }
  }

  /*
   *  @method castGifts
   *
   *  Type cast JSON data any[] to
   *  Gift[].
   *
   *  Clone any[] to prevent circular
   *  Object references. Type cast
   *  any[] to Gift[].
   *
   *  Return any[] as Observable<Gift[]>.
   */
  castGifts(gifts: any[]): Observable<Gift[]> {
    gifts = JSON.parse(JSON.stringify(gifts));
    let typeCastGifts: Gift[] = [];
    gifts.map(gift => {
      let g: Gift = new Gift();
      g.name = gift.productDetail.productName;
      g.brand = gift.productDetail.brand.name;
      g.image = "https://" + gift.productDetail.defaultLook.images[0].listingLookLargeUrl.slice(2);
      g.price = gift.productDetail.defaultLook.pricing.salePriceFormatted;
      g.url = gift.productDetail.defaultLook.canonicalUrl;
      typeCastGifts.push(g);
    });
    return Observable.of(typeCastGifts);
  }

  getGifts(): Observable<Gift[]> {
    return this.getGiftsFromServer()
      .flatMap(gifts => this.castGifts(gifts))
  }

}
