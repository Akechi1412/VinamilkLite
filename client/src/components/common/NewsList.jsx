import PropTypes from 'prop-types';
import { NewsItem } from './';

function NewsList({ newsList }) {
  return (
    <div className="w-full max-w-[900px] mx-auto mt-[48px]">
      <div className="space-y-5">
        {newsList.map((news) => (
          <div key={news.id}>
            <NewsItem news={news} />
          </div>
        ))}
      </div>
    </div>
  );
}

NewsList.propTypes = {
  newsList: PropTypes.array.isRequired,
};

export default NewsList;
