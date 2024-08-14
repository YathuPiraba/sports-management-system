import React from "react";

const AdminDisplay = ({user,image,baseUrl}) => {
  return (
    <div>
      <figure className="p-6 pb-0">
        <h1 className="text-3xl text-center font-medium py-8 text-cyan-600">
          Admin Profile
        </h1>
        <span
          className="relative inline-flex items-center justify-center rounded-full text-white overflow-hidden"
          style={{ width: 80, height: 80 }}
        >
          <img
            src={image ? `${baseUrl}/${image}` : logo}
            alt="User Profile"
            title="user profile"
            className="w-full h-full object-cover"
          />
        </span>
      </figure>

      <div className="p-6">
        <header className="mb-4">
          <h3 className="text-xl font-medium text-slate-700">
            {user.userName}
          </h3>
          <p className="text-slate-400">{user.email}</p>
        </header>
      </div>
    </div>
  );
};

export default AdminDisplay;
