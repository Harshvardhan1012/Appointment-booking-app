"use server"
import { revalidatePath, revalidateTag } from "next/cache"
const clearCachesByServerAction = async(path:string) => {
try {
  if (path) {

     revalidateTag(path);
    
    } 
else {
  revalidatePath("/")
  revalidatePath("/[lang]")
}
} catch (error) {
  console.error("clearCachesByServerAction=> ", error)
}
}
export default clearCachesByServerAction