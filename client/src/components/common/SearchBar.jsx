import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../../assets/images/search.svg';

function SearchBar({ handleChange, handleSubmit }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  function handleInputChange(event) {
    setValue(event.target.value);
    handleChange(event.target.value);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit]);

  return (
    <div className="relative flex items-center gap-2 md:h-[42px]">
      <input
        onChange={handleInputChange}
        ref={inputRef}
        type="search"
        placeholder="Nhập từ khóa tìm kiếm"
        className="outline-none h-full rounded-[20px] border border-vinamilk-blue pl-[40px]  w-[400px] md:w-full py-2 pr-3 focus:border-vinamilk-blue-light text-primary"
        value={value}
      ></input>
      <button
        onClick={handleSubmit}
        className="absolute text-vinamilk-blue flex justify-center items-center w-[18px] h-[18px] left-[11px]"
      >
        <img className="object-fill" src={SearchIcon} alt="" />
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
