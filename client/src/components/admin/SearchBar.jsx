import PropTypes from 'prop-types';
import SearchIcon from '../../assets/images/search-dark.svg';
import CloseIcon from '../../assets/images/close-dark.svg';

function SearchBar({ placeholder, value, handleChange, handleClear }) {
  return (
    <div className="relative h-9 rounded-2xl bg-gray-50">
      <input
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        className="h-full w-full py-2 px-8 focus:outline-none focus:ring-1 focus:ring-gray-500 border rounded-xl"
        type="text"
      />
      <img className="absolute w-5 h-5 left-2 top-1/2 -translate-y-1/2" src={SearchIcon} alt="" />
      {value && (
        <img
          onClick={handleClear}
          className="absolute w-4 h-4 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          src={CloseIcon}
          alt=""
        />
      )}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleClear: PropTypes.func,
};

export default SearchBar;
