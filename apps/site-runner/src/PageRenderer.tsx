// apps/site-runner/src/PageRenderer.tsx
import React from "react";
import { Header, CatalogContent } from "../../../packages/ui/src/index";
import type { Product, Page, Site } from "../../../packages/core/src/index";

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
        <title>{`${site.name} - ${page.title}`}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">
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
