import React from 'react'
import sendIcon from '../assets/send.png'
import cancel from '../assets/cancel.png'


export const Chat = (props) => {

    const {
        sendMessage,
        value,
        updateMessage,
        server,
        sortName,
        username,
        receiver,
        onChatClose,
      } = props;
    
      const messages = server
        ? server[sortName(username, receiver)]
        : [];

    return (
        <div>
            <div className="online-users-header">
                <div style={{ margin: "0 10px" }}>{receiver}</div>
                <div style={{ margin: "0 10px", cursor: "pointer" }}>
                    <img onClick={onChatClose} width={10} src={cancel} alt="close" />
                </div>
            </div>
            <div className="message-area">
                <ul>
                    {messages && messages.length > 0 ?
                        messages.map((msg, index) => (
                            <li key={index} style={{
                                flexDirection:
                                    username === msg.receiver ? "row" : "row-reverse",
                            }}>
                                <div className="user-pic">
                                    <img src={require(`../users/1.png`).default} alt="test" />
                                </div>
                                <div>
                                    {msg && msg.message !== "" ?
                                        <div className="message-text">{msg.message}</div>
                                        : null}
                                </div>
                            </li>
                        ))
                        : null}
                </ul>
            </div>
            <div>
                <form onSubmit={sendMessage} className="message-control">
                    <textarea
                        value={value} onChange={updateMessage}
                        placeholder="Type something...!"
                    />
                    <button>
                        <img src={sendIcon} alt="test" />
                        <span style={{ display: "inline-block" }}>Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
