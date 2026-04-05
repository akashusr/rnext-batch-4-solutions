# Category API Documentation

This document provides a clear and concise guide to the Category Management API. It follows OpenAPI specifications and includes human-friendly examples for easy integration.

## Base URL
`http://localhost:9000/categories`

## Overview
The Category API allows you to manage product categories. Categories are used to organize products and enable filtering.

## Data Models

### Category Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Unique identifier for the category (Auto-incremented). |
| `name` | String | Name of the category (must be unique). |
| `createdAt` | Date | Timestamp of creation. |
| `updatedAt` | Date | Timestamp of last update. |

---

## Endpoints

### 1. List All Categories
Retrieves a list of all categories.

- **Method**: `GET`
- **URL**: `/categories`

#### Success Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Desktop",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 2. Get Category by ID
Retrieve details of a specific category.

- **Method**: `GET`
- **URL**: `/categories/:id`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | The ID of the category. |

#### Success Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
}
```

#### Error Response
- **Code**: `404 Not Found`
- **Content**:
```json
{
  "success": false,
  "error": {
    "message": "Category not found",
    "statusCode": 404
  }
}
```

---

### 3. Create Category
Create a new category.

- **Method**: `POST`
- **URL**: `/categories`
- **Content-Type**: `application/json`

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Category name (must be unique). |

#### Example Request
```json
{
  "name": "Gaming PC"
}
```

#### Success Response
- **Code**: `201 Created`
- **Content**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Gaming PC",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  }
}
```

#### Error Response
- **Code**: `400 Bad Request` (Duplicate category name)
- **Content**:
```json
{
  "success": false,
  "error": {
    "message": "Category name must be unique",
    "statusCode": 400
  }
}
```

---

### 4. Update Category
Update an existing category.

- **Method**: `PUT`
- **URL**: `/categories/:id`
- **Content-Type**: `application/json`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | The ID of the category. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | New category name. |

#### Example Request
```json
{
  "name": "High-End Gaming PC"
}
```

#### Success Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "High-End Gaming PC",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:05:00.000Z"
  }
}
```

#### Error Response
- **Code**: `404 Not Found` (Category not found)
- **Code**: `400 Bad Request` (Duplicate name)

---

### 5. Delete Category
Remove a category from the system.

- **Method**: `DELETE`
- **URL**: `/categories/:id`

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | The ID of the category. |

#### Success Response
- **Code**: `200 OK`
- **Content**:
```json
{
  "success": true,
  "data": {}
}
```

#### Error Response
- **Code**: `404 Not Found`
- **Content**:
```json
{
  "success": false,
  "error": {
    "message": "Category not found",
    "statusCode": 404
  }
}
```

---

## Notes & Edge Cases

1. **Unique Names**: Category names must be unique. Attempting to create or update a category with a duplicate name will result in a `400 Bad Request` error.

2. **Case Sensitivity**: Category names are case-sensitive. "Laptop" and "laptop" are treated as different categories.

3. **Deletion Impact**: Deleting a category does not automatically delete associated products. Products will retain their category string value.

4. **Empty Names**: Category names cannot be empty or null.
