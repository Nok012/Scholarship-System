import  { useState, useEffect } from "react";
import AppBarStudent from "./components/AppBarStudent";
import SignIn from "./components/SignIn";
import AppBarAdmin from "./components/AppBarAdmin";

function App() {
  
  const [role, setRole] = useState<String | null>("");
  const [token, setToken] = useState<String>("");
  // const [open, setOpen] = React.useState(true);
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setToken(token);
      setRole(role);
    }
  }, []);

  if (!token) {
    return <SignIn />;
  }


  return (
    <div>
       {(role == "นักศึกษา") ? <AppBarStudent/>: <AppBarAdmin/>}          
    </div>
  );
}

export default App;