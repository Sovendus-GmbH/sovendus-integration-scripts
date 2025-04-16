import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "sovendus-integration-settings-ui/ui";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps): JSX.Element {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold">${product.price.toFixed(2)}</div>
        <Button asChild>
          <Link href="/thank-you" className="inline-flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
