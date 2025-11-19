import { BrowserRouter, Route, Routes } from "react-router-dom";
import  ToDoHome  from "./todo-home";
import  ToDoUserDashboard  from "./todo-user-dashboard";
import { ToDoAddAppointment } from "./todo-add-appointment";
import { ToDoEditAppointment } from "./todo-edit-appointment";

export function ToDoIndex(){
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ToDoHome />} />
                    <Route path="user-dashboard" element={<ToDoUserDashboard />} />
                    <Route path="add-appointment" element={<ToDoAddAppointment />} />
                    <Route path="edit-appointment/:id" element={<ToDoEditAppointment />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}