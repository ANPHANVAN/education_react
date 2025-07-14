import React, { useState } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`flex w-full items-center bg-white py-2 dark:bg-black`}>
      <div className="container">
        <div className="relative-mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-0">
              <h1 className="my-0">Education</h1>
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && 'navbarTogglerActive'
                } ring-primary absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden`}
              >
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
                <span className="bg-body-color relative my-[6px] block h-[2px] w-[30px] dark:bg-white"></span>
              </button>
              <nav
                // :className="!navbarOpen && 'hidden' "
                id="navbarCollapse"
                className={`dark:bg-dark-2 absolute top-full right-4 w-full max-w-[250px] rounded-lg bg-white px-6 py-0 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
                  !open && 'hidden'
                } `}
              >
                <ul className="m-0 block lg:flex">
                  <ListItem NavLink="/#">Home</ListItem>
                  <ListItem NavLink="/#">Payment</ListItem>
                  <ListItem NavLink="/#">About</ListItem>
                  <ListItem NavLink="/#">Blog</ListItem>
                </ul>
              </nav>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <a
                href="/#"
                className="text-dark hover:text-primary px-7 py-3 text-base font-medium dark:text-amber-300"
              >
                Sign in
              </a>

              <a
                href="/#"
                className="bg-primary hover:bg-primary/90 rounded-md px-7 py-3 text-base font-medium text-white"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const ListItem = ({ children, NavLink }) => {
  return (
    <>
      <li>
        <a
          href={NavLink}
          className="text-body-color hover:text-dark dark:text-dark-6 flex py-2 text-base font-medium lg:ml-12 lg:inline-flex dark:hover:text-white"
        >
          {children}
        </a>
      </li>
    </>
  );
};
