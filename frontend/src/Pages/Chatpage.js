import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Chatpage = () => {
  const navigate = useNavigate();

  // destructure the chatReducer's state from here and use it as and when required
  const { currentUser } = useSelector((state) => state.chatReducer);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/');
    }
  }, [currentUser]);

  return <div>Chatpage</div>;
};

export default Chatpage;
