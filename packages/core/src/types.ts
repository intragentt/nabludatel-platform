export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl1: string;
}

export interface ComponentInstance {
  id: string;
  type: string;
  props: any;
}

export interface Page {
  id: string;
  title: string;
  components: ComponentInstance[];
}

export interface Site {
  id: string;
  name: string;
}
