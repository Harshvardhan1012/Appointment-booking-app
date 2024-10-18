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

   ## Preview

   1 **Login Page**
   
   ![Login-Page](https://github.com/user-attachments/assets/b8b0723d-2d89-4dde-914d-e2a736bc59ff)

   2.**Profile Page**

   ![Profile-Page](https://github.com/user-attachments/assets/b53b39d0-d50c-4e15-9c39-b7b13c29f8ab)

   3.**Appointment-scheduling-page**
   
    ![Appointment-booking-page](https://github.com/user-attachments/assets/b48cb94e-9231-4bea-bea9-52970bbebd63)

   4.**Success Page**
   
   ![Request-Submitted](https://github.com/user-attachments/assets/1fb5a10f-dc32-4584-b16e-e000b98519d7)

   5.**Admin Panel**

   
   


   
   
