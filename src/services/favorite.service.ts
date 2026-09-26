import * as favoriteRepository from "@/repositories/favorite.repository";
import * as productRepository from "@/repositories/product.repository";


// get the requester's fav
export const getFavorites = async (userId: number) => {
    return favoriteRepository.findFavoritesByUser(userId);
};

// add a product to fav 
export const addFavorite = async (userId : number, productId: number) => {
    const product = await productRepository.findProductById(productId);

    if (!product) {
        throw { status: 404, message: "Product not found" };
    }

    const existing = await favoriteRepository.findFavorite(userId, productId);

    if (!existing) {
        await favoriteRepository.createFavorite(userId, productId);
    }

    return getFavorites(userId);
};

// remove a product from favorites
export const removeFavorite = async (userId: number, productId: number) => {
    const existing = await favoriteRepository.findFavorite(userId, productId);

    if (!existing) {
        throw { status: 404, message: "Favorite not found" };
    }

    await favoriteRepository.deleteFavorite(userId, productId);
    return getFavorites(userId);
};
