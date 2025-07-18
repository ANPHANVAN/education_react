import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const ClassDetail = () => {
  return (
    <div>
      <div>tab bar</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
