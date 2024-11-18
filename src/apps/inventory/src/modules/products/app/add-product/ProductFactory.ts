
const productFactory = () => {

    const create = ( ): Product => {
                // Validate required fields
                if (!data.productId || !data.name || !data.sku || !data.price || !data.supplierId) {
                    throw new Error("Missing required fields to create a Product.");
                }

                // Initialize product with defaults for createdAt and updatedAt
                const currentDate = new Date().toISOString();

                const product: Product = {
                    productId: data.productId,
                    name: data.name,
                    description: data.description,
                    sku: data.sku,
                    price: data.price,
                    weight: data.weight,
                    dimensions: {
                        length: data.dimensions.length,
                        width: data.dimensions.width,
                        height: data.dimensions.height,
                    },
                    supplierId: data.supplierId,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                };

                return product;
            }
}
