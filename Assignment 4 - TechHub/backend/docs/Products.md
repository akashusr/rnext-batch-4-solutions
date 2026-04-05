# Product API Documentation

This document provides a clear and concise guide to the Product Management API. It follows OpenAPI specifications and includes human-friendly examples for easy integration.

## Base URL
\`http://localhost:9000/products\`

## Data Models

### Product Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| \`id\` | Integer | Unique identifier for the product (Auto-incremented). |
| \`title\` | String | Name of the product. |
| \`price\` | Float | Price of the product. |
| \`description\` | String | Detailed description of the product. |
| \`category\` | String | Category the product belongs to. |
| \`image\` | String | Path to the product image (optional). |
| \`rating_rate\` | Float | Average rating (0-5). Default: 0. |
| \`rating_count\` | Integer | Number of ratings. Default: 0. |
| \`stock\` | Integer | Available stock quantity. Default: 0. |
| \`createdAt\` | Date | Timestamp of creation. |
| \`updatedAt\` | Date | Timestamp of last update. |

---

## Endpoints

### 1. List All Products
Retrieves a list of all products with optional sorting and filtering.

- **Method**: \`GET\`
- **URL**: \`/products\`

#### Query Parameters
| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| \`sortBy\` | String | Field to sort by (e.g., \`price\`, \`title\`). | \`price\` |
| \`order\` | String | Sort order: \`asc\` or \`desc\`. | \`desc\` |
| \`category\` | String | Filter by category name. | \`Laptop\` |
| \`minPrice\` | Float | Filter by minimum price. | \`1000\` |
| \`maxPrice\` | Float | Filter by maximum price. | \`2000\` |
| \`minRating\` | Float | Filter by minimum \`rating_rate\`. | \`4\` |

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
      "title": "Dell XPS 15",
      "price": 1899.99,
      "description": "High-performance laptop...",
      "category": "Laptop",
      "image": "uploads/image.jpg",
      "rating_rate": 4.5,
      "rating_count": 120,
      "stock": 10,
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    },
    ...
  ]
}
\`\`\`

---

### 2. Search Products
Search for products by matching keywords in the title or description.

- **Method**: \`GET\`
- **URL**: \`/products/search\`

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| \`q\` | String | Yes | Search keyword (matches \`title\` and \`description\`). | \`gaming\` |
| \`category\` | String | No | Filter by category. | \`Laptop\` |
| \`minPrice\` | Float | No | Minimum price (inclusive). | \`500\` |
| \`maxPrice\` | Float | No | Maximum price (inclusive). | \`1500\` |
| \`minRating\` | Float | No | Minimum \`rating_rate\`. | \`4\` |
| \`sortBy\` | String | No | Sort field: \`id\`, \`title\`, \`price\`, \`category\`, \`rating_rate\`, \`rating_count\`, \`stock\`. | \`price\` |
| \`order\` | String | No | Sort order when \`sortBy\` is set: \`asc\` (default) or \`desc\`. | \`desc\` |

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 16,
      "title": "Corsair Vengeance i7400",
      "description": "Pre-built gaming powerhouse...",
      ...
    }
  ]
}
\`\`\`

#### Error Response
- **Code**: \`400 Bad Request\`
- **Content**:
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Search query \"q\" is required",
    "statusCode": 400
  }
}
\`\`\`

---

### 3. Filter Products
Advanced filtering for products based on multiple criteria.

- **Method**: \`GET\`
- **URL**: \`/products/filter\`

#### Query Parameters
| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| \`category\` | String | Filter by category. | \`Laptop\` |
| \`minPrice\` | Float | Minimum price. | \`1000\` |
| \`maxPrice\` | Float | Maximum price. | \`2000\` |
| \`minRating\` | Float | Minimum rating (e.g., 4.5). | \`4.5\` |

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "count": 5,
  "data": [...]
}
\`\`\`

---

### 4. Get Product by ID
Retrieve details of a specific product.

- **Method**: \`GET\`
- **URL**: \`/products/:id\`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | Integer | Yes | The ID of the product. |

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Dell XPS 15",
    ...
  }
}
\`\`\`

#### Error Response
- **Code**: \`404 Not Found\`
- **Content**:
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Product not found",
    "statusCode": 404
  }
}
\`\`\`

---

### 5. Create Product
Create a new product entry.

- **Method**: \`POST\`
- **URL**: \`/products\`
- **Content-Type**: \`multipart/form-data\`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`title\` | String | Yes | Product name. |
| \`price\` | Float | Yes | Product price. |
| \`description\` | String | Yes | Product description. |
| \`category\` | String | Yes | Product category. |
| \`stock\` | Integer | No | Initial stock (default 0). |
| \`image\` | File | No | Product image file. |

#### Success Response
- **Code**: \`201 Created\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": 21,
    "title": "New Product",
    ...
  }
}
\`\`\`

---

### 6. Update Product
Update an existing product.

- **Method**: \`PUT\`
- **URL**: \`/products/:id\`
- **Content-Type**: \`multipart/form-data\` (if updating image) or \`application/json\`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | Integer | Yes | The ID of the product. |

#### Request Body
Any of the fields from the Create Product request body can be updated.

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

---

### 7. Delete Product
Remove a product from the system.

- **Method**: \`DELETE\`
- **URL**: \`/products/:id\`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| \`id\` | Integer | Yes | The ID of the product. |

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

### 8. Reset Stock (Tool)
Reset the stock of ALL products to 10. Useful for testing.

- **Method**: \`POST\`
- **URL**: \`/products/reset-stock\`

#### Success Response
- **Code**: \`200 OK\`
- **Content**:
\`\`\`json
{
  "success": true,
  "message": "All products stock reset to 10"
}
\`\`\`
