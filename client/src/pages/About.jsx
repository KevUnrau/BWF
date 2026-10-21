function About() {
  return (
    <>
      <h2>Logo credits and Disclaimer</h2>
      <p>
        All club and competition logos used on this website are the property of
        their respective owners and are used for identification purposes only. I
        do not claim ownership of these logos or any associated trademarks.
        Their use does not imply any official affiliation with or endorsement by
        the respective clubs, leagues, or organizations.
      </p>
      <p className="font-bold">
        Logo source:{" "}
        <a
          className="text-brand hover:text-brand-hover"
          href="https://football-logos.cc"
        >
          football-logos.cc
        </a>
      </p>
    </>
  );
}

export default About;
