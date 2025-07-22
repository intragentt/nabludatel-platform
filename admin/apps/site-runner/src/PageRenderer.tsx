// apps/site-runner/src/PageRenderer.tsx
import React from "react";
import { Header, CatalogContent } from "@nabludatel/ui";

// Определим базовые типы (в будущем вынесем в packages/core)
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl1: string;
}
interface ComponentInstance {
  id: string;
  type: string;
  props: any;
}
interface Page {
  id: string;
  title: string;
  components: ComponentInstance[];
}
interface Site {
  id: string;
  name: string;
}

// Карта компонентов
const componentsMap: { [key: string]: React.ComponentType<any> } = {
  Header: Header,
  CatalogContent: CatalogContent,
};

interface PageRendererProps {
  page: Page;
  products: Product[];
  site: Site;
}

export default function PageRenderer({
  page,
  products,
  site,
}: PageRendererProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>
          {site.name} - {page.title}
        </title>
      </head>
      <body>
        <div id="root">
          <h1>Сайт: {site.name}</h1>
          <h2>Страница: {page.title}</h2>
          <hr />
          {page.components.map((comp) => {
            const Component = componentsMap[comp.type];
            if (!Component) {
              return <div key={comp.id}>Компонент "{comp.type}" не найден</div>;
            }

            const componentProps =
              comp.type === "CatalogContent"
                ? { ...comp.props, products }
                : comp.props;

            return <Component key={comp.id} {...componentProps} />;
          })}
        </div>
      </body>
    </html>
  );
}
