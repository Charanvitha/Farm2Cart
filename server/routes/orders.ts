import { RequestHandler } from "express";
import {
  Order,
  OrderWithDetails,
  ApiResponse,
  PaginatedResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "@shared/api";

// Mock data for orders
const mockOrders: OrderWithDetails[] = [
  {
    id: "order1",
    vendorId: "vendor1",
    supplierId: "sup1",
    items: [
      {
        productId: "prod1",
        quantity: 50,
        pricePerUnit: 45,
        product: { name: "Fresh Tomatoes", unit: "kg" },
      },
      {
        productId: "prod4",
        quantity: 30,
        pricePerUnit: 35,
        product: { name: "Fresh Onions", unit: "kg" },
      },
    ],
    totalAmount: 3300,
    status: "confirmed",
    deliveryDate: "2024-01-25T10:00:00Z",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-21T09:15:00Z",
    vendor: {
      firstName: "Raj",
      lastName: "Kumar",
      businessName: "Raj's Street Food",
      phone: "+91-9876543210",
    },
    supplier: {
      firstName: "Suresh",
      lastName: "Sharma",
      businessName: "Green Valley Farms",
      phone: "+91-9876543211",
    },
  },
  {
    id: "order2",
    vendorId: "vendor2",
    supplierId: "sup2",
    items: [
      {
        productId: "prod2",
        quantity: 20,
        pricePerUnit: 150,
        product: { name: "Premium Cooking Oil", unit: "liter" },
      },
      {
        productId: "prod5",
        quantity: 100,
        pricePerUnit: 25,
        product: { name: "Food Grade Containers", unit: "piece" },
      },
    ],
    totalAmount: 5500,
    status: "pending",
    createdAt: "2024-01-22T11:20:00Z",
    updatedAt: "2024-01-22T11:20:00Z",
    vendor: {
      firstName: "Priya",
      lastName: "Singh",
      businessName: "Priya's Kitchen",
      phone: "+91-9876543212",
    },
    supplier: {
      firstName: "Rakesh",
      lastName: "Gupta",
      businessName: "Spice Masters Ltd",
      phone: "+91-9876543213",
    },
  },
  {
    id: "order3",
    vendorId: "vendor1",
    supplierId: "sup3",
    items: [
      {
        productId: "prod3",
        quantity: 5,
        pricePerUnit: 280,
        product: { name: "Homemade Garam Masala", unit: "kg" },
      },
    ],
    totalAmount: 1400,
    status: "delivered",
    deliveryDate: "2024-01-18T15:30:00Z",
    createdAt: "2024-01-15T10:45:00Z",
    updatedAt: "2024-01-18T15:30:00Z",
    vendor: {
      firstName: "Raj",
      lastName: "Kumar",
      businessName: "Raj's Street Food",
      phone: "+91-9876543210",
    },
    supplier: {
      firstName: "Lakshmi",
      lastName: "Devi",
      businessName: "Amma's Kitchen",
      phone: "+91-9876543214",
    },
  },
];

// GET /api/orders - Get all orders (filtered by user role)
export const getOrders: RequestHandler = (req, res) => {
  try {
    const { status, vendorId, supplierId, page = 1, limit = 10 } = req.query;

    let filteredOrders = [...mockOrders];

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status);
    }

    if (vendorId) {
      filteredOrders = filteredOrders.filter((o) => o.vendorId === vendorId);
    }

    if (supplierId) {
      filteredOrders = filteredOrders.filter(
        (o) => o.supplierId === supplierId,
      );
    }

    // Sort by creation date (newest first)
    filteredOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<OrderWithDetails>> = {
      success: true,
      data: {
        data: paginatedOrders,
        total: filteredOrders.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredOrders.length / limitNum),
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

// GET /api/orders/:id - Get single order
export const getOrderById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const response: ApiResponse<OrderWithDetails> = {
      success: true,
      data: order,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
};

// POST /api/orders - Create new order (vendor only)
export const createOrder: RequestHandler = (req, res) => {
  try {
    const orderData = req.body as CreateOrderRequest;

    // In a real app, you'd get the vendor ID from the authenticated user
    const vendorId = "vendor1"; // Mock vendor ID

    // Calculate total amount (in real app, fetch current prices from products)
    const totalAmount = orderData.items.reduce((sum, item) => {
      // Mock price calculation - in real app, get from product
      const mockPrice = 50; // This would come from the product
      return sum + item.quantity * mockPrice;
    }, 0);

    const newOrder: Order = {
      id: `order${Date.now()}`,
      vendorId,
      supplierId: orderData.supplierId,
      items: orderData.items.map((item) => ({
        ...item,
        pricePerUnit: 50, // Mock price - get from product in real app
      })),
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you'd save this to the database
    const response: ApiResponse<Order> = {
      success: true,
      data: newOrder,
      message: "Order created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};

// PUT /api/orders/:id/status - Update order status (supplier only)
export const updateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryDate } = req.body as UpdateOrderStatusRequest;

    const orderIndex = mockOrders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Update the order
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      deliveryDate,
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<OrderWithDetails> = {
      success: true,
      data: mockOrders[orderIndex],
      message: "Order status updated successfully",
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    });
  }
};

// GET /api/orders/stats - Get order statistics
export const getOrderStats: RequestHandler = (req, res) => {
  try {
    const { vendorId, supplierId } = req.query;

    let ordersToAnalyze = mockOrders;

    if (vendorId) {
      ordersToAnalyze = ordersToAnalyze.filter((o) => o.vendorId === vendorId);
    }

    if (supplierId) {
      ordersToAnalyze = ordersToAnalyze.filter(
        (o) => o.supplierId === supplierId,
      );
    }

    const stats = {
      total: ordersToAnalyze.length,
      pending: ordersToAnalyze.filter((o) => o.status === "pending").length,
      confirmed: ordersToAnalyze.filter((o) => o.status === "confirmed").length,
      delivered: ordersToAnalyze.filter((o) => o.status === "delivered").length,
      cancelled: ordersToAnalyze.filter((o) => o.status === "cancelled").length,
      totalValue: ordersToAnalyze.reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue:
        ordersToAnalyze.length > 0
          ? Math.round(
              ordersToAnalyze.reduce((sum, o) => sum + o.totalAmount, 0) /
                ordersToAnalyze.length,
            )
          : 0,
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch order statistics",
    });
  }
};
