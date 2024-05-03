import PropTypes from 'prop-types';
import { SideBar, Header } from '../admin';
import { useState } from 'react';

function AdminLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [toggled, setToggled] = useState(true);

  function handleToggle(active) {
    setExpanded(active);
  }

  function handleClose() {
    setToggled((toggled) => !toggled);
  }

  return (
    <div className="min-h-screen">
      <Header toggled={toggled} handleToggle={handleToggle} />
      <div className="flex">
        <SideBar handleClose={handleClose} isExpand={expanded} />
        <div className="flex-1 before:block before:h-[60px] overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
