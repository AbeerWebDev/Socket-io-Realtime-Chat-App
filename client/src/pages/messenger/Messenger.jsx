import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

const Messenger = () => {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const {user} = useContext(AuthContext)
    const scrollRef = useRef()
    const socket = useRef();

    useEffect(()=>{
        socket.current = io("ws://localhost:8900")
    }, [])

    useEffect(()=>{
        socket.current.emit('addUser', user._id)
        socket.current.on("getUsers", (users) => {
          console.log(users);
        });
    }, [user])

   useEffect(()=>{
    const getConversations = async () => {
        try {
            const res = await axios.get('/conversations/' + user._id)
            setConversations(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    getConversations()
   },[])

   useEffect(()=>{
    const getMessages = async() => {
        try {
            const res = await axios.get('/messages/'+ currentChat?._id)
            setMessages(res.data)
        } catch (err) {
            console.log(err)
        }
    }
    getMessages()
   }, [currentChat])

   const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id
    }

    try {
        const res = await axios.post('/messages', message)
        setMessages([...messages, res.data])
        setNewMessage("")
    } catch (err) {
        console.log(err)
    }
   } 

   useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
   }, [messages])
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="Search for friends"
            />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Write something..."
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">Start a conversation</span>
            )}
          </div>
        </div>
        <div className="chatOnline ">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger