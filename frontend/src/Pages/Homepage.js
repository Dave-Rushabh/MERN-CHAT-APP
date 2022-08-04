import React, { useEffect } from "react";
import axios from "axios";
const Homepage = () => {
  const test = async () => {
    const data = await axios.get("/dummy");
    console.log(data.data);
  };

  useEffect(() => {
    test();
  }, []);

  return <div>Homepage</div>;
};

export default Homepage;
