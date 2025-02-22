import { useState } from 'react';
import PropTypes from 'prop-types';
import TextArea from './TextArea';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import DefaultAvatar from '../../assets/images/default-avatar.jpg';

function CommentInput({ value, handleSubmit, type, handleCancel }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState(value || '');
  const maxLength = 500;

  const handleFocus = (event) => {
    if (profile) return;

    event.target.blur();
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa đăng nhập',
      text: 'Vui lòng đăng nhập để có thể bình luận',
      showCancelButton: true,
      confirmButtonText: 'Đăng nhập',
      cancelButtonText: 'Ở lại',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleClick = () => {
    if (!comment.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Bình luận là bắt buộc',
        text: 'Bình luận không được để trống',
      });
      return;
    }
    if (comment.length > maxLength) {
      Swal.fire({
        icon: 'error',
        title: 'Bình luận quá dài',
        text: 'Bình luận tối đa 500 ký tự',
      });
      return;
    }
    handleSubmit(comment);
    setComment('');
  };

  return (
    <div
      className={`rounded-md p-4 border border-primary max-w-xl mb-5 ${
        (type === 'reply' || type === 'editReply') && 'ml-10 sm:ml-8'
      }`}
    >
      <div className="flex">
        {profile && (
          <img
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 mr-2"
            src={profile.avatar || DefaultAvatar}
            alt="Avatar"
          />
        )}
        <TextArea
          placeholder="Nhập bình luận..."
          value={comment}
          handleChange={handleChange}
          handleFocus={handleFocus}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-vinamilk-blue-light">
          {comment.length}/{maxLength}
        </span>
        <div>
          <button
            onClick={handleClick}
            className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-80 transition"
          >
            {type === 'comment' ? 'Gửi' : type === 'reply' ? 'Trả lời' : 'Sửa'}
          </button>
          {(type === 'reply' || type === 'edit' || type === 'editReply') && (
            <button
              onClick={() => handleCancel()}
              className="ml-2 border border-primary text-primary px-4 py-2 rounded-md hover:opacity-80 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

CommentInput.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default CommentInput;
