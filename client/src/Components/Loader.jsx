import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Loader = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      const timer = setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 8000);

      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [nextUrl, navigate]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary'></div>
    </div>
  );
};

export default Loader;
