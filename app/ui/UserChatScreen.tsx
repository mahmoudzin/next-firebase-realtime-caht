"use client";
import React, { useEffect, useRef, useState } from "react";
import { app, firestoreDb } from "@/firebase";
import { useActiveUser } from "../context/chatContex";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { useCollection } from "react-firebase-hooks/firestore";
import { User } from "../types/user";
import Image from "next/image";
interface Message {
  id: string;
  username: string;
  text: string;
}

function UserChatScreen() {
  const { activeUser } = useActiveUser();
  const dummySpace = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg ">
      {activeUser ? (
        <div className="h-full">
          {/* header  */}
          <ChatHeader activeUser={activeUser} />
          {/* body */}
          <ChatBody dummySpace={dummySpace} />
          {/* footer */}
          <ChatFooter dummySpace={dummySpace} user={activeUser} />
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          Select some user to start chating...
        </div>
      )}
    </div>
  );
}

function ChatBody({
  dummySpace,
}: {
  dummySpace: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const messagesRef = collection(firestoreDb, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));
  const [realTimeMessages, loading, error] = useCollection(messagesQuery);
  return (
    <div
      className="p-4  overflow-y-auto"
      style={{ height: "calc(100% - 140px)" }}
      ref={dummySpace}
    >
      {realTimeMessages?.docs.map((msg) => (
        <div className="flex gap-2 mb-4" key={msg.id}>
          <Image
            src={msg.data().image || "/images/profile-default.png"}
            alt={`${msg.data().username}'s avatar`}
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
          <div className=" border rounded-md p-2 w-full">
            <p className="text-lg font-semibold mb-1 border-b">
              {msg.data().username}
            </p>
            <div className="">{msg.data().text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatHeader({ activeUser }: { activeUser: User }) {
  return (
    <div className="flex items-center justify-between space-x-4 border-b p-4 h-[70px]">
      <div className="flex items-center gap-4">
        <Image
          src={activeUser.image}
          alt={`${activeUser.username}'s avatar`}
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
        <div>
          <p className="text-lg font-semibold">{activeUser.username}</p>
          <p className="text-sm text-gray-300">
            Messages: {activeUser.countOfMessages}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-300">
        Active since: {new Date(activeUser.date).toLocaleDateString()}
      </div>
    </div>
  );
}
const storage = getStorage(app);
function ChatFooter({
  dummySpace,
  user,
}: {
  dummySpace: React.MutableRefObject<HTMLDivElement | null>;
  user: User;
}) {
  const [message, setMessage] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDoc(collection(firestoreDb, "messages"), {
      type: "text",
      text: message,
      username: user.username || "Unknown", // Ensure username is sent
      image: user.image,
      createdAt: serverTimestamp(),
    });

    setMessage("");
    if (dummySpace.current)
      dummySpace.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Handle file upload logic here
      console.log("Files uploaded:", files);
    }
  };

  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioURL, setAudioURL] = useState<string>("");
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    console.log("start recording>>>>>>>>");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      // Upload the audio file to Firebase Storage
      const storageRef = ref(storage, `audio/${audioFile.name}`);
      await uploadBytes(storageRef, audioFile);
      setAudioURL(URL.createObjectURL(audioBlob)); // Set audio URL to play the recording
      // Save the message to Firestore
      await addDoc(collection(firestoreDb, "messages"), {
        type: "voice",
        voice: audioURL,
        username: user.username || "Unknown", // Ensure username is sent
        image: user.image,
        createdAt: serverTimestamp(),
      });

      audioChunksRef.current = []; // Clear the audio chunks
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    audioChunksRef.current = []; // Clear the audio chunks
  };

  useEffect(() => {
    console.log(recording ? "start recording" : "stop recording");

    if (recording) startRecording();
    else stopRecording();
  }, [recording]);

  return (
    <div className="p-4 flex items-center justify-between h-[70px] border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={sendMessage}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
      <button
        onClick={() => setRecording((recording) => !recording)}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        🎤
      </button>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
        className="ml-2 text-gray-800"
        id="file-upload"
        style={{ display: "none" }} // Hide the default file input
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer ml-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        📁 Upload
      </label>
    </div>
  );
}

export default UserChatScreen;

//recgnize the code and
//sweet the design
//deisng the chat info
