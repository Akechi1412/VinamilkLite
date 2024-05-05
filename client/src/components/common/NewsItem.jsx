import PropTypes from 'prop-types';
import DefaultImage from '../../assets/images/default.jpg';
import { Link } from 'react-router-dom';

function NewsItem({ news }) {
  function formatDate(inputDate) {
    const dateObj = new Date(inputDate);
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '/' + month + '/' + year;
  }

  return (
    <Link to={`/news/${news.slug}`} className="flex space-x-4">
      <img
        className="transition-all object-cover w-[210px] h-[150px] md:w-[120px] md:h-[120px] rounded-xl"
        src={news.thumbnail || DefaultImage}
        alt={news.title}
      />
      <div className="py-4 md:py-2">
        <h3 className="font-bold text-primary font-inter mb-4 text-[1.125rem] md:text-[1rem] line-clamp-3 md:mb-2">
          {news.title}
        </h3>
        <span className="md:text-[14px]">{formatDate(news.created_at)}</span>
      </div>
    </Link>
  );
}

NewsItem.propTypes = {
  news: PropTypes.object.isRequired,
};

export default NewsItem;
