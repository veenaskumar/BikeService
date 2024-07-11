import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceImg from '../../Assets/service.jpg'
import useAuth from '../Auth';

function Service() {
  useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      fetch("http://localhost:5000/service", {
        method: "POST",
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateservice = (_id) => {
    sessionStorage.setItem("changeser", _id);
    navigate(`../editservice`);
  };

  const AddServ = () => {
    sessionStorage.setItem("changeser", null);
  };

  const deleteservice = (_id) => {
    try {
      fetch("http://localhost:5000/deleteservice", {
        method: "POST",
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            alert("Deleted Successfully");
            navigate(`../service`);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-8 ">
      <h1 className="text-5xl font-bold text-center  text-gray-800">List of Services</h1>
      <div className="flex justify-start mb-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600">
          <Link to="../addservice" onClick={AddServ} className="text-white no-underline">
            Add New Service
          </Link>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((row) => (
          <div key={row._id} className="bg-white shadow-lg hover:shadow-2xl border rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{row.sname}</h1>
              <img src={ServiceImg} alt="img" className='object-cover h-64' />
              <p className="text-gray-700 mb-4">{row.sdesc}</p>
              <p className="text-lg font-semibold mb-4">Rs : {row.samount}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => updateservice(row._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteservice(row._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
