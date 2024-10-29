import React from "react";

const IntroText: React.FC = () => {
  return (
    <div className="introtext">
      <div>
        This web app was made by Nathan Maligeay using React Typescript
        for the frontend and C# .NET 8 for the backend.
      </div>
      <br></br>
      <div>How to play:</div>
      <ul>
        <li>Type in the word that is highlighted in red.</li><br></br>
        <li>
          You can see if you have made a mistake by looking at the bar at the
          bottom.
        </li><br></br>
        <li>
          When one of your special action bar is filled, press the corresponding
          key (1 or 2) to activate it.
        </li><br></br>
        <li>Score the maximum amount of point !</li><br></br>
        <li>
          You can track your games by creating an account. This will also add
          you in the leaderboard.
        </li>
      </ul>
      <div>
        You can check the source code on my
        <a href="https://github.com/NathanMaligeay/typing-battle">Github</a>.
      </div>
      <br></br>
      <div>
        Currently the frontend is hosted on Vercel, while the backend and
        database is deployed on Azure.
      </div>
      <br></br>
      <div>
        If you spot any issue or want to suggest any improvements, you can email me
        at nathan_maligeay@hotmail.fr
      </div>
    </div>
  );
};

export default IntroText;
