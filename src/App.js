import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

const defaultQuestion = "How do I decide what kind of business I should start?";

const defaultButtonText = "Ask the Question";

const typingDelay = 50; // Smaller this number, faster the typing speed.

function App() {
  const [textareaValue, settextareaValue] = useState(defaultQuestion);
  const [mainButtonText, setMainButtonText] = useState(defaultButtonText);
  const [mainButtonDisabled, setMainButtonDisabled] = useState(false);
  const [luckyButtonDisabled, setLuckyButtonDisabled] = useState(false);
  const [answerJsx, setAnswerJsx] = useState(null);
  const [answering, setAnswering] = useState(false);

  const setBothButtonsDisabled = (value) => {
    setMainButtonDisabled(value);
    setLuckyButtonDisabled(value);
  };

  const reSetButtons = useCallback(() => {
    if (answering) {
      return;
    }
    const trimmedtextareaValueue = textareaValue.trim();
    if (trimmedtextareaValueue) {
      setMainButtonText(defaultButtonText);
      setBothButtonsDisabled(false);
    } else {
      setMainButtonText("Ask a Question");
      setMainButtonDisabled(true);
      setLuckyButtonDisabled(false);
    }
  }, [answering, textareaValue]);

  useEffect(reSetButtons, [textareaValue, answering, reSetButtons]);

  const handleQuestionChanged = (newTextareaValue) => {
    settextareaValue(newTextareaValue);
  };

  const handleButtonClicked = useCallback(
    (lucky) => {
      setAnswering(true);
      setMainButtonText("Answering...");
      const waitingResponses = [
        "Sahil seems to have gone out, he'll be back in a second!",
        "That's the first time someone asked me that, let me think...",
        "Hmmm, that's a tough one. Let me frame it properly for you.",
        "Good answers take time, please wait a moment.",
        "Your (api) call is valuable to us, please stay on line.",
      ];
      const randomWaitingResponse =
        waitingResponses[Math.floor(Math.random() * waitingResponses.length)];

      setAnswerJsx(
        <p style={{ margin: "15px 3px" }}>{randomWaitingResponse}</p>
      );
      setBothButtonsDisabled(true);

      const questionField = lucky ? "I am feeling lucky" : textareaValue;

      const apiCallString =
        "http://ec2-18-206-57-36.compute-1.amazonaws.com:3000/api/v1/ask?question=" +
        questionField +
        "&strategy=sahils_strategy_ruby";
      fetch(apiCallString)
        .then((resp) => resp.json())
        .then((data) => {
          settextareaValue(data.question);
          const answer = data.answer;

          window.responsiveVoice.speak(answer, "UK English Male");

          const totalTypingTime = typingDelay * answer.length;

          for (let i = 0; i < answer.length; i++) {
            setTimeout(() => {
              setAnswerJsx(
                <p style={{ margin: "15px 3px" }}>
                  <strong>Answer: </strong>&nbsp;{answer.slice(0, i + 1)}
                </p>
              );
            }, i * typingDelay);
          }
          setTimeout(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
            setAnswering(false);
            reSetButtons();
          }, totalTypingTime);
        });
    },
    [reSetButtons, textareaValue]
  );

  function handleMainButtonClicked() {
    handleButtonClicked(false);
  }

  function handleLuckyButtonClicked() {
    handleButtonClicked(true);
  }

  const textareaRef = useRef(null);
  const askButtonRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault(); // Prevents adding a new line in the text area
      askButtonRef.current.click();
    }
  };

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
            value={textareaValue}
            onKeyDown={handleKeyDown}
            ref={textareaRef}
          ></textarea>
          <div display="flex">
            <button
              type="button"
              disabled={mainButtonDisabled}
              onClick={handleMainButtonClicked}
              ref={askButtonRef}
            >
              {mainButtonText}
            </button>
            <button
              type="button"
              className="lucky-button"
              disabled={luckyButtonDisabled}
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
