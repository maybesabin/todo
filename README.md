# 📋 Fullstack Todo Web App

A simple and powerful Todo Web Application built with a modern Fullstack setup.

---

## 🚀 Features
- Add, update, delete tasks with admin dashboard
- Persistent storage (backend with database)
- Responsive UI
- Separate Frontend and Backend architecture
- Clean and scalable code structure

---

## 🛠 Tech Stack

### Frontend
- **React.js** (UI Library)
- **Vite** (React Fast Setup)
- **Tailwind CSS** (Styling)
- **Axios** (API Calls)
- **React Router** (Routing)

### Backend
- **Node.js** (Runtime Environment)
- **Express.js** (Server Framework)
- **MongoDB** (Database)
- **Mongoose** (MongoDB ORM)

---

## 📂 Project Structure
```
root/
|
├── backend/   # Express server and API routes
|
├── frontend/  # React frontend
|
└── README.md  # Project Documentation (you're here)
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/maybesabin/todo.git
cd todo
```

---

### 2. Setting up the Backend

```bash
cd backend
npm install
```

- Create a `.env` file in `/backend` and add:
  ```
  MONGO_URI = your_mongodb_connection_string
  PORT = 3000
  ```

- Start the server:
  ```bash
  npm start
  ```

> Backend will run on **http://localhost:3000**

---

### 3. Setting up the Frontend

```bash
cd frontend
npm install
```

- Create a `.env` file in `/frontend` and add:
  ```
  VITE_BACKEND_URI = your_backend_url
  VITE_GEMINI_API_KEY = your_gemini_api_key
  ```

- Start the React app:
  ```bash
  npm run dev
  ```

> Frontend will run on **http://localhost:5173**

---

## 🔗 API Endpoints (Backend)

| Method | Endpoint            | Description            |
| :----- | :------------------ | :--------------------- |
| GET    | `/api/task`         | Get all todos          |
| POST   | `/api/task`         | Create a new todo      |
| PUT    | `/api/task/:taskId` | Update a specific todo |
| DELETE | `/api/task/:taskId` | Delete a specific todo |
| GET    | `/api/task/search`  | Search specific tasks  |
| POST   | `/api/user/login`   | Login as user          |
| POST   | `/api/user/signup`  | Signup as user         |
| GET    | `/api/user/profile` | Get user details       |
| POST   | `/api/admin/login`  | Login as admin         |

---

## 📸 Screenshots
![User Interface](./frontend/src/assets/screenshot%202.png)

![Admin Interface](./frontend/src/assets/screenshot%201.png)

---

## 📞 Contact
Feel free to connect with me!

- GitHub: [maybesabin](https://github.com/maybesabin)
- LinkedIn: [sabinhamal](https://linkedin.com/in/sabinhamal)
- Email: highsabin987@gmail.com


