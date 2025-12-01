import config from "./apiConfig";
import { apiCall, uploadFile } from "./commonAPI";

// ==================== PRODUCT API FUNCTIONS ====================

// Get all products with optional filters
const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        queryParams.append(key, filters[key]);
      }
    });

    const endpoint = `/products?${queryParams.toString()}`;
    const response = await apiCall(endpoint);

    // Ensure response has proper structure
    if (response && typeof response === "object") {
      return {
        success: response.success !== false,
        data: response.data || response,
        message: response.message,
      };
    }

    return response;
  } catch (error) {
    console.error("Error in getProducts:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch products",
    };
  }
};

// Get single product by ID
const getProduct = async (id) => {
  return apiCall(config.endpoints.products.getProduct(id));
};

// Search products
const searchProducts = async (searchParams) => {
  const queryParams = new URLSearchParams(searchParams);
  const endpoint = `/products/search?${queryParams.toString()}`;
  return apiCall(endpoint);
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  return apiCall(config.endpoints.products.getProductsByCategory(categoryId));
};

// Get featured products
const getFeaturedProducts = async () => {
  return apiCall(config.endpoints.products.getFeaturedProducts);
};

// Create new product (Admin only)
const createProduct = async (productData) => {
  return apiCall(config.endpoints.products.createProduct, {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

// Update product (Admin only)
const updateProduct = async (id, productData) => {
  return apiCall(config.endpoints.products.updateProduct(id), {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

// Delete product (Admin only)
const deleteProduct = async (id) => {
  return apiCall(config.endpoints.products.deleteProduct(id), {
    method: "DELETE",
  });
};

// Upload product images (Admin only)
const uploadProductImages = async (productId, images, altText = "") => {
  const uploadPromises = images.map((image) => {
    const formData = new FormData();
    formData.append("images", image);
    formData.append("altText", altText);

    return fetch(
      `${config.apiBaseUrl}${config.endpoints.products.uploadImages(
        productId
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    ).then((res) => res.json());
  });

  return Promise.all(uploadPromises);
};

// Delete product image (Admin only)
const deleteProductImage = async (productId, imageId) => {
  return apiCall(config.endpoints.products.deleteImage(productId, imageId), {
    method: "DELETE",
  });
};

// Get product statistics (Admin only)
const getProductStats = async () => {
  return apiCall(config.endpoints.products.getProductStats);
};

// ==================== CATEGORY API FUNCTIONS ====================

// Get all categories
const getCategories = async () => {
  try {
    const response = await apiCall(config.endpoints.categories.getCategories);

    // Ensure response has proper structure
    if (response && typeof response === "object") {
      return {
        success: response.success !== false,
        data: response.data || response,
        message: response.message,
      };
    }

    return response;
  } catch (error) {
    console.error("Error in getCategories:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch categories",
    };
  }
};

// Get category tree
const getCategoryTree = async () => {
  return apiCall(config.endpoints.categories.getCategoryTree);
};

// Get single category by ID
const getCategory = async (id) => {
  return apiCall(config.endpoints.categories.getCategory(id));
};

// Create new category (Admin only)
const createCategory = async (categoryData) => {
  return apiCall(config.endpoints.categories.createCategory, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

// Update category (Admin only)
const updateCategory = async (id, categoryData) => {
  return apiCall(config.endpoints.categories.updateCategory(id), {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

// Delete category (Admin only)
const deleteCategory = async (id) => {
  return apiCall(config.endpoints.categories.deleteCategory(id), {
    method: "DELETE",
  });
};

// ==================== USER API FUNCTIONS ====================

// Get all users (Admin only)
const getUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== "") {
      queryParams.append(key, filters[key]);
    }
  });

  const endpoint = `/users?${queryParams.toString()}`;
  return apiCall(endpoint);
};

// Get single user by ID (Admin only)
const getUser = async (id) => {
  return apiCall(config.endpoints.users.getUser(id));
};

// Create new user (Admin only)
const createUser = async (userData) => {
  return apiCall(config.endpoints.users.createUser, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Update user (Admin only)
const updateUser = async (id, userData) => {
  return apiCall(config.endpoints.users.updateUser(id), {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

// Delete user (Admin only)
const deleteUser = async (id) => {
  return apiCall(config.endpoints.users.deleteUser(id), {
    method: "DELETE",
  });
};

// ==================== ORDER API FUNCTIONS ====================

// Get all orders
const getOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== "") {
      queryParams.append(key, filters[key]);
    }
  });

  const endpoint = `/orders?${queryParams.toString()}`;
  return apiCall(endpoint);
};

// Get single order by ID
const getOrder = async (id) => {
  return apiCall(config.endpoints.orders.getOrder(id));
};

// Create new order
const createOrder = async (orderData) => {
  try {
    if (
      !orderData ||
      !orderData.orderItems ||
      orderData.orderItems.length === 0
    ) {
      return {
        success: false,
        message: "Cart is empty. Please add items before placing an order.",
        data: null,
      };
    }

    const response = await apiCall(config.endpoints.orders.createOrder, {
      method: "POST",
      body: JSON.stringify(orderData),
    });

    // Validate response
    if (response && (response.success || response.data)) {
      return {
        success: true,
        message: response.message || "Order created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response?.message || "Failed to create order",
      data: null,
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    return {
      success: false,
      message: error.message || "An error occurred while creating your order",
      data: null,
    };
  }
};

// Update order (Admin only)
const updateOrder = async (id, orderData) => {
  return apiCall(config.endpoints.orders.updateOrder(id), {
    method: "PUT",
    body: JSON.stringify(orderData),
  });
};

// Delete order (Admin only)
const deleteOrder = async (id) => {
  return apiCall(config.endpoints.orders.deleteOrder(id), {
    method: "DELETE",
  });
};

// ==================== CONTACT API FUNCTIONS ====================

// Submit contact form (Public)
const submitContactForm = async (contactData) => {
  return apiCall("/contact", {
    method: "POST",
    body: JSON.stringify(contactData),
  });
};

// Get all contact submissions (Admin only)
const getContactSubmissions = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.page) queryParams.append("page", filters.page);
  if (filters.limit) queryParams.append("limit", filters.limit);

  return apiCall(`/contact/admin/submissions?${queryParams.toString()}`);
};

// Get single contact submission (Admin only)
const getContactSubmission = async (id) => {
  return apiCall(`/contact/admin/submissions/${id}`);
};

// Update contact submission status (Admin only)
const updateContactStatus = async (id, status) => {
  return apiCall(`/contact/admin/submissions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// Reply to contact submission (Admin only)
const replyToContact = async (id, replyData) => {
  return apiCall(`/contact/admin/submissions/${id}/reply`, {
    method: "POST",
    body: JSON.stringify(replyData),
  });
};

// Delete contact submission (Admin only)
const deleteContactSubmission = async (id) => {
  return apiCall(`/contact/admin/submissions/${id}`, {
    method: "DELETE",
  });
};

// ==================== UPLOAD API FUNCTIONS ====================

// Upload avatar
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return fetch(`${config.apiBaseUrl}${config.endpoints.upload.avatar}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  }).then((res) => res.json());
};

// Upload generic file
const uploadGenericFile = async (file) => {
  return uploadFile(config.endpoints.upload.file, file);
};

// Delete file
const deleteFile = async (filename) => {
  return apiCall(config.endpoints.upload.deleteFile(filename), {
    method: "DELETE",
  });
};

// ==================== BULK OPERATIONS ====================

// Bulk update product status (Admin only)
const bulkUpdateProductStatus = async (productIds, status) => {
  const promises = productIds.map((id) => updateProduct(id, { status }));
  return Promise.all(promises);
};

// Bulk delete products (Admin only)
const bulkDeleteProducts = async (productIds) => {
  const promises = productIds.map((id) => deleteProduct(id));
  return Promise.all(promises);
};

// Bulk update category status (Admin only)
const bulkUpdateCategoryStatus = async (categoryIds, isActive) => {
  const promises = categoryIds.map((id) => updateCategory(id, { isActive }));
  return Promise.all(promises);
};

// ==================== ANALYTICS API FUNCTIONS ====================

// Get dashboard statistics (Admin only)
const getDashboardStats = async () => {
  try {
    const [products, users, orders] = await Promise.allSettled([
      getProductStats(),
      getUsers({ limit: 1 }), // Just to get count
      getOrders({ limit: 1 }), // Just to get count
    ]);

    // Handle results with fallbacks
    const productsData =
      products.status === "fulfilled" && products.value?.success
        ? { totalProducts: products.value.data.totalProducts }
        : { totalProducts: 0 };
    const usersData =
      users.status === "fulfilled" && users.value?.success
        ? {
            count:
              users.value.data.count || users.value.data.results?.length || 0,
          }
        : { count: 0 };
    const ordersData =
      orders.status === "fulfilled" && orders.value?.success
        ? {
            count:
              orders.value.data.count || orders.value.data.results?.length || 0,
          }
        : { count: 0 };

    return {
      products: productsData,
      users: usersData,
      orders: ordersData,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return fallback data
    return {
      products: { totalProducts: 0 },
      users: { count: 0 },
      orders: { count: 0 },
    };
  }
};

// Get sales analytics (Admin only)
const getSalesAnalytics = async (dateRange = {}) => {
  const queryParams = new URLSearchParams(dateRange);
  return apiCall(`/admin/analytics/sales?${queryParams.toString()}`);
};

// Get product analytics (Admin only)
const getProductAnalytics = async () => {
  return apiCall("/admin/analytics/products");
};

// ==================== EXPORT ALL FUNCTIONS ====================

export {
  // Product functions
  getProducts,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getProductStats,

  // Category functions
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,

  // User functions
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,

  // Order functions
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,

  // Upload functions
  uploadAvatar,
  uploadGenericFile,
  deleteFile,

  // Bulk operations
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  bulkUpdateCategoryStatus,

  // Analytics functions
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
};

export default {
  getProducts,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getProductStats,
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  submitContactForm,
  getContactSubmissions,
  getContactSubmission,
  updateContactStatus,
  replyToContact,
  deleteContactSubmission,
  uploadAvatar,
  uploadGenericFile,
  deleteFile,
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  bulkUpdateCategoryStatus,
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
};
