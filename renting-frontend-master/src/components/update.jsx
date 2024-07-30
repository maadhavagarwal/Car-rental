import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.vname);
    formData.append("color", data.vno);
    formData.append("new_price", data.rent);
    formData.append("category", data.year);
    formData.append("description", data.days);
    formData.append("zip", data.address);
    formData.append("image", file);
    formData.append("user", localStorage.getItem("id"));

    try {
      const res = await axios.patch(`http://localhost:4000/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Vehicle updated successfully!");
        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <div className="mt-3">
        <form className="container form1" style={{ flexWrap: "wrap" }} onSubmit={handleSubmit(onSubmit)}>
          <label>
            Vehicle Name:
            <input type="text" placeholder="Enter name" className="input" {...register("vname", { required: true })} />
            {errors.vname && <span style={{ fontSize: "small", color: "red" }}>This field is required!</span>}
          </label>
          <label>
            Vehicle Color:
            <input type="text" placeholder="Color" className="input" {...register("vno", { required: true })} />
            {errors.vno && <span style={{ fontSize: "small", color: "red" }}>This field is required!</span>}
          </label>
          <div className='d-flex justify-content-between fw-wrap'>
            <label className='w-50 me-3'>
              Year:
              <select className='w-100' {...register("year", { required: true })}>
                <option>2024</option>
                <option>2023</option>
                {/* Add more year options here */}
              </select>
            </label>
            <label className='w-50 ms-3'>
              Vehicle Type:
              <select className='w-100' {...register("days", { required: true })}>
                <option>2 Wheeler</option>
                <option>4 Wheeler</option>
              </select>
            </label>
          </div>
          <label>
            Pickup/Drop Address:
            <input type="text" placeholder="Enter the zip code" className="input" {...register("address", { required: true })} />
            {errors.address && <span style={{ fontSize: "small", color: "red" }}>This field is required!</span>}
          </label>
          <label>
            Rent/Day in Rs:
            <input type="number" placeholder="Rent/day" className="input" {...register("rent", { required: true })} />
            {errors.rent && <span style={{ fontSize: "small", color: "red" }}>This field is required!</span>}
          </label>
          <label>
            Image Of Your Vehicle:
            <input type="file" className="input" onChange={handleFileUpload} />
            {errors.image && <span style={{ fontSize: "small", color: "red" }}>This field is required!</span>}
          </label>
          <div className='d-flex justify-content-between mt-3'>
            <button type="button" className="submitButton" onClick={() => navigate('/')}>Go Back</button>
            <button type="submit" className="submitButton">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
