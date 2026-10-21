function Homepage() {
  return (
    <>
      <h2>Football Predictions with Friends</h2>
      <p>
        Create private prediction groups, invite your friends, and compete
        throughout the season. Make your predictions, earn points, and climb the
        leaderboard.
      </p>
      <h3>Supported competitions:</h3>
      <ul className="bullet-list">
        <li>
          Bundesliga
          <img
            src="/images/competitions/germany_bundesliga.football-logos.cc.svg"
            className="h-5 w-5 ml-2 inline"
            alt="Bundesliga"
          ></img>
        </li>
      </ul>
      <h3>Point System</h3>
      <ul className="bullet-list">
        <li>
          3 points - Exact score predicted correctly (e.g. you tip 2–1 and the
          match ends 2–1).
        </li>
        <li>
          1 Point - Correct match result predicted (win, draw or loss), but the
          exact score is wrong (e.g. you tip 2–1 and the match ends 3–1).
        </li>
        <li>
          0 Points - Incorrect match result predicted (e.g. you tip 2–1 and the
          match ends 1–2).
        </li>
      </ul>
    </>
  );
}

export default Homepage;
