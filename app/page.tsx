import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-blue-50 rounded-xl shadow-2xl p-10 max-w-lg text-center border-t-4 border-blue-400">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
          Welcome to the <span className="text-blue-500">Appointment</span> Booking App
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Please select how you would like to proceed:
        </p>

        <div className="flex space-x-4 justify-center">
          <Link href="/admin/register">
            <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-lg shadow-lg transition duration-200 hover:from-green-600 hover:to-green-800 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 w-full">
              Register as Admin
            </Button>
          </Link>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-lg transition duration-200 hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
              Register as User
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
