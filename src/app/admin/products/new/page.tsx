import { createProduct } from "@/actions/productActions";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add product</h1>
        <p className="text-sm text-slate-600">Create a new item for your storefront.</p>
      </div>
      <ProductForm submitLabel="Create product" onSubmit={createProduct} />
    </div>
  );
}
