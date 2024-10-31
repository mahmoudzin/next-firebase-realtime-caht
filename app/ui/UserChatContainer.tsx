import React from "react";
import { ActiveUserProvider } from "../context/chatContex";
import UsersList from "./Userslist";
import UserChatScreen from "./UserChatScreen";
import ChatUserInformation from "./ChatUserInformation";

function UserChatContainer() {
  return (
    <ActiveUserProvider>
      <main className="bg-gray-100">
        <div className="container mx-auto flex h-screen p-6 ">
          {/* Column 1 */}
          <div className="w-1/4 p-4">
            <div className="w-full h-full overflow-y-auto bg-white rounded-lg shadow-lg">
              <UsersList />
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-1/2 p-4">
            <UserChatScreen />
          </div>

          {/* Column 3 */}
          <div className="w-1/4 p-4">
            <div className="w-full h-full bg-white rounded-lg shadow-lg p-2">
              <ChatUserInformation />
            </div>
          </div>
        </div>
      </main>
    </ActiveUserProvider>
  );
}

export default UserChatContainer;
