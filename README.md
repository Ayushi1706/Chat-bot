#  AI Chatbot

A full-stack AI chatbot application built with React, Node.js, and MongoDB. Supports real-time conversations, PDF uploads, dark/light mode, and more.

## 🌐 Live Demo

- **Frontend**: [chat-bot-ebon-two.vercel.app](https://chat-bot-ebon-two.vercel.app)
- **Backend**: [chatbot-backend-ndva.onrender.com](https://chatbot-backend-ndva.onrender.com)

---

## ✨ Features

- 🔐 User authentication (signup, login, JWT)
- 💬 AI-powered chat using Groq (LLaMA 3.3)
- 📄 PDF upload + chat with PDF content
- 🗂️ Conversation history (create, rename, delete)
- 🔍 Search conversations
- 👤 Profile management (edit name, change password)
- 🌙 Dark / Light mode toggle
- 📋 Copy message button
- ✍️ Typing effect for AI responses
- 📝 Markdown rendering
- 📱 Mobile responsive
- ⚡ Loading skeletons

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- React Markdown
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Groq SDK (LLaMA 3.3)
- Cloudinary (file storage)
- Multer (file uploads)
- pdf-parse (PDF text extraction)
- bcryptjs

---

## 📁 Project Structure

```
Chat-bot/
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   └── multer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── conversationController.js
│   │   ├── pdfController.js
│   │   ├── searchController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Conversation.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── conversation.js
│   │   ├── pdf.js
│   │   ├── search.js
│   │   └── user.js
│   └── index.js
└── Frontend/
    ├── public/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── Skeleton.jsx
        │   └── ThemeToggle.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ConversationContext.jsx
        │   └── ThemeContext.jsx
        └── pages/
            ├── Chat.jsx
            ├── Login.jsx
            ├── Profile.jsx
            └── Signup.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key
- Cloudinary account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

Start the frontend:
```bash
npm start
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/password` | Change password |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get all conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/:id` | Get single conversation |
| PUT | `/api/conversations/:id/rename` | Rename conversation |
| DELETE | `/api/conversations/:id` | Delete conversation |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message |

### PDF
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pdf/upload` | Upload PDF |
| POST | `/api/pdf/chat` | Chat with PDF |

---

## 🌍 Deployment

- **Frontend** deployed on [Vercel](https://vercel.com)
- **Backend** deployed on [Render](https://render.com)
- **Database** hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Files** stored on [Cloudinary](https://cloudinary.com)

---

## 👩‍💻 Author

**Ayushi Singh**  
[GitHub](https://github.com/Ayushi1706)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
