// apps/site-runner/src/PageRenderer.tsx

import React from "react";
// Импортируем компоненты Header и CatalogContent из пакета UI
import { Header, CatalogContent } from "../../../packages/ui/src/index";
// Импортируем типы данных Product, Page, Site из пакета Core
import type { Product, Page, Site } from "../../../packages/core/src/index";

// Словарь (map) для сопоставления имени компонента строкового типа с самим React-компонентом
const componentsMap: { [key: string]: React.ComponentType<any> } = {
  Header: Header,
  CatalogContent: CatalogContent,
};

// Интерфейс пропсов для PageRenderer
interface PageRendererProps {
  page: Page;            // Описание страницы (список компонентов, заголовок и т.д.)
  products: Product[];   // Список продуктов, который передаётся в компонент CatalogContent
  site: Site;            // Данные о сайте (например, название)
}

// Основной компонент-рендерер страницы.
// Он принимает описание страницы, список продуктов и данные сайта,
// и на его основе формирует полный HTML-документ.
export default function PageRenderer({
  page,
  products,
  site,
}: PageRendererProps) {
  return (
    <html>
      <head>
        {/* Задаём мета-charset */}
        <meta charSet="utf-8" />
        {/* Формируем title страницы: "<имя сайта> - <заголовок страницы>" */}
        <title>{`${site.name} - ${page.title}`}</title>
        {/* Подключаем скомпилированные стили Tailwind */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">
          {/* Перебираем массив компонентов, описанных в page.components */}
          {page.components.map((comp) => {
            // Выбираем React-компонент по его типу
            const Component = componentsMap[comp.type];
            if (!Component) {
              // Если компонент не найден в словаре, отображаем сообщение об ошибке
              return <div key={comp.id}>Компонент "{comp.type}" не найден</div>;
            }
            // Для компонента CatalogContent передаём дополнительно список products,
            // для остальных компонентов используем их собственные props
            const componentProps =
              comp.type === "CatalogContent"
                ? { ...comp.props, products }
                : comp.props;
            // Рендерим найденный компонент с переданными пропсами
            return <Component key={comp.id} {...componentProps} />;
          })}
        </div>
      </body>
    </html>
  );
}
