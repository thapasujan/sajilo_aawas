# 📌 Sajilo Aawas — Backend API

**Sajilo Aawas** is an online room and rental management platform designed to connect tenants and property owners directly.
The backend API provides REST endpoints for user authentication, property listings, search, and recommendation logic powered by machine learning. ([GitHub][1])

---

## 🧾 Table of Contents

1. 📌 About
2. 🛠 Tech Stack
3. ⚙️ Features
4. 📋 Prerequisites
5. 🚀 Installation
6. 🔐 Environment Variables
7. ▶️ Run Locally
8. 🧪 Testing API Endpoints
9. 📁 Project Structure
10. 🚀 Deployment
11. 🤝 Contributing
12. 📝 License
13. 📬 Contact

---

## 📌 About

The **Backend API** handles core functionalities such as:

* User signup/login
* Property data management
* Search & filter
* Rental recommendations
* Authentication & authorization ([GitHub][1])

It’s built to support the frontend and mobile clients.

---

## 🛠 Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Runtime         | Node.js                 |
| Language        | JavaScript / TypeScript |
| Framework       | Express.js              |
| Database        | (Configured in `.env`)  |
| API Format      | REST                    |
| Version Control | GitHub                  |

The repository includes both JavaScript and TypeScript files to support different use cases. ([GitHub][1])

---

## ⚙️ Features

✔ Secure authentication
✔ Property endpoints (CRUD)
✔ Recommendation engine integration
✔ Clean route handling
✔ Middleware support
✔ Environment-based configuration
✔ Easy to extend and test

---

## 📋 Prerequisites

Before you begin, make sure you have installed:

✔ **Node.js** (v14 or above)
✔ **npm** (comes with Node.js)
✔ A **MongoDB / PostgreSQL / SQL* database** (depending on your project setup)

You can check your versions:

```bash
node -v
npm -v
```

---

## 🚀 Installation

1️⃣ Clone the repo:

```bash
git clone https://github.com/thapasujan/sajilo_aawas_backend.git
```

2️⃣ Navigate into the project:

```bash
cd sajilo_aawas_backend
```

3️⃣ Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a file named:

```
.env
```

Use the provided `.env.example` as a reference:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values.
Example variables might include:

```env
PORT=5000
DB_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

📌 **Important:** `.env` is ignored in Git and should NOT be committed. — this keeps your credentials secure.

---

## ▶️ Run Locally

To start the development server:

```bash
npm run dev
```

or

```bash
npm start
```

You should see logs showing the server running at:

```
http://localhost:5000
```

---

## 🧪 Testing API Endpoints

You can test using the following tools:

✔ **Postman**
✔ **Insomnia**
✔ **VSCode REST Client** (test.rest included)

Example request with Postman:

```
GET http://localhost:5000/api/properties
```

Adjust routes depending on your project’s base path.

---

## 📁 Project Structure

```
sajilo_aawas_backend/
├── controller/
├── crud-operation/
├── middleware/
├── model/
├── routes/
├── real-time/
├── utils/
├── .env.example
├── .gitignore
├── package.json
├── server.js / server.ts
├── db.js / db.ts
└── test.rest
```

---

## 🚀 Deployment

You can deploy this API to platforms like:

✔ **Heroku**
✔ **Render**
✔ **Railway**
✔ **Vercel (Serverless)**

Ensure environment variables are set on the host platform.

---

## 🤝 Contributing

We welcome contributions! Steps to contribute:

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push to your fork:

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

## 📝 License

This project uses the **MIT License**.

See `LICENSE` for more details.

---

## 📬 Contact

👤 **Sujan Thapa**

* GitHub: [https://github.com/thapasujan](https://github.com/thapasujan)
* Email: thapasujan1025@gmail.com

---

⭐ If you find this project useful, please **star ⭐ the repository**!
