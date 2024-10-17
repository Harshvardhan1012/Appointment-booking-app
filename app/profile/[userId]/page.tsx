import { auth } from '@/app/auth';
import Dashboard from '@/components/forms/Dashboard';



export default async function Page() {
  
  // console.log("userId", userId);
  const session = await auth();
  
  // if (Number(session?.user?.id) != Number(userId)) {
  //   //page not found redirect
  //   redirect('/login');
  // }
  // const profile=await profilefind(Number(userId));
    // console.log(session,"session2349234324894988324983243298498324");

  // if(profile){
  //   redirect('/profile/'+userId+'/appointment-form');
  // }
  if(session)
    return (
      <div className="flex justify-center items-center min-h-screen mb-12 mt-20">
        <div className="w-[900px] justify-center items-center px-9 sm:px-6 md:px-8 lg:px-0">
          <section className="mb-12 space-y-4 w-full">
            <h1 className="header text-white">Welcome</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
          </section>
          <Dashboard user={session?.user}/>
        </div>
      </div>
    )
  }


