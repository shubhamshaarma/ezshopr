import Cart from "@/components/Cart";

function CartPage() {
    return (
        <section className="px-4 sm:px-6 pt-6 pb-16">
            <div className="max-w-3xl m-auto">
                <h3 className="text-2xl font-medium text-gray-700">
                    Your Cart
                </h3>
                <br />
                <Cart />
            </div>
        </section>
    );
}

export default CartPage;
