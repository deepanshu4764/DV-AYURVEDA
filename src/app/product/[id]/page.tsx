import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product || !product.isActive) {
    return notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative h-80 w-full overflow-hidden rounded-lg border border-slate-200 bg-white md:h-[28rem]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No image</div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-amber-700">{product.category}</p>
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-lg font-semibold text-slate-900">{formatCurrency(product.price)}</p>
        <p className="text-slate-700">{product.description}</p>
        <p className="text-sm text-slate-600">
          Stock: {product.stock > 0 ? product.stock : "Out of stock"}
        </p>
        <AddToCartPanel product={product} />
      </div>
    </div>
  );
}
