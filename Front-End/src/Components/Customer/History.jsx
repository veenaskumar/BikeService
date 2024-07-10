import React, { useState, useEffect } from 'react';
import useAuth from '../Auth';

function History() {
  useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const email = sessionStorage.getItem("Email");
    try {
      fetch("http://localhost:5000/history", {
        method: "POST",
        crossDomain: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">History</h1>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Bike Number</th>
                <th className="py-3 px-6 text-left">Service</th>
                <th className="py-3 px-6 text-left">Status</th>
                {/* <th className="py-3 px-6 text-center">Action</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-md font-light">
              {data.map((row) => (
                <tr key={row._id} className="border-b border-gray-200 ">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-6 text-left">{row.name}</td>
                  <td className="py-3 px-6 text-left">{row.vno}</td>
                  <td className="py-3 px-6 text-left">{row.service.join(", ")}</td>
                  <td className="py-3 px-6 text-left">{row.status}</td>
                  {/* <td className="py-3 px-6 text-center">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                      View
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;
