import { updateProduct } from "@/actions/productActions";
import { ProductForm } from "@/components/product-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  const update = async (values: Record<string, unknown>) => {
    "use server";
    return updateProduct(product.id, values);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
        <p className="text-sm text-slate-600">Update product details.</p>
      </div>
      <ProductForm
        submitLabel="Save changes"
        onSubmit={update}
        initialData={{
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category ?? "",
          stock: product.stock,
          imageUrl: product.imageUrl ?? "",
          isActive: product.isActive,
        }}
      />
    </div>
  );
}
