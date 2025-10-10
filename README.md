# Eventify - Full Stack Event Management Platform

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Welcome to **Eventify**, a full-stack application for discovering, creating, and managing events. This repository contains the complete source code for the project, split into a Laravel-powered backend and a modern JavaScript frontend.

## Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## About The Project

Eventify is designed to be a one-stop solution for event management. It provides a RESTful API to handle all the core logic and a separate, decoupled frontend to deliver a seamless user experience.

**Core Features:**
*   User authentication and authorization.
*   Event creation, management, and discovery.
*   Ticket booking and management.
*   Media uploads and management via Cloudinary.

## Tech Stack

This project is built with a modern and robust set of technologies:

*   **Backend (`/backend`)**
    *   Laravel: A PHP framework for web artisans.
    *   Laravel Breeze: For API authentication scaffolding.
    *   Cloudinary: For cloud-based image management.
    *   MySQL / PostgreSQL: As the primary database.

*   **Frontend (`/frontend`)**
    *   A modern JavaScript framework (e.g., React, Vue, or Angular).
    *   Node.js & npm: For package management and running the development server.

## Project Structure

The repository is organized into two main directories:

```
Eventify/
├── backend/      # Contains the Laravel API
├── frontend/     # Contains the JavaScript client application
└── README.md     # You are here!
```

## Getting Started

Follow these instructions to get a local copy of the project up and running on your machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed:

*   PHP >= 8.1
*   Composer
*   Node.js (which includes npm)
*   A database server (e.g., MySQL, PostgreSQL)

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/eventify.git
    cd eventify
    ```

2.  **Set up the Backend**
    Navigate into the backend directory and follow the setup steps.
    ```sh
    cd backend
    
    # Install PHP dependencies
    composer install
    
    # Create and configure your environment file
    cp .env.example .env
    
    # Open .env and set your DB_ and CLOUDINARY_ credentials
    
    # Generate an application key
    php artisan key:generate
    
    # Run database migrations and seeders
    php artisan migrate --seed
    ```

3.  **Set up the Frontend**
    Navigate into the frontend directory from the project root.
    ```sh
    cd ../frontend 
    
    # Install JavaScript dependencies
    npm install
    
    # You may need to create a .env file for the frontend as well
    # cp .env.example .env 
    # Then, configure variables like the API URL
    ```

## Usage

You will need to run both the backend and frontend servers simultaneously in separate terminal windows.

1.  **Run the Backend Server** (from the `/backend` directory)
    ```sh
    php artisan serve
    ```
    The API will be available at `http://127.0.0.1:8000`.

2.  **Run the Frontend Development Server** (from the `/frontend` directory)
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port specified by your setup).

## API Endpoints

The backend provides a stateless RESTful API. For a full list of available API routes, you can run the following command from the `/backend` directory:

```sh
php artisan route:list
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please see the `CONTRIBUTING.md` file for details.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.