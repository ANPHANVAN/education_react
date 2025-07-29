import { useEffect, useRef, useState } from 'react';

// Handler hook for when Outside click dropdown close
let useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);

    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  });

  return domNode;
};
// Handler hook for when Outside click dropdown close End Code====>>

const Dropdown = ({ handleDelete, handleRename }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });

  return (
    <>
      {/* <!-- ====== Dropdowns Section Start --> */}
      <section className="dark:bg-dark">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            {/* one */}
            <div ref={domNode} className="w-full px-4 sm:w-1/2 lg:w-1/4">
              <div className="text-center">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`bg-dark dark:bg-dark-2 flex cursor-pointer items-center rounded-[5px] px-5 py-[13px] text-base font-medium text-black dark:text-white`}
                  >
                    <i className="fa-solid fa-caret-down w-12"></i>
                  </button>
                  <div
                    className={`bg-bg border-muted shadow-1 dark:shadow-box-dark bg-dark dark:bg-dark-2 absolute left-0 z-40 mt-0 w-full rounded-md border-2 py-0 transition-all ${
                      dropdownOpen
                        ? 'visible top-full opacity-100'
                        : 'invisible top-[110%] opacity-0'
                    }`}
                  >
                    <DropdownItem
                      label="Xóa Lớp"
                      icon="fa-solid fa-trash"
                      onClick={() => {
                        handleDelete();
                        setDropdownOpen(false);
                      }}
                    />
                    <DropdownItem
                      label="Đổi Tên"
                      icon="fa-solid fa-pen-to-square"
                      onClick={() => {
                        handleRename();
                        setDropdownOpen(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* End */}
          </div>
        </div>
      </section>
      {/* <!-- ====== Dropdowns Section End -->    */}
    </>
  );
};

export default Dropdown;

const DropdownItem = ({ label, onClick, icon }) => {
  return (
    <div
      className="text-dark-5 hover:text-text block w-auto cursor-pointer py-2 text-center text-base dark:text-gray-400"
      onClick={onClick}
    >
      <i className={icon}></i> {label}
    </div>
  );
};
