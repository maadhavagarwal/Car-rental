import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import "../css/Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [code, setCode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  window.addEventListener("popstate", () => {
    localStorage.removeItem("isPopup");
    navigate("/");
  });

  const togglePass = () => {
    const passwordInput = document.getElementById("showPass");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  const handleAdmin = async () => {
    // const aid=document.getElementById("aid")
    // const hash=await bcryptjs.compare(aid.value,"$2a$10$74EMPXWHCudSkIXYz2ub6eMpmAqxkavSNYYmAY1w303Fp23GRAG4C")
    // if (hash) {
    //     toast.success("Valid admin code")
    //     setIsAdmin(true)
    // } else {
    //     toast.error("Invalid admin code")
    // }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const userInfo = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,
    };
    try {
      const res = await axios.post("http://localhost:4000/signup",{
        name:userInfo.name,
        phone:userInfo.phone,
        email:userInfo.email,
        password:userInfo.password
      }).then((res) =>{
        if (res.data) {
          toast.success("Signup successfull!");
          // localStorage.removeItem("isPopup");
          localStorage.setItem("auth-token", JSON.stringify(res.data.token));
          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("isAdmin", res.data.isAdmin);
          setIsAdmin(res.data.isAdmin);
          localStorage.setItem("id",res.data.id);
          localStorage.setItem("isPopup", true);
        

    }});
        setTimeout(() => {

          navigate("/");
          // window.location.relod(true)
        
        }, 500);
      }
    catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-3">
        <h1 style={{ textAlign: "center" }}>
          Register
        </h1>
      </div>
      <div className="mt-3">
        <form
          className="container form1"
          style={{ flexWrap: "wrap" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label>
            User Name:
            <input
              type="text"
              placeholder="Enter name"
              className="input"
              {...register("name", { required: true })}
            />
            <br />
            {errors.name && (
              <span style={{ fontSize: "small", color: "red" }}>
                This field is required!
              </span>
            )}
          </label>
          <label>
            Phone:
            <input
              type="number"
              placeholder="Phone"
              className="input"
              {...register("phone", { required: true })}
            />
            <br />
            {errors.phone && (
              <span style={{ fontSize: "small", color: "red" }}>
                This field is required!
              </span>
            )}
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
              className="input"
              {...register("email", { required: true })}
            />
            <br />
            {errors.email && (
              <span style={{ fontSize: "small", color: "red" }}>
                This field is required!
              </span>
            )}
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              className="input"
              id="showPass"
              {...register("password", { required: true })}
            />
            <br />
            {errors.password && (
              <>
                {" "}
                <span style={{ fontSize: "small", color: "red" }}>
                  This field is required!
                </span>{" "}
                <br />
              </>
            )}
          </label>

          <label style={{ marginTop: "3px" }}>
            Show password
            <input
              type="checkbox"
              className="cinput"
              style={{ cursor: "pointer",width:"25px"}}
              onClick={togglePass}
            />
          </label>
          <br />
          <button type="submit" className="submitButton">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
