

# 🏥 Medicare – HealthLock

### Secure Hospital Management System (MERN Stack)

Medicare – HealthLock is a **secure and scalable Hospital Management System** designed to digitally manage hospital operations while ensuring **data privacy, controlled access, and transparency**.
It simplifies patient records, doctor management, admissions, and room allocation through a modern **REST-based backend architecture**.

---

## 🚀 Features

* 👨‍⚕️ **Patient Management**
  Create, update, and manage patient medical records securely.

* 🩺 **Doctor & Department Management**
  Maintain doctor profiles and assign them to departments.

* 🛏️ **Admission & Room Allocation**
  Track patient admissions and manage hospital rooms efficiently.

* 🔐 **HealthLock Security Layer**
  Protect sensitive health data with controlled access and authentication.

* 👥 **Role-Based Access Control (RBAC)**
  Different access levels for Admin, Doctor, and Hospital Staff.

* 🌐 **RESTful APIs**
  Clean and scalable APIs for frontend and third-party integration.

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**

### Frontend

* **React.js**

### Security & Tools

* **JWT Authentication**
* **Environment Variables (.env)**
* **Git & GitHub**

---

## 📁 Project Structure

```
medicare-mern/
│
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Patient.js
│   │   │   ├── Doctor.js
│   │   │   ├── Department.js
│   │   │   ├── Admission.js
│   │   │   └── Room.js
│   │   │
│   │   ├── routes/
│   │   │   ├── patients.js
│   │   │   ├── doctors.js
│   │   │   ├── departments.js
│   │   │   ├── admissions.js
│   │   │   └── rooms.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   └── README.md
│
├── package.json
└── package-lock.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/saurav688/medicare-mern.git
cd medicare-mern
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## 🔐 API Modules

* `/api/patients` – Patient records
* `/api/doctors` – Doctor management
* `/api/departments` – Department handling
* `/api/admissions` – Patient admissions
* `/api/rooms` – Room allocation

---

## 📌 Use Cases

* Hospitals & Clinics
* Medical Colleges
* Healthcare Startups
* Secure Digital Health Platforms

---

## 🌱 Future Enhancements

* 🔒 End-to-End Encryption for medical records
* 📊 Admin analytics dashboard
* ⛓️ Blockchain-based audit logs (HealthLock)
* 📱 Mobile App Integration
* 🧠 AI-based health insights

---

## 👨‍💻 Author

**Sourav Tiwari**
Backend Developer | MERN Stack | Healthcare Systems

📫 *Feel free to connect and contribute!*



