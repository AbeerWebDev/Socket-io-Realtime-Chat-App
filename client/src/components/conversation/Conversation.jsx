import './conversation.css'

const Conversation = () => {
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src="https://images.pexels.com/photos/13484361/pexels-photo-13484361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt=""
      />
      <span className="conversationName">Jane Doe</span>
    </div>
  );
}

export default Conversation