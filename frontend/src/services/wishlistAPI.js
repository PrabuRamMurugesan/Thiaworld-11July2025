import thiaAPI from "./thiaAPI"; // your axios instance with baseURL + withCredentials

export const getWishlist = () => thiaAPI.get("/wishlist").then((r) => r.data);
export const toggleWishlist = (productId) =>
  thiaAPI.post("/wishlist/toggle", { productId }).then((r) => r.data);
export const removeWishlist = (productId) =>
  thiaAPI.delete(`/wishlist/${productId}`).then((r) => r.data);
export const bulkAddWishlist = (ids) =>
  thiaAPI.post("/wishlist/bulk", { productIds: ids }).then((r) => r.data);
