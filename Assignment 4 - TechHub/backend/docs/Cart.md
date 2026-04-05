# Cart API Documentation

This document provides a comprehensive guide to the Cart API. It follows OpenAPI specifications and includes human-friendly examples for easy integration.

## Base URL
\`http://localhost:9000/cart\`

## Overview
The Cart system operates as a **single global cart** for this prototype. The \`Cart\` table stores individual items (rows), where each row represents a product added to the cart. Items are automatically removed after 5 minutes of inactivity.

## Data Models

### Cart Item Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| \`id\` | Integer | Unique identifier for the cart item (Auto-incremented). |
| \`productId\` | Integer | ID of the product in the cart. |
| \`quantity\` | Integer | Quantity of the product. Default: 1. |
| \`expiresAt\` | Date | Timestamp when this item will be auto-deleted. |
| \`createdAt\` | Date | Timestamp of creation. |
| \`updatedAt\` | Date | Timestamp of last update. |
| \`product\` | Object | Populated product details (returned in responses). |

---

## Endpoints

### 1. Get Cart Items
Retrieves all items currently in the cart, including populated product details.

- **Method**: \`GET\`
- **URL**: \`/cart\`

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "productId": 101,
      "quantity": 2,
      "expiresAt": "2023-10-27T10:05:00.000Z",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z",
      "product": {
        "id": 101,
        "title": "Wireless Mouse",
        "price": 29.99,
        "image": "uploads/mouse.jpg",
        ...
      }
    },
    ...
  ]
}
\`\`\`

---

### 2. Add Item to Cart
Adds a product to the cart. If the product already exists, its quantity is updated. Checks stock availability.

- **Method**: \`POST\`
- **URL**: \`/cart\`
- **Content-Type**: \`application/json\`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`productId\` | Integer | Yes | ID of the product to add. |
| \`quantity\` | Integer | Yes | Quantity to add. |

#### Success Response
- **Code**: \`201 Created\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 101,
    "quantity": 2,
    "expiresAt": "2023-10-27T10:05:00.000Z",
    "product": { ... }
  }
}
\`\`\`

#### Error Response
- **Code**: \`400 Bad Request\`
- **Content**:
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Insufficient stock. Available: 5",
    "statusCode": 400
  }
}
\`\`\`
- **Code**: \`404 Not Found\` (Product not found)

---

### 3. Update Cart Item
Update the quantity of a specific item in the cart.

- **Method**: \`PUT\`
- **URL**: \`/cart/:id\`
- **Content-Type**: \`application/json\`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | Integer | Yes | The ID of the **cart item** (not product ID). |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`quantity\` | Integer | Yes | New quantity. |

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "quantity": 5,
    ...
  }
}
\`\`\`

#### Error Response
- **Code**: \`404 Not Found\` (Cart item not found)
- **Code**: \`400 Bad Request\` (Insufficient stock)

---

### 4. Remove Item from Cart
Remove a specific item from the cart.

- **Method**: \`DELETE\`
- **URL**: \`/cart/:id\`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | Integer | Yes | The ID of the **cart item**. |

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

---

### 5. Clear Cart
Remove all items from the cart.

- **Method**: \`DELETE\`
- **URL**: \`/cart\`

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "message": "Cart cleared"
}
\`\`\`
