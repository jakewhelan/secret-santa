import { Name } from '../models/name.model';

export class User {

  constructor( 
    public email?: string,
    public guid?: string,
    public name?: Name,
    public phone?: string,
    public assignment?: User
  ) {}
  
}