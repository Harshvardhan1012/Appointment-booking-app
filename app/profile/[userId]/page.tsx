import { auth, signOut } from '@/app/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import Dashboard from '@/components/forms/Dashboard';


export default async function Page({ params }: { params: { userId: string } }) {
  // noStore();
  const { userId } = params;
  console.log("userId",typeof userId);  
  const session = await auth();
  

  
  if (Number(session?.user?.id) != Number(userId)) {
    redirect('/login');
  }
  const profile = await prisma.profile.findUnique({
    where: {
      userId: Number(userId)
    },
  }); 
  
  if(!profile){
  return (
    <div className="flex justify-center items-center min-h-screen mb-12 mt-14">
      <div className="w-[900px] justify-center items-center px-9 sm:px-6 md:px-8 lg:px-0">
        <section className="mb-12 space-y-4 w-full">
          <h1 className="header text-white">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
      <Dashboard userId={Number(userId)}/>
      </div>
    </div>
  )}
  else {
    redirect('/profile/' + userId+'/appointment-form');
  }
}
