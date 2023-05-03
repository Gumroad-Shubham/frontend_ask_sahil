import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const default_question =
  "How do I decide what kind of business I should start?";

const default_button_text = "Ask the Question";

var answering = false;

var typing_delay = 50; // Smaller this number, faster the typing speed.

function App() {
  var [textareaVal, setTextAreaVal] = useState(default_question);
  var [mainButtonText, setMainButtonText] = useState(default_button_text);
  var [buttonDisabled, setButtonDisabled] = useState(false);
  var [answerJsx, setAnswerJsx] = useState(null);

  function reSetButton() {
    if (answering) {
      return;
    }
    var trimmedTextAreaVal = textareaVal.trim();
    if (trimmedTextAreaVal) {
      setMainButtonText(default_button_text);
      setButtonDisabled(false);
    } else {
      setMainButtonText("Ask a Question");
      setButtonDisabled(true);
    }
  }

  useEffect(reSetButton, [textareaVal]);

  function handleQuestionChanged(newTextAreaVal) {
    setTextAreaVal(newTextAreaVal);
  }

  async function handleMainButtonClicked() {
    setMainButtonText("Answering...");
    var waiting_responses = [
      "Sahil seems to have gone out, let him come back!",
      "That's the first time someone asked me that, let me think...",
      "Hmmm, that's a tough one. Let me frame it properly for you.",
      "Good answers take time, please wait a moment.",
      "Your (api) call is valuable to us, please stay on line.",
    ];
    const rand_resp =
      waiting_responses[Math.floor(Math.random() * waiting_responses.length)];

    setAnswerJsx(<p style={{ margin: "15px 3px" }}>{rand_resp}</p>);
    setButtonDisabled(true);
    var question =
      'http://ec2-18-206-57-36.compute-1.amazonaws.com:3000/api/v1/ask?question="' +
      textareaVal +
      '"&strategy=sahils_strategy_ruby';
    fetch(question)
      .then((r) => r.json())
      .then((data) => {
        var answer_text = data["answer"];
        var j = 1;
        for (var i = 0; i < answer_text.length; i++) {
          setTimeout(() => {
            setAnswerJsx(
              <p style={{ margin: "15px 3px" }}>
                <strong>Answer: </strong>&nbsp;{answer_text.slice(0, j)}
              </p>
            );
            j++;
            window.scrollTo(0, document.documentElement.scrollHeight);
          }, i * typing_delay);
        }
      });
    answering = false;
    reSetButton();
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
            onChange={(event) => {
              handleQuestionChanged(event.target.value);
            }}
            value={textareaVal}
          ></textarea>
          <div display="flex">
            <button
              type="button"
              disabled={buttonDisabled}
              onClick={handleMainButtonClicked}
            >
              {mainButtonText}
            </button>
            <button className="lucky-button">I'm Feeling Lucky</button>
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
