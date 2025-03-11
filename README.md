This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Timer App

A React Native application for managing multiple timers across different categories with history tracking and customizable alerts.

## Features

- Create, edit, and delete timers
- Organize timers by categories
- Start, pause, and reset individual or all timers
- Track timer progress with visual indicators
- Optional halfway point alerts
- Timer completion history
- Persistent storage of timers and history

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd timer-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Install iOS dependencies:

```bash
cd ios
pod install
cd ..
```

4. Start the application:

```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## Development Assumptions

1. Timer Functionality

   - Timers can be organized by categories
   - Multiple timers can run simultaneously
   - Timers continue in background
   - Optional halfway alerts
   - Progress updates every second

2. Data Storage

   - Uses AsyncStorage for persistence
   - Maintains timer states across app restarts
   - Stores timer history locally

3. User Interface

   - Clean and intuitive design
   - Responsive layout
   - Visual progress indicators
   - Category-based organization

4. Performance
   - Efficient handling of concurrent timers
   - Smooth animations
   - Minimal battery impact

## Technical Implementation

1. State Management

   - Local state for UI components
   - AsyncStorage for data persistence

2. Components

   - Reusable common components
   - Screen-specific containers
   - Timer-specific components

3. Navigation

   - Stack navigation
   - Modal screens for add/edit

4. Styling
   - Consistent theming
   - Responsive design
   - Reusable styles
