import { Name } from './name.model';
import { User } from './user.model';

export class Assignment {
  email: string;
  guid: string;
  name: Name;
  phone: string;
  assignment: User;
}