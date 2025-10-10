# Eventify

A comprehensive event management system built with Laravel and React that allows users to create, manage, and participate in events.

## 🚀 Features

- **User Authentication**: Secure login and registration with email verification
- **Role-Based Access Control**: Different permissions for organizers and participants using Laratrust
- **Event Management**: Create, update, delete, and view events
- **Participant Registration**: Easy registration for events with email confirmations
- **Categories**: Organize events by categories
- **Media Upload**: Cloudinary integration for event images
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Real-time Notifications**: Toast notifications for user feedback
- **Email Notifications**: Automated email confirmations for registrations

## 🛠️ Tech Stack

### Backend
- **Laravel 10** - PHP web framework
- **PHP 8.1+** - Server-side scripting
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Laratrust** - Role and permission management
- **Cloudinary** - Media storage and optimization

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling with validation

## 📋 Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- MySQL or compatible database
- Cloudinary account (for media uploads)

## 🔧 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventify/backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials, mail settings, and Cloudinary configuration.

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start the Laravel server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend API URL.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Usage

### API Endpoints

#### Public Routes
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/events` - List all events
- `GET /api/event/{id}` - Get event details
- `GET /api/categories` - List event categories
- `POST /api/register-participant` - Register for an event

#### Protected Routes (Require Authentication)
- `GET /api/user` - Get current user info
- `POST /api/logout` - User logout
- `POST /api/create-event` - Create new event
- `PUT /api/update-event/{id}` - Update event
- `DELETE /api/delete-event/{id}` - Delete event

### User Roles

- **Participant**: Can view events and register for them
- **Organizer**: Can create, update, and manage their own events

## 📁 Project Structure

```
eventify/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/             # Eloquent Models
│   │   ├── Mail/               # Email templates
│   │   └── Providers/          # Service providers
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── routes/
│   │   └── api.php            # API routes
│   └── config/                # Configuration files
└── frontend/               # React SPA
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── features/          # Redux slices
    │   ├── layouts/           # Layout components
    │   ├── pages/             # Page components
    │   └── services/          # API services
    ├── public/                # Static assets
    └── package.json           # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email support@eventify.com or create an issue in the repository.