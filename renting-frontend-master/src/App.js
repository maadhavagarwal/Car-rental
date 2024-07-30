import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import RentNow from "./components/RentNow";
import Exit from "./components/Exit"; 
import Signup from "./components/Signup";
import Myrents from "./components/Myrents";
import Recipt from "./components/Recipt";
import AddVehical from "./components/AddVehical";
import { Toaster } from "react-hot-toast";
import Main from "./components/main";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main/>} extact></Route>{/**Done */}
          <Route path="/carrent" element={<Home/>} extact></Route>{/**Done */}
          <Route path="/rentnow/:id" element={<RentNow/>} extact></Route>{/**Done */}
          <Route path="/exit/:id" element={<Exit/>} extact></Route>{/**Done */}
          <Route path="/signup" element={<Signup/>} extact></Route>{/**Done */}
          <Route path="/myrents" element={<Myrents/>} extact></Route>
          <Route path="/recipt/:id" element={<Recipt/>} extact></Route>
          <Route path="/addvehical" element={<AddVehical/>} extact></Route>
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </div>
  );
}

export default App;
