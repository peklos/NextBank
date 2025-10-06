import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function PrivateLayout() {
    return (
        <div>
            <Header></Header>
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    )
}