import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Exit() {

    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        console.log(data)
      const rentInfo = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date:data.date,
        days:data.days
      };
      try {
        const res = await axios.post("http://localhost:4000/rent", {
          name:rentInfo.name,
          phone:rentInfo.phone,
          email:rentInfo.email,
          date:rentInfo.date,
          days:rentInfo.days
        

        });
        if (res.data) {
          toast.success("Vehical rented sucessfully!!");
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      } catch (error) {
        // toast.error(error.response.data.message);
        console.log(error);
      }
    };
  return (
    <div>
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
          <div className='d-flex justify-content-between fw-wrap'>
                <label className='w-50 me-3'>
                    Date of renting:
                    <input
                    type="date"
                    className="input"
                    {...register("date", { required: true })}
                    />
                    <br />
                    {errors.name && (
                    <span style={{ fontSize: "small", color: "red" }}>
                        This field is required!
                    </span>
                    )}
                </label>
                <label className='w-50 ms-3'>
                    Number of days:
                    <br/>
                    <select className='w-100' {...register("days", { required: true })}>
                        <option>1 day</option>
                        <option>2 days</option>
                        <option>3 days</option>
                        <option>4 days</option>
                    </select>
                </label>
          </div>
          <hr/>
          <div>
          <div>
      <strong>Note:-</strong>
      <ul>
        <li>Once the vehicle is handed to the customer, the customer will be responsible for everything.</li>
        <li>In case of any damage caused to the vehicle, the compensation must be given by the customer.</li>
        <li>If the vehicle is not returned on time, the owner may charge a penalty fee.</li>
      </ul>
      <div className="form-check" style={{ display: 'flex', alignItems: '' }}>
        <label className="form-check-label d-flex" style={{ marginRight: '50px' }}>
          I agree to all the terms and conditions:
        <input type="checkbox" className="form-check-input" style={{marginLeft:"0px", width:"20px",border:"2px solid black"}} />
        </label>
      </div>
    </div>
          </div>
          <div className='d-flex justify-content-between mt-5'>
          <button type="button" className="submitButton" onClick={()=>navigate('/rentnow')}>
            Go Back
          </button>
          <button type="submit" className="submitButton">
            Submit
          </button>
          </div>
        </form>
      </div>
    </div>
  )
}
