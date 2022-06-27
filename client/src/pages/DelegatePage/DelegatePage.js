import { TOKEN_ID } from "../../utils/constants";

import "./chatBot.css";
import react, { useEffect, useState } from "react";
import { IoMdSend, IoMdMic, IoMdMicOff } from "react-icons/io";
import { BiBot, BiUser } from "react-icons/bi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useAuth } from "../../context/AuthContext";
function DelegatePage() {
  const auth = useAuth();
  const token = localStorage.getItem(TOKEN_ID);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const msgg = new SpeechSynthesisUtterance();
  const [chat, setChat] = useState([]);
  const [payload, setPayload] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setbotTyping] = useState(false);

  const speechHandler = (m, msg) => {
    console.log("here");
    msg.text = m;
    window.speechSynthesis.speak(msg);
  };
  useEffect(() => {
    console.log("called");
    const objDiv = document.getElementById("messageArea");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [chat]);
  const handleListen = () => {
    resetTranscript();
    return SpeechRecognition.startListening({ continuous: true });
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (listening) {
      SpeechRecognition.stopListening();
      const speechText = transcript;
      resetTranscript();
      const name = "Akash";
      const request_temp = {
        sender: "user",
        sender_id: name,
        msg: speechText,
      };

      if (speechText !== "") {
        setChat((chat) => [...chat, request_temp]);
        setbotTyping(true);
        setInputMessage("");
        rasaAPI(name, speechText);
      }
    } else {
      const name = "Akash";
      const request_temp = {
        sender: "user",
        sender_id: name,
        msg: inputMessage,
      };

      if (inputMessage !== "") {
        setChat((chat) => [...chat, request_temp]);
        setbotTyping(true);
        rasaAPI(name, inputMessage, payload);

        setInputMessage("");
        setPayload(null);
      } else {
        window.alert("Please enter valid message");
      }
    }
  };
  const buttonSubmit = (evt) => {
    evt.preventDefault();
    setPayload(evt.target.name);
    setInputMessage(evt.target.innerHTML);
  };

  const rasaAPI = async function handleClick(name, msg, payload) {
    console.log("her", msg, payload);
    //chatData.push({sender : "user", sender_id : name, msg : msg});

    await fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        charset: "UTF-8",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        sender: name,
        message: payload ? payload : msg,
        // message: JSON.stringify({
        //   message: payload ? payload : msg,
        //   user: token,
        // }),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const temp = response[0];
          console.log(temp);
          const recipient_id = temp["recipient_id"];
          const recipient_msg = temp["text"];
          const recipient_buttons = temp["buttons"];

          const response_temp = {
            sender: "bot",
            recipient_id: recipient_id,
            msg: recipient_msg,
            buttons: recipient_buttons,
          };
          console.log(response_temp);
          setbotTyping(false);
          setChat((chat) => [...chat, response_temp]);
          if (response_temp["msg"]) speechHandler(response_temp["msg"], msgg);
          if (recipient_buttons) {
            for (var i = 0; i < recipient_buttons.length; i++) {
              speechHandler(recipient_buttons[i].title, msgg);
            }
          }
          // scrollBottom();
        }
      });
  };

  console.log(chat);

  const stylecard = {
    minWidth: "80rem",
    border: "1px solid black",
    paddingLeft: "0px",
    paddingRight: "0px",
    borderRadius: "30px",
    boxShadow: "0 16px 20px 0 rgba(0,0,0,0.4)",
  };
  const styleHeader = {
    height: "4.5rem",
    borderBottom: "1px solid black",
    borderRadius: "30px 30px 0px 0px",
    backgroundColor: "#1a1a1a",
  };
  const styleFooter = {
    //maxWidth : '32rem',
    borderTop: "1px solid black",
    borderRadius: "0px 0px 30px 30px",
    backgroundColor: "#1a1a1a",
  };
  const styleBody = {
    paddingTop: "10px",
    height: "28rem",
    overflowY: "a",
    overflowX: "hidden",
  };
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <div>
      {/* <button onClick={()=>rasaAPI("shreyas","hi")}>Try this</button> */}

      <div className="container">
        <div className="row justify-content-center">
          <div className="card" style={stylecard}>
            <div className="cardHeader text-white" style={styleHeader}>
              <h1 style={{ marginBottom: "0px" }}>
                {" "}
                <br></br>
                &nbsp; &nbsp; &nbsp; InClaim Assitant
              </h1>
              {botTyping ? (
                <h6>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bot Typing....</h6>
              ) : null}
            </div>
            <div className="cardBody" id="messageArea" style={styleBody}>
              <div className="column msgarea">
                {chat.map((user, key) => (
                  <div key={key}>
                    {user.sender === "bot" ? (
                      user.buttons ? (
                        user.buttons.map((btn) => (
                          <div className="msgalignstart">
                            <BiBot className="botIcon" />
                            <button
                              onClick={buttonSubmit}
                              className="botmsg"
                              name={btn.payload}
                            >
                              {btn.title}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="msgalignstart">
                          <BiBot className="botIcon" />
                          <h5 className="botmsg">{user.msg}</h5>
                        </div>
                      )
                    ) : (
                      <div className="msgalignend">
                        <h5 className="usermsg">{user.msg}</h5>
                        <BiUser className="userIcon" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p>Microphone: {listening ? "on" : "off"}</p>
            <button
              className="circleBtn"
              onClick={!listening ? handleListen : handleSubmit}
            >
              {listening ? (
                <IoMdMicOff className="sendBtn" />
              ) : (
                <IoMdMic className="sendBtn" />
              )}
            </button>

            <div className="cardFooter text-white" style={styleFooter}>
              <div className="row">
                <form style={{ display: "flex" }} onSubmit={handleSubmit}>
                  <div className="col-10" style={{ paddingRight: "0px" }}>
                    <input
                      onChange={(e) => setInputMessage(e.target.value)}
                      value={listening ? transcript : inputMessage}
                      type="text"
                      className="msginp"
                    ></input>
                  </div>
                  <div className="col-2 cola">
                    <button type="submit" className="circleBtn">
                      <IoMdSend className="sendBtn" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelegatePage;
