# 🎓 QuizMaster - AI-Powered Quiz Platform

A modern, secure online quiz platform with **AI-powered question generation** and **anti-cheating features**.

![QuizMaster](https://img.shields.io/badge/QuizMaster-v1.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Groq](https://img.shields.io/badge/Groq-AI-orange)

---

## ✨ Features

### 🤖 AI-Powered Quiz Generation
- Generate complete quizzes from topics or study notes
- Powered by **Groq AI** (Llama 3.1 70B)
- Customizable difficulty levels (Easy, Medium, Hard)
- Unlimited questions support
- Ultra-fast generation (~5-15 seconds)

### 🔒 Anti-Cheating System
- **Full-screen enforcement** during quiz attempts
- **Tab switching detection** with violation warnings
- **3-strike automatic submission** policy
- **Copy/paste/right-click disabled**
- Real-time monitoring and alerts

### 👨‍🏫 For Teachers/Creators
- Create quizzes manually or with AI assistance
- Share quizzes via unique links
- Set time limits (Valid From/Until)
- Toggle quiz active/inactive status
- View detailed analytics and metrics
- Export results to CSV
- Track individual student performance

### 👨‍🎓 For Students/Takers
- One-time quiz attempts (no retakes)
- Instant score feedback
- Clean, distraction-free interface
- Mobile-responsive design
- Secure authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)
- Groq API key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dhinesh71/quizz-master.git
cd quizz-master
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq AI Configuration (for AI quiz generation)
VITE_GROQ_API_KEY=gsk_your-groq-api-key
```

**Get your credentials:**
- **Supabase**: https://supabase.com/dashboard → Settings → API
- **Groq**: https://console.groq.com → API Keys

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

---

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user guide for teachers and students
- **[AI_FEATURE_GUIDE.md](AI_FEATURE_GUIDE.md)** - Detailed AI quiz generation documentation

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling (via inline classes)
- **Lucide React** - Icon library

### Backend & Services
- **Supabase** - Database, authentication, and real-time features
  - PostgreSQL database
  - Row Level Security (RLS)
  - Google OAuth integration
- **Groq AI** - AI quiz generation
  - Llama 3.1 70B Versatile model
  - Ultra-fast inference

### Database Schema
- `quizzes` - Quiz metadata and settings
- `questions` - Quiz questions and answers
- `responses` - Student submissions and scores

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository

3. **Add Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GROQ_API_KEY`

4. **Configure Supabase**

Add your Vercel URL to Supabase:
- Dashboard → Authentication → URL Configuration
- Add your Vercel URL to **Redirect URLs**

5. **Deploy**
- Vercel will automatically deploy your app
- Your app will be live at `https://your-app.vercel.app`

---

## 📖 Usage

### For Teachers

1. **Sign up** with email or Google
2. **Create a quiz**:
   - Click "Generate with AI" for instant quiz creation
   - OR manually add questions
3. **Configure settings** (time limits, active status)
4. **Share the quiz link** with students
5. **View results** and export data

### For Students

1. **Open the quiz link** from your teacher
2. **Enter your details** (name, email, register number)
3. **Read anti-cheating rules**
4. **Start quiz** (full-screen mode required)
5. **Submit** and view your score

---

## 🔐 Security Features

- **Row Level Security (RLS)** on all database tables
- **One-time quiz attempts** per student
- **Anti-cheating monitoring** during quiz
- **Secure authentication** via Supabase Auth
- **Environment variable protection**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues

- Supabase URL configuration must be verified before deployment
- Full-screen API may not work on all mobile browsers
- AI generation requires valid Groq API key

---

## 🔮 Roadmap

- [ ] True/False question support
- [ ] Multiple correct answers
- [ ] Image-based questions
- [ ] PDF quiz export
- [ ] Bulk quiz generation from PDFs
- [ ] Multi-language support
- [ ] Question bank/library
- [ ] Quiz templates

---

## 📞 Support

For issues or questions:
- Check the [USER_GUIDE.md](USER_GUIDE.md)
- Check the [AI_FEATURE_GUIDE.md](AI_FEATURE_GUIDE.md)
- Open an issue on GitHub
- Contact: [Your Email/Support Link]

---

## 👨‍💻 Author

**Dhinesh**
- GitHub: [@Dhinesh71](https://github.com/Dhinesh71)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Groq](https://groq.com) - AI inference
- [Vite](https://vitejs.dev) - Build tool
- [React](https://react.dev) - UI framework
- [Lucide](https://lucide.dev) - Icons

---

**Made with ❤️ for educators and students**
