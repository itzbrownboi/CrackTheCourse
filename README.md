# CrackTheCourse 🎓

CrackTheCourse is a web application that connects university students with tutors offering help in specific courses. Tutors can list the classes they teach, and students can search for help based on their weak subjects — all from a clean and user-friendly interface.

Live Demo: [https://crackthecourse.onrender.com](https://crackthecourse.onrender.com)  
(Note: May take 30–60 seconds to wake if inactive due to Render free tier)

---

## 💡 Features

- 🔐 Secure login & signup system
- 🧑‍🏫 Role-based profiles (Student, Tutor, Admin)
- 📚 Search tutors by course
- 💬 Messaging system between students and tutors
- 💌 Like & request tutors
- ⭐ Rate tutors
- 🔄 Edit profile info with dynamic form fields
- 🎓 Education-level tagging
- 📦 MongoDB database (hosted on MongoDB Atlas)
- 🐳 Docker-ready deployment

---

## 📁 Project Structure

```
crack-the-course-app/
├── public/              # Frontend HTML/CSS/JS
│   ├── css/
│   ├── js/
│   ├── images/
│   └── welcome.html
├── routes/              # Backend route logic
├── .env                 # MongoDB connection string (excluded from Git)
├── Dockerfile           # For containerized deployment
├── server.js            # Main server logic
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/itzbrownboi/CrackTheCourse.git
cd CrackTheCourse
cd crack-the-course-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File to connect MongoDB

```env
MONGODB_URI=your-mongodb-uri-here
```

Make sure you have connected to MongoDB Atlas and have URI 
> Don’t expose your MongoDB URI publicly. This file is excluded from version control.

### 4. Run the Server Locally

```bash
node server.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Deploying with Docker

### 1. Build the Docker Image

```bash
docker build -t crackthecourse .
```

### 2. Run the Docker Container

```bash
docker run -p 3000:3000 crackthecourse
```

---

## User Roles

| Role    | Access Features                           |
|---------|-------------------------------------------|
| Student | Search tutors, like/request, chat, edit profile |
| Tutor   | List courses taught, receive requests, chat |
| Admin   | Delete tutors from database |

---

## 🔧 Technologies Used

- Node.js + Express.js
- MongoDB (via MongoDB Atlas)
- HTML/CSS/Vanilla JS
- Docker (for containerized deployment)
- bcrypt (for secure password hashing)
- render (for live deployment)

---

## 📌 Future Improvements

- Intelligent tutor matching (based on ratings & tags)
- Booking system & availability calendars
- Video integration (Zoom or Jitsi)
- Admin dashboard & moderation

---

## 🤝 Team

- Ebun Makinde
- Erioluwa Soyemi
- Elizabeth Adeyemo
- Favour Adah
- Jane Magai
- Pratham Pandey
