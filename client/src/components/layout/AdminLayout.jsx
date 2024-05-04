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
      <div className="flex">
        <SideBar handleClose={handleClose} isExpand={expanded} />
        <div className="flex-1 overflow-x-hidden">
          <Header toggled={toggled} handleToggle={handleToggle} />
          {children}
        </div>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
