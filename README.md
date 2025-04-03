# User Management System

A modern web application for managing user data with features like authentication, user listing, editing, and deletion.

## Features

- User Authentication
- User Listing with Pagination
- Edit User Details
- Delete Users
- Responsive Design
- Modern UI/UX

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Build for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── Button/
│   └── Navbar/
├── pages/         # Page components
│   ├── LoginPage/
│   ├── UserListPage/
│   └── EditUser/
└── App.jsx        # Main application component
```

## Dependencies

- React (v19.0.0)
- React Router DOM (v7.4.1)
- Axios (v1.8.4)
- Material-UI components
- Other dependencies can be found in package.json

## Login Credentials

For testing purposes, use the following credentials:
- Email: eve.holt@reqres.in
- Password: cityslicka

## API Integration

This project uses the ReqRes API (https://reqres.in/) for demonstration purposes. The API endpoints used are:
- POST /api/login (Authentication)
- GET /api/users (User Listing)
- PUT /api/users/:id (User Update)
- DELETE /api/users/:id (User Deletion)

## Features in Detail

### Authentication
- Secure login system
- Token-based authentication
- Protected routes

### User Management
- View all users in a grid layout
- Edit user details (First Name, Last Name, Email)
- Delete users with confirmation
- Pagination for user list

### UI/UX Features
- Responsive design for all screen sizes
- Loading states and error handling
- Success messages for actions
- Confirmation modals for critical actions
- Modern and clean interface

## Browser Support

The application is tested and works on:
- Google Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

1. The ReqRes API is a mock API, so changes are not persisted to a real database
2. Some features use localStorage for data persistence
3. The API has a limited number of users (12 by default)

## Development Notes

- The project uses Vite as the build tool
- ESLint is configured for code quality
- CSS modules are used for styling components
- React Router v7 for navigation
- Axios for API requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
