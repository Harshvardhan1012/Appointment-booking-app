# Appointment Booking App

This is a **Full Stack Appointment Booking Application** built using **Next.js**. It provides a seamless interface for users to book appointments and allows admins to schedule or cancel appointments. The app supports two distinct user roles: **User** and **Admin**.

## Deployment
The application is deployed on Vercel. You can access the live application clicking [here](https://appointment-booking-app-two.vercel.app/):



## Features

- **User Role**:
  - Book an appointment with available admins (e.g., doctors).

- **Admin Role**:
  - View all user appointments.
  - Schedule, or cancel appointments.
  - Manage availability for users.

## Tech Stack

- **Frontend and backend**: [Next.js](https://nextjs.org/) (React Framework)
- **Authentication**: [NextAuth](https://next-auth.js.org/)
- **Database**: Postgres
- **Deployment**: [Vercel](https://vercel.com)

## Setup Instructions

To get started with this project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Harshvardhan1012/Appointment-booking-app.git
    ```

2. **Install dependencies**:
    Navigate to the project directory and install the required dependencies:
    ```bash
    cd appointment-booking-app
    npm install
    ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory with the help of .env.example file in the root directory


4. **Migrate the schema**:
   ```bash
   npx prisma migrate dev
   ```
   
5. **Run the application: Start the development server:**:
   ```bash
   npm run dev
   ```
   