import { Image } from './Image';

export class Category {
  href: string;
  icons: Image[];
  id: string;
  name: string;

  constructor(response: any) {
    Object.assign(this, response);
  }
}
