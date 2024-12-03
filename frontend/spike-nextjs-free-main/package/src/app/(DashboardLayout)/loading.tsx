
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";

const Loading = () => {
    const token = cookies().get("token")
    console.log(token)
    if(!token || token.value === "") {
        redirect("/authentication/login")
    }
//   const [cookies] = useCookies(["token"]);
//   const router = useRouter();

//   useEffect(() => {
//     if (!cookies.token || cookies.token === "") {
//       router.push("/authentication/login"); 
//     }
//   }, [cookies.token, router]); 

  return <div>Loading</div>;
};

export default Loading;
