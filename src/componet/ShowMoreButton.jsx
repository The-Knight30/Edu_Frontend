import { useState } from "react";

function ShowMoreButton({ text, maxChars, id }) {
    const [showMore, setShowMore] = useState({});
  
    const toggleShowMore = () => {
      setShowMore((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    };
  
    return (
      <div>
        <p>{showMore[id] ? text : text.slice(0, maxChars)}</p>
        {text.length > maxChars && (
          <button onClick={toggleShowMore}>
            {showMore[id] ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  }
  export default  ShowMoreButton;