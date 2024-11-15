import Globe from '@/components/Globe';
import SolarSystem from '@/components/SolarSystem';
import ThreeDModel from '@/components/ThreeDModel';
import ThreeScene from '@/components/ThreeScene';
import React from 'react';;

const ThreeDModelPage: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
    <ThreeScene />
  </div>
  );
};

export default ThreeDModelPage;
