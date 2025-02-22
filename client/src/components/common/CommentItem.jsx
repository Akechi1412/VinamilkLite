import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { userApi } from '../../api';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';
import ReplyIcon from '../../assets/images/reply-svgrepo-com.svg';
import { useAuth } from '../../hooks';
import { UserCacheContext } from '../../contexts';

function CommentItem({ comment, isParent, handleReply, handleEdit, handleDelete }) {
  const [info, setInfo] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { profile } = useAuth();
  const { userCache, setUserCache } = useContext(UserCacheContext);
  const maxLength = 200;

  const renderContent = () => {
    if (isExpanded || comment.content.length <= maxLength) {
      return comment.content;
    }
    return comment.content.slice(0, maxLength) + '...';
  };

  const timeAgo = (createdAt) => {
    if (!createdAt) return 'Vừa xong';

    const now = new Date();
    const past = new Date(createdAt);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  };

  useEffect(() => {
    if (!comment.user_id) return;
    if (userCache[comment.user_id]) {
      setInfo(userCache[comment.user_id]);
      return;
    }

    (async () => {
      const { data: infoData } = await userApi.getPublicInfo(comment.user_id);
      setInfo(infoData);
      setUserCache((prev) => ({ ...prev, [comment.user_id]: infoData }));
    })();
  }, [comment.user_id, userCache, setUserCache]);

  return (
    <div className={`mt-2 flex space-x-4 ${!isParent && 'pl-10 sm:pl-8'}`}>
      <img
        className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
        src={info.avatar || DefaultAvatar}
        alt="Avatar"
      />
      <div className="flex-1">
        <div className="mb-1 flex justify-between items-center w-full space-x-4">
          <div>
            <span className="font-semibold">{info.last_name + ' ' + info.first_name}</span>
            <span> - </span>
            <span className="text-vinamilk-blue-light whitespace-nowrap">
              {timeAgo(comment.created_at)}
            </span>
          </div>
          {isParent && (
            <button className="transition-all hover:-translate-y-1" onClick={() => handleReply()}>
              <img className="w-7" src={ReplyIcon} alt="" />
            </button>
          )}
        </div>
        <p>
          {renderContent()}
          {comment.content.length > maxLength && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-vinamilk-blue-light">
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </p>
        {comment?.user_id === profile?.id && (
          <div className="space-x-3">
            <button
              className="text-vinamilk-blue-light transition-all hover:text-primary"
              onClick={handleEdit}
            >
              Chỉnh sửa
            </button>
            <button
              className="text-vinamilk-blue-light transition-all hover:text-primary"
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  isParent: PropTypes.bool,
  handleReply: PropTypes.func,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  userCache: PropTypes.object,
  setUserCache: PropTypes.func,
};

export default CommentItem;
