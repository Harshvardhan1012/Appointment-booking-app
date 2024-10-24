import { auth } from '@/app/auth';
import Dashboard from '@/components/forms/Dashboard';
import { profileFind } from '@/lib/action/profile.action';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();


  const { user } = session!;
  
  const profileExists = await profileFind(user.id!);
  
  if (profileExists) {
    redirect(`/profile/${user.id}/appointment-form`);
  }

  return (
    <div className="flex justify-center items-center min-h-screen mb-12 mt-20">
      <div className="w-[900px] justify-center items-center px-9 sm:px-6 md:px-8 lg:px-0">
        <section className="mb-12 space-y-4 w-full">
          <h1 className="header text-white">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <Dashboard user={user} />
      </div>
    </div>
  );
}
