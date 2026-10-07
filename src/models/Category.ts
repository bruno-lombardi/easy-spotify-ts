import { Image } from './Image'

export class Category {
  declare href: string

  declare icons: Image[]

  declare id: string

  declare name: string

  constructor(response: any) {
    Object.assign(this, response)
  }
}
