# Student Info App

A Vue.js 3 single-page application demonstrating fundamental web development concepts including component architecture, state management, client-side routing, and API integration.

## 🚀 Features

- **Component Architecture**: Reusable Vue components with props and state management
- **Client-Side Routing**: Navigation between pages using Vue Router without page reloads
- **API Integration**: Fetches and displays data from external REST API (JSONPlaceholder)
- **Interactive UI**: Button interactions with state updates and visual feedback
- **Error Handling**: Loading states and user-friendly error messages
- **Comprehensive Testing**: Unit tests and property-based tests using Vitest and fast-check

## 📋 Requirements Met

This application fulfills the following requirements:

### ✅ Requirement 1: Project Setup and Structure
- Vue.js 3 application with organized folder structure
- Proper naming conventions and best practices
- Runs successfully in web browser without errors

### ✅ Requirement 2: Component Architecture
- **HeaderComponent**: Displays application header with navigation
- **StudentComponent**: Displays individual student data with props (name, course, year)
- Proper component state management

### ✅ Requirement 3: User Interaction
- Interactive button with click event handlers
- Dynamic state updates reflected in UI

### ✅ Requirement 4: Client-Side Routing
- Vue Router with two pages: Home and Students
- Navigation without full page reload (SPA behavior)
- URL updates reflect current route

### ✅ Requirement 5: API Data Fetching
- Fetches data from JSONPlaceholder API
- Loading indicators during data fetch
- Error handling with user-friendly messages
- Data parsing and state management

### ✅ Requirement 6: Data Display
- Clear display of student information (name, course, year)
- Consistent formatting for list items
- Readable and organized layout

### ✅ Requirement 7: Error Handling and User Feedback
- Loading state indicators
- Error messages for failed API requests
- Clear visual feedback for state transitions

### ✅ Requirement 8: Code Quality and Standards
- Consistent naming conventions
- Vue.js best practices and conventions
- No console errors or warnings
- Proper separation of concerns

## 🛠️ Technology Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Testing**: Vitest + Vue Test Utils + fast-check
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

```
student-info-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable Vue components
│   │   ├── HeaderComponent.vue
│   │   ├── HeaderComponent.test.js
│   │   ├── StudentComponent.vue
│   │   └── StudentComponent.test.js
│   ├── pages/             # Page-level components
│   │   ├── HomePage.vue
│   │   ├── HomePage.test.js
│   │   ├── StudentsPage.vue
│   │   └── StudentsPage.test.js
│   ├── router/            # Vue Router configuration
│   │   ├── index.js
│   │   ├── index.test.js
│   │   └── navigation.property.test.js
│   ├── services/          # API and business logic
│   │   ├── apiService.js
│   │   └── apiService.test.js
│   ├── App.vue            # Root component
│   ├── main.js            # Application entry point
│   └── style.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd student-info-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📜 Available Scripts

### Development

- **`npm run dev`** - Start the development server with hot module replacement
- **`npm run build`** - Build the application for production (output in `dist/` folder)
- **`npm run preview`** - Preview the production build locally

### Testing

- **`npm run test`** - Run all tests once (unit tests and property-based tests)
- **`npm run test:watch`** - Run tests in watch mode (re-runs on file changes)
- **`npm run test:coverage`** - Run tests and generate coverage report

## 🧪 Testing Strategy

The application uses a comprehensive testing approach:

### Unit Tests
- Test specific component behavior and edge cases
- Verify correct rendering with props
- Test event handlers and state updates
- Mock API calls for predictable testing

### Property-Based Tests
- Use fast-check to generate random test data
- Verify universal properties hold across all inputs
- Test with 100+ iterations per property
- Cover scenarios like:
  - Props rendering correctly for any valid data
  - Button interactions updating state
  - Navigation without page reloads
  - API data transformation
  - Loading and error states

## 🎯 Key Components

### HeaderComponent
Displays the application header with navigation links to Home and Students pages.

**Props**: None

### StudentComponent
Displays individual student information in a card format.

**Props**:
- `name` (String, required) - Student's full name
- `course` (String, required) - Course or program
- `year` (String, required) - Year or program identifier

### HomePage
Landing page with welcome message and interactive button demonstrating event handling.

### StudentsPage
Fetches and displays a list of students from the JSONPlaceholder API with loading and error states.

## 🌐 API Integration

The application fetches data from:
- **Endpoint**: `https://jsonplaceholder.typicode.com/users`
- **Transformation**: User data is mapped to student format:
  - `name` → Student name
  - `email` → Course
  - `company.name` → Year/Program

## 🎨 Features Demonstrated

1. **Vue 3 Composition API** - Modern Vue.js development with `<script setup>` syntax
2. **Reactive State Management** - Using `ref()` for reactive data
3. **Component Props** - Passing data between components
4. **Event Handling** - Button clicks and user interactions
5. **Lifecycle Hooks** - `onMounted()` for data fetching
6. **Conditional Rendering** - `v-if`, `v-else` for dynamic UI
7. **List Rendering** - `v-for` with proper `:key` binding
8. **Client-Side Routing** - SPA navigation with Vue Router
9. **Async/Await** - Modern JavaScript for API calls
10. **Error Handling** - Try/catch blocks and user feedback

## 🔧 Configuration

### Vite Configuration
The project uses Vite for fast development and optimized builds. Configuration includes:
- Vue plugin for SFC support
- Vitest integration for testing
- jsdom environment for component testing

### Router Configuration
- HTML5 history mode for clean URLs
- Two routes: `/` (Home) and `/students` (Students)

## 📝 Development Notes

- The application follows Vue.js best practices and conventions
- Components use scoped styles to prevent CSS conflicts
- All components are tested with both unit and property-based tests
- The codebase maintains consistent naming conventions
- Error handling ensures a good user experience

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code style and conventions
2. Write tests for new features
3. Ensure all tests pass before submitting changes
4. Update documentation as needed

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with Vue.js 3 and Vite
- Uses JSONPlaceholder for demo API data
- Testing powered by Vitest and fast-check
