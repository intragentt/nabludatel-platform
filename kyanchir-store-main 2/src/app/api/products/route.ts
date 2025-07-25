// Местоположение: src/app/api/products/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Readable } from 'stream';

// НОВАЯ, РАСШИРЕННАЯ СТРУКТУРА ДАННЫХ
export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrls: string[];
  isNew: boolean;
  discountPercentage: number;
  sku: string;
  color: string;
  composition: string;
  description: string;
  isBestseller: boolean;
  // Остатки теперь - это объект, где ключ - размер, а значение - количество
  inventory: Record<string, number>;
}

async function getProductsFromCsv(): Promise<Product[]> {
  const results: Product[] = [];
  const csvFilePath = path.join(process.cwd(), 'data', 'products.csv');

  try {
    const fileContent = await fs.readFile(csvFilePath, 'utf8');

    // Создаем поток для парсера
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(fileContent);
    readableStream.push(null);

    await new Promise<void>((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on('data', (data: any) => {
          // Парсим строку "S:10;M:5;L:1" в объект { S: 10, M: 5, L: 1 }
          const inventoryObject: Record<string, number> = {};
          if (data.inventory) {
            data.inventory.split(';').forEach((item: string) => {
              const [size, quantity] = item.split(':');
              if (size && quantity) {
                inventoryObject[size] = parseInt(quantity, 10);
              }
            });
          }

          const product: Product = {
            id: data.id,
            name: data.name,
            price: parseInt(data.price, 10), // Используем parseInt, так как цена - целое число
            oldPrice: data.oldPrice ? parseInt(data.oldPrice, 10) : undefined,
            imageUrls: [data.imageUrl1, data.imageUrl2].filter(Boolean),
            isNew: data.isNew === 'true',
            discountPercentage: parseInt(data.discountPercentage || '0', 10),
            sku: data.sku || '',
            color: data.color || '',
            composition: data.composition || '',
            description: data.description || '',
            isBestseller: data.isBestseller === 'true',
            inventory: inventoryObject,
          };
          results.push(product);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    return results;
  } catch (error) {
    console.error('Failed to read or parse CSV:', error);
    return [];
  }
}

// Обработчик GET-запросов (без изменений)
export async function GET() {
  try {
    const products = await getProductsFromCsv();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to load products' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
