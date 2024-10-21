import { redirect } from 'next/navigation';
import { auth } from './auth';
import RegisterPage from '@/components/forms/RegisterPage';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to the Appointment Booking App
      </h1>
      <p className="text-lg mb-4">Please select how you would like to login:</p>

      <div className="flex space-x-4">
        <Link
          href="/admin/register"
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Register as Admin
        </Link>

        <Link
          href="/login"
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Register as User
        </Link>
      </div>
    </div>
  );
}
