# Flyrank Task: Minimalist Node.js Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

A lightweight and fast backend server built using vanilla Node.js without any external frameworks (like Express). This project demonstrates the core capability of setting up HTTP servers and RESTful endpoints using native JavaScript modules.

## Features

- **Zero Dependencies:** Built entirely with the native Node.js `http` module.
- **Fast & Lightweight:** Starts instantly and consumes minimal resources.
- **RESTful Endpoints:** Serves clean JSON responses.

## Endpoints

The server runs on port `3000` by default.

### 1. Ping Check
- **URL:** `/ping`
- **Method:** `GET`
- **Description:** Use this to check if the server is alive.
- **Response:**
  ```json
  {
    "status": "success",
    "message": "pong"
  }
  ```

### 2. Fetch Data
- **URL:** `/data`
- **Method:** `GET`
- **Description:** Returns a sample data array.
- **Response:**
  ```json
  {
    "data": [1, 2, 3, 4, 5]
  }
  ```

### 3. Register User
- **URL:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user. Passwords are hashed using native Node.js crypto.
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "mysecretpassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 4. Login User
- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a bearer token.
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "mysecretpassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "7adf187d5b961cae6b6ed917aaa0597fa8339719696d4ee70635aedd32bbfcd8"
  }
  ```

### 5. Protected Route
- **URL:** `/protected`
- **Method:** `GET`
- **Description:** A secured route that requires a valid bearer token in the `Authorization` header.
- **Headers:** `Authorization: Bearer <your_token>`
- **Response:**
  ```json
  {
    "message": "Welcome to the protected route!",
    "user": "johndoe"
  }
  ```
  *(Returns `401 Unauthorized` if token is missing, or `403 Forbidden` if invalid).*

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajneeshverma1/Flyrank-task.git
   cd Flyrank-task
   ```

2. **Run the server:**
   ```bash
   node server.js
   ```

3. **Test the endpoints:**
   You can visit the GET endpoints in your browser or use `curl`:
   
   **Ping Server:**
   ```bash
   curl http://localhost:3000/ping
   ```
   
   **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/register -d '{"username":"test","password":"123"}'
   ```
   
   **Login:**
   ```bash
   curl -X POST http://localhost:3000/login -d '{"username":"test","password":"123"}'
   ```
   
   **Access Protected Route:**
   ```bash
   curl -H "Authorization: Bearer <TOKEN_FROM_LOGIN>" http://localhost:3000/protected
   ```

## 📂 Project Structure

```
.
├── server.js      # Main server logic and routing
└── README.md      # Project documentation
```

---
*Created as part of the Flyrank Task submission.*
