"use client";

import { useContext, useEffect, useState } from "react";
import { users } from "../data/usersData";
import { useActiveUser } from "../context/chatContex";
import { User } from "../types/user";
import Image from "next/image";

export default function UsersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [usersToShow, setUsers] = useState(users);
  // const {searchQuery} = useContext();

  useEffect(() => {
    if (searchQuery) {
      const filterdUsers = usersToShow.filter((user) =>
        user.username.includes(searchQuery)
      );
      setUsers(filterdUsers);
    } else {
      setUsers(users);
    }
  }, [searchQuery]);
  return (
    <div className="p-2">
      {/* search */}
      <input
        value={searchQuery}
        placeholder="Search for users....."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full  border border-gray-500 mb-4 focus:outline-none rounded-md shadow-sm px-2 py-1 text-gray-400"
      />
      {/* user list  */}

      {usersToShow.length > 0 ? (
        usersToShow.map((user) => <UserCard key={user.username} user={user} />)
      ) : (
        <div>there no users to show!</div>
      )}
    </div>
  );
}

// Define the type for the component's props
interface UserCardProps {
  user: User;
}

// Component to display each user card
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { activeUser, setActiveUser } = useActiveUser();
  const isActive = activeUser?.username === user.username;
  return (
    <div
      onClick={() => setActiveUser(user)}
      className={` group cursor-pointer max-w-sm p-4 mb-2 w-full  rounded-lg shadow-md border border-gray-200 ${
        isActive ? "bg-violet-900" : "bg-white"
      } hover:bg-violet-900 transition-colors duration-700`}
    >
      <div className="flex gap-[10px] items-center w-full">
        <Image
          src={user.image}
          alt={`${user.username}'s avatar`}
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
        <div style={{ width: "calc(100% - (3rem + 10px))" }}>
          <h2
            className={`text-lg font-semibold ${
              isActive ? "text-white" : " text-gray-900"
            } truncate group-hover:text-white `}
          >
            {user.username}
          </h2>
          <p
            className={`text-sm w-full ${
              isActive ? "text-gray-200" : " text-gray-700"
            } group-hover:text-gray-200  mt-1 truncate`}
          >
            {user.message}
          </p>
          <div className="mt-3 text-xs text-gray-500">
            <p>Date: {new Date(user.date).toLocaleDateString()}</p>
            <p>Messages: {user.countOfMessages}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
