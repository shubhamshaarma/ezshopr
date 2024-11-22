"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import ProductCard from "./ProductCard";

function Product() {
    const { products } = useAppSelector((state) => state.products);

    return (
        <section className="px-4 py-10 sm:px-6">
            <div className="px-1 gap-4 sm:px-2 md:px-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                    <ProductCard
                        _id={product._id}
                        title={product.title}
                        description={product.description}
                        image={product.images[0]}
                        price={product.price}
                        rating={product.rating}
                        key={index}
                    />
                ))}
            </div>
        </section>
    );
}

export default Product;
