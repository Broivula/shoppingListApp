export interface iShoppingList {
  'item': string,
  'user': string,
  'price'?:number,
  'date': string,
  'id'?:number,
  'previousName'?:string
}

export interface iRegisteredItems {
  'item':string,
  'price':number,
}

export interface iStatImageResponse {
  'file_path':string,
}
