import './App.css';
import { io } from 'socket.io-client';
import { useEffect, useRef , useState } from 'react';
import { Chat } from './components/Chat';
import rc from './assets/rc.PNG';

const socket = io(`https://random-chat-application.herokuapp.com/`);
function App() {

  const [state, setState] = useState({
    step: 0,
    name: "",
    friend: useRef(null),
    message: "",
    unique: true,
  });

  const [users, setUsers] = useState({});
  const [server, setServer] = useState({});
  const [media, setMedia] = useState(null);

  const updateName = (e) => {
    e.preventDefault();
    setState({
      ...state,
      name: e.target.value,
    });

  }

  const updateMessage = (e) => {
    e.preventDefault();
    setState({
      ...state,
      message: e.target.value,
    })
  }


  const openPersonalChat = (friend) => {
    console.log(`friend is ${friend}`);
    setState({
      ...state,
      step: 2,
      friend: friend,
    })
  }

  const createUser = (e) => {
    e.preventDefault();
    if (state.name in users | state.name === "") {
      setState({
        ...state,
        unique: false,
      });
    } else {
      setState({
        ...state,
        unique: true,
        step: 1,
      });
      socket.emit("new_user", state.name);
    }
  }

  const onChatClose = () => {
    setState({
      ...state,
      friend: null,
      step: 1
    })
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const data = {
      sender: state.name,
      receiver: state.friend,
      message: state.message,
      media: media,
      view: false,
    }

    socket.emit("send_message", data);

    const key = sortName(data.sender, data.receiver);
    const tempServer = { ...server };
    if (key in tempServer) {
      tempServer[key] = [
        ...tempServer[key],
        { ...data, view: true },
      ];
    } else {
      tempServer[key] = [{ ...data, view: true }];
    }
    setServer({ ...tempServer });
    setState({
      ...state,
      message: "",
    });

    if (media !== null) {
      setMedia(null);
    }
  };

  const sortName = (sender, receiver) => {
    return [sender, receiver].sort().join("-");
  }


  useEffect(() => {

    socket.on("all_users", (user) => {
      setUsers(user);
    })

    socket.on("new_message", (data) => {
      setServer((prevServer) => {
        const messages = { ...prevServer };
        const key = sortName(data.sender, data.receiver);

        if (state.friend === data.sender) {
          data.view = true;
        }

        if (key in messages) {
          messages[key] = [...messages[key], data];
        } else {
          messages[key] = [data];
        }

        return { ...messages };
      });
    });
  }, [])


  const updateMessageView = () => {
    const key = sortName(state.name, state.friend);
    if (key in server) {
      const messages = server[key].map((msg) =>
        !msg.view ? { ...msg, view: true } : msg
      );

      server[key] = [...messages];

      setServer({ ...server });
    }
  };

  useEffect(() => {
    updateMessageView();
  }, [state.friend]);



  const checkUnseenMessages = (receiver) => {
    const key = sortName(state.name, receiver);
    let unseenMessages = [];
    if (key in server) {
      unseenMessages = server[key].filter((msg) => !msg.view);
    }

    return unseenMessages.length;
  };


  const gotoBottom = () => {
    const el = document.querySelector(".message-area ul");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    const key = sortName(state.name, state.friend);
    if (key in server) {
      if (server[key].length > 0) {
        gotoBottom();
      }
    }
  }, [server]);

  return (
    <div className="App">
      <header className="app-header">
        <img className="logo-img" src={rc} alt="" />
        <div className="app-name b-500 primaryColor">Random Chat</div>
      </header>

      <div className="chat-system">
        <div className="chat-box">

          {/* Step - 1 */}

          {state.step === 0 &&
            <div className="username-container">
              <form style={{ display: "inline-block" }}>
                <h4 className="username-label">Enter username</h4>
                <input className="input" value={state.name} onChange={updateName} />
                <p style = {{color: "red", display: state.unique ? "none" : "block" }} >This User Name is already taken</p>
                <button onClick = {createUser} className="button">
                    <span>Enter</span>
                </button>
              </form>
            </div>
          }

          {/* Step-2 */}

          {state.step === 1 &&
            <div >
              <div className="online-users-header">
                <div style={{ margin: "0 10px" }}>Online Users</div>
              </div>
              <ul className="users-list">
                {users &&
                  Object.keys(users).map((user, index) => (
                    <>
                      {user !== state.name ?
                        <li key={index} onClick={() => {
                          openPersonalChat(user)
                        }}>
                          <span style={{ textTransform: "capitalize" }}>{user}</span>
                          {checkUnseenMessages(user) !== 0 ? (
                            <span className="new-message-count">
                              {checkUnseenMessages(user)}
                            </span>
                          ) : null}
                        </li>
                        : null}
                    </>
                  ))}
              </ul>
            </div>

          }

          {/* Step-3 */}

          {state.step === 2 &&

            <Chat
              value={state.message}
              updateMessage={updateMessage}
              sendMessage={sendMessage}
              server={server}
              setMedia={setMedia}
              sortName={sortName}
              username={state.name}
              receiver={state.friend}
              onChatClose={onChatClose}
              media={media}
            />

          }
        </div>
      </div>
    </div>
  );
}

export default App;
