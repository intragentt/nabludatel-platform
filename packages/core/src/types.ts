// Общие интерфейсы, которые переиспользуются в нескольких пакетах.

// Описание товара для каталогов
export interface Product {
  id: string;      // уникальный идентификатор
  name: string;    // название
  price: number;   // текущая цена
  imageUrl1: string; // ссылка на изображение
}

// Инстанс UI-компонента на странице
export interface ComponentInstance {
  id: string;
  type: string; // имя компонента
  props: any;   // произвольные свойства
}

// Страница сайта, состоящая из наборов компонентов
export interface Page {
  id: string;
  title: string;
  components: ComponentInstance[];
}

// Минимальная информация о сайте
export interface Site {
  id: string;
  name: string;
}
