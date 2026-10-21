import Footer from "@/components/user/footer";
import HeaderUser from "@/components/user/HeaderUser";
import { Outlet } from "react-router-dom";

export default function UserLayout (){
    return(
        <div>
            <HeaderUser/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}