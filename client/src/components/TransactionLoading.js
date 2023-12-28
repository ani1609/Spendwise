import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={2}
    width={422}
    height={70}
    viewBox="0 0 422 70"
    backgroundColor="#b6cefc"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="35" cy="35" r="27" />
    <rect x="70" y="14" rx="10" ry="10" width="250" height="20" />
    <rect x="70" y="38" rx="8" ry="8" width="128" height="14" />
  </ContentLoader>
);

export default MyLoader;
