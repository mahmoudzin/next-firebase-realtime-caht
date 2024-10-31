"use client";
import React from "react";
import { useActiveUser } from "../context/chatContex";
import Image from "next/image";

function ChatUserInformation() {
  const { activeUser } = useActiveUser();
  return (
    <>
      {activeUser ? (
        <div className="border rounded-md">
          <h3 className="border-b text-lg mb-2 p-1 text-violet-900">
            Group Chat
          </h3>
          <div className="flex flex-col items-center py-2 px-1">
            <Image
              src={activeUser.image}
              alt={`${activeUser.username}'s avatar`}
              className="w-12 h-12 mb-2 rounded-full text-center"
              width={48}
              height={48}
            />

            <p className="text-lg text-violet-900 mb-1">
              {activeUser.username}
            </p>
            <p className=" text-gray-400 mb-1">{activeUser.message}</p>
          </div>
        </div>
      ) : (
        <div>nothing yet!</div>
      )}
    </>
  );
}

export default ChatUserInformation;
