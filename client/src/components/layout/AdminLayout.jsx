import PropTypes from 'prop-types';
import { SideBar, Header } from '../admin';

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <SideBar />
      <div className="flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
