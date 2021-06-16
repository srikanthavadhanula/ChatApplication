import React from 'react'
import sendIcon from '../assets/send.png'
import cancel from '../assets/cancel.png'
import attachment from "../assets/paper-clip.png";
import image from "../assets/image.png";


export const Chat = (props) => {

    const {
        sendMessage,
        value,
        updateMessage,
        server,
        setMedia,
        sortName,
        username,
        receiver,
        onChatClose,
        media
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
                                    {msg.media && msg.media.image ? (
                                        <div className="image-container">
                                            <img src={msg.media.content} width="200" alt="" />
                                        </div>
                                    ) : null}
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

                {media !== null ? (
                    <div className="attachement-display">
                        <img src={image} alt={""} />
                        <span className="attachment-name">{media.name}</span>
                        <span className="remove-attachment">x</span>
                    </div>
                ) : null}

                <form onSubmit={sendMessage} className="message-control">
                    <textarea
                        value={value} onChange={updateMessage}
                        placeholder="Type something...!"
                    />


                    <div className="file-input-container">
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function () {
                                    console.log(reader.result);
                                    setMedia({
                                        image: true,
                                        content: reader.result,
                                        name: file.name,
                                    });
                                };
                                reader.onerror = function (error) {
                                    console.log(error);
                                };
                            }}
                            id="hidden-file"
                        />
                        <label htmlFor="hidden-file">
                            <img width="20" src={attachment} alt={""} />
                        </label>
                    </div>


                    <button>
                        <img src={sendIcon} alt="test" />
                        <span style={{ display: "inline-block" }}>Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
