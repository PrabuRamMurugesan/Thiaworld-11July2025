import thiaAPI from "./thiaAPI";

function authConfig() {
  try {
    const raw = localStorage.getItem("bbsUser");
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    const token = parsed.token;
    if (!token) return {};

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (e) {
    console.error("Failed to parse bbsUser from localStorage", e);
    return {};
  }
}

export const getWishlist = () =>
  thiaAPI.get("/wishlist", authConfig()).then((r) => r.data);

export const toggleWishlist = (productId) =>
  thiaAPI
    .post("/wishlist/toggle", { productId }, authConfig())
    .then((r) => r.data);

export const removeWishlist = (productId) =>
  thiaAPI.delete(`/wishlist/${productId}`, authConfig()).then((r) => r.data);

export const bulkAddWishlist = (ids) =>
  thiaAPI
    .post("/wishlist/bulk", { productIds: ids }, authConfig())
    .then((r) => r.data);
