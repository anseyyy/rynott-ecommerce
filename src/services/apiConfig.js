import { serverUrl, apiBaseUrl } from "./serverURL";

const config = {
  serverUrl,
  apiBaseUrl,

  // Endpoints
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      logout: "/auth/logout",
      me: "/auth/me",
      updateDetails: "/auth/updatedetails",
      updatePassword: "/auth/updatepassword",
      forgotPassword: "/auth/forgotpassword",
      resetPassword: "/auth/resetpassword",
    },

    users: {
      base: "/users",
      getUsers: "/users",
      getUser: (id) => `/users/${id}`,
      createUser: "/users",
      updateUser: (id) => `/users/${id}`,
      deleteUser: (id) => `/users/${id}`,
    },

    products: {
      base: "/products",
      getProducts: "/products",
      getProduct: (id) => `/products/${id}`,
      createProduct: "/products",
      updateProduct: (id) => `/products/${id}`,
      deleteProduct: (id) => `/products/${id}`,
      searchProducts: "/products/search",
      getProductsByCategory: (categoryId) => `/products/category/${categoryId}`,
      getFeaturedProducts: "/products/featured",
      uploadImages: (id) => `/products/${id}/images`,
      deleteImage: (productId, imageId) =>
        `/products/${productId}/images/${imageId}`,
      getProductStats: "/products/admin/stats",
    },

    categories: {
      base: "/categories",
      getCategories: "/categories",
      getCategory: (id) => `/categories/${id}`,
      createCategory: "/categories",
      updateCategory: (id) => `/categories/${id}`,
      deleteCategory: (id) => `/categories/${id}`,
      getCategoryTree: "/categories/tree",
    },

    orders: {
      base: "/orders",
      getOrders: "/orders",
      getOrder: (id) => `/orders/${id}`,
      createOrder: "/orders",
      updateOrder: (id) => `/orders/${id}`,
      deleteOrder: (id) => `/orders/${id}`,
    },

    upload: {
      avatar: "/upload/avatar",
      file: "/upload/file",
      deleteFile: (filename) => `/upload/file/${filename}`,
    },
  },

  upload: {
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    allowedImageExtensions: [".jpeg", ".jpg", ".png", ".gif", ".webp"],
  },
};

export default config;
