# Scholarship Portal Frontend 🎓

A modern, responsive scholarship search and application platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Deployment to EC2
```bash
# Build for production
npm run build

# Deploy to EC2 (requires SSH access)
chmod +x deploy-frontend-to-ec2.sh
./deploy-frontend-to-ec2.sh
```

## ✨ Features

### 🔍 **Scholarship Search**
- Advanced filtering (country, field, amount, deadline)
- Real-time search with pagination
- Sort by relevance, deadline, amount
- Responsive grid layout

### 👤 **User Management**
- JWT-based authentication
- Social login (Google)
- Profile management with photo upload
- Password reset functionality

### 📊 **User Dashboard**
- Saved scholarships
- Application tracking
- Profile completion status
- Quick stats overview

### 🎨 **UI/UX**
- Fully responsive design
- Modern interface with Tailwind CSS
- Smooth animations and transitions
- Accessible components

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first styling framework
- **Heroicons** - Beautiful icon library
- **React Select** - Enhanced select components

### Backend Integration
- **Django REST API** - Backend services
- **JWT Authentication** - Secure authentication tokens
- **File Upload** - Profile picture management
- **Email Verification** - AWS SES integration

## 🌐 Production Deployment

### Live URLs
- **Frontend**: http://13.61.181.192
- **API**: http://13.61.181.192/api/
- **Admin**: http://13.61.181.192/admin/

### Architecture
- **Frontend**: AWS EC2 with Nginx
- **Backend**: Django on EC2
- **Database**: PostgreSQL on AWS RDS

## 📋 API Integration

The frontend integrates with these backend endpoints:

- **Authentication**: `/api/auth/login/`, `/api/auth/register/`
- **Scholarships**: `/api/scholarships/`, `/api/scholarships/search/`
- **User Profile**: `/api/users/profile/`, `/api/users/saved/`
- **Filters**: `/api/scholarships/filters/`

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/nabin216/scholarship-scanner-frontend.git
   cd scholarship-scanner-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoints
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Visit `http://localhost:3000` to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── Authentication/     # Login, Register, Auth Context
│   ├── profile/           # User Dashboard, Settings
│   └── scholarships/      # Search, Details, Filters
├── components/            # Reusable UI Components
├── services/             # API Services
├── types/                # TypeScript Definitions
└── utils/                # Helper Functions
```

## 🚀 Recent Updates (July 2025)

### ✅ Latest Features
- Fixed TypeScript compilation errors
- Added Suspense boundaries for better UX
- Optimized for EC2 deployment
- Enhanced error handling
- Improved responsive design
- Updated API integration

### 🔧 Performance Optimizations
- Static generation for optimal loading
- Image optimization
- Code splitting
- Bundle size optimization

## 📞 Support

For issues and questions:
- 💬 GitHub Issues: [Create an issue](https://github.com/nabin216/scholarship-scanner-frontend/issues)
- 📧 Email: nabin216@example.com

## 📄 License

This project is licensed under the MIT License.

---

**🎯 Ready for production deployment!** 
Live at: http://13.61.181.192
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.