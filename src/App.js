import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const default_question =
  "How do I decide what kind of business I should start?";

const default_button_text = "Ask the Question";

var answering = false;

const typing_delay = 50; // Smaller this number, faster the typing speed.

function App() {
  var [textareaVal, setTextAreaVal] = useState(default_question);
  var [mainButtonText, setMainButtonText] = useState(default_button_text);
  var [buttonsDisabled, setButtonsDisabled] = useState(false);
  var [answerJsx, setAnswerJsx] = useState(null);

  function reSetButton() {
    if (answering) {
      return;
    }
    var trimmedTextAreaVal = textareaVal.trim();
    if (trimmedTextAreaVal) {
      setMainButtonText(default_button_text);
      setButtonsDisabled(false);
    } else {
      setMainButtonText("Ask a Question");
      setButtonsDisabled(true);
    }
  }

  useEffect(reSetButton, [textareaVal]);

  function handleQuestionChanged(newTextAreaVal) {
    setTextAreaVal(newTextAreaVal);
  }

  async function handleButtonClicked(lucky) {
    answering = true;
    setMainButtonText("Answering...");
    var waiting_responses = [
      "Sahil seems to have gone out, he'll be back in a second!",
      "That's the first time someone asked me that, let me think...",
      "Hmmm, that's a tough one. Let me frame it properly for you.",
      "Good answers take time, please wait a moment.",
      "Your (api) call is valuable to us, please stay on line.",
    ];
    const rand_resp =
      waiting_responses[Math.floor(Math.random() * waiting_responses.length)];

    setAnswerJsx(<p style={{ margin: "15px 3px" }}>{rand_resp}</p>);
    setButtonsDisabled(true);

    var ques_field = lucky ? "I am feeling lucky" : textareaVal;

    var api_call_string =
      "http://ec2-18-206-57-36.compute-1.amazonaws.com:3000/api/v1/ask?question=" +
      ques_field +
      "&strategy=sahils_strategy_ruby";
    fetch(api_call_string)
      .then((r) => r.json())
      .then((data) => {
        setTextAreaVal(data["question"]);
        var answer_text = data["answer"];

        const total_time_to_type = typing_delay * answer_text.length;

        setTimeout(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
          answering = false;
          reSetButton();
        }, total_time_to_type);

        var j = 1;
        for (var i = 0; i < answer_text.length; i++) {
          setTimeout(() => {
            setAnswerJsx(
              <p style={{ margin: "15px 3px" }}>
                <strong>Answer: </strong>&nbsp;{answer_text.slice(0, j)}
              </p>
            );
            j++;
          }, i * typing_delay);
        }
      });
  }

  async function handleMainButtonClicked() {
    handleButtonClicked(false);
  }

  async function handleLuckyButtonClicked() {
    handleButtonClicked(true);
  }

  return (
    <div className="toplevel-row">
      <div className="left-column"></div>
      <div className="center-bg">
        <div className="center-column">
          <div className="book-row">
            <div className="book-left">
              <div className="book-left-bottom"></div>
            </div>
            <a
              href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397"
              target="_blank"
            >
              <img
                src="book.png"
                loading="lazy"
                alt="Minimalist Entrepreneur Book Cover"
                className="book-image card"
              ></img>
            </a>
            <div className="book-right"></div>
          </div>
          <h2>Ask Sahil</h2>
          <p className="description">
            Sahil is sitting behind the server round the clock to answer any
            questions related to his book to boost the sales. Ask all you want!
            :D
          </p>
          <textarea
            className="question"
            onChange={(event) => {
              handleQuestionChanged(event.target.value);
            }}
            value={textareaVal}
          ></textarea>
          <div display="flex">
            <button
              type="button"
              disabled={buttonsDisabled}
              onClick={handleMainButtonClicked}
            >
              {mainButtonText}
            </button>
            <button
              type="button"
              className="lucky-button"
              disabled={buttonsDisabled}
              onClick={handleLuckyButtonClicked}
            >
              I'm Feeling Lucky
            </button>
          </div>
          {answerJsx}
          <div className="book-binding"></div>
          <div className="center-bottom"></div>
        </div>
      </div>
      <div className="right-column"></div>
    </div>
  );
}

export default App;
