# Sweat Equity Hub 🚀

A modern job platform connecting startups with talent through equity-based opportunities. Built with React, Node.js, Firebase, and Stripe.

## 🌟 Features

### For Talent
- **Browse Jobs**: Discover startup opportunities with equity compensation
- **Smart Applications**: Apply with cover messages and track application status
- **Dashboard**: Monitor all applications and their progress
- **Profile Management**: Showcase skills, experience, and CV

### For Employers
- **Job Posting**: Create detailed job listings with equity and salary details
- **Application Management**: Review and manage candidate applications
- **Subscription System**: Premium features with Stripe integration
- **Analytics**: Track job performance and application metrics

### Platform Features
- **Real-time Updates**: Firebase-powered real-time data synchronization
- **Email Notifications**: Automated notifications for applications and updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Dynamic meta tags and structured data
- **Skeleton Loading**: Smooth loading states for better UX

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin** - Server-side Firebase integration
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing

### Database & Services
- **Firebase Firestore** - NoSQL document database
- **Firebase Auth** - Authentication service
- **Firebase Storage** - File storage
- **Stripe** - Payment processing
- **EmailJS** - Email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sweat-equity-hub.git
   cd sweat-equity-hub
   ```

2. **Setup Frontend**
   ```bash
   cd Frontend
   npm install
   cp .env.example .env
   ```

3. **Setup Backend**
   ```bash
   cd ../Backend
   npm install
   cp .env.example .env
   ```

### Environment Configuration

#### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:3001
```

#### Backend (.env)
```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your_project.iam.gserviceaccount.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Running the Application

1. **Start Backend**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 📁 Project Structure

```
sweat-equity-hub/
├── Frontend/
│   ├── src/
│   │   ├── api/           # API services and state management
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components (shadcn/ui)
│   │   │   ├── employer/  # Employer-specific components
│   │   │   └── talent/    # Talent-specific components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── server.js      # Entry point
│   └── package.json
└── README.md
```

## 🔧 Key Components

### Authentication
- Firebase Authentication with email/password
- Role-based access (Talent/Employer)
- Protected routes and middleware

### Job Management
- CRUD operations for job postings
- Application tracking and status updates
- Real-time notifications

### Payment System
- Stripe integration for subscriptions
- Webhook handling for payment events
- Premium feature access control

### UI/UX
- Skeleton loading states
- Responsive design
- Accessible components
- Smooth animations

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd Frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd Backend
# Set environment variables
# Deploy with your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for the icon library
- [Firebase](https://firebase.google.com/) for backend services
- [Stripe](https://stripe.com/) for payment processing

## 📞 Support

For support, email support@sweatequityhub.com or join our Discord community.

---

Built with ❤️ for the startup ecosystem