import PropTypes from 'prop-types';
import CommentItem from './CommentItem';
import { useState, useEffect } from 'react';
import { commentApi } from '../../api';
import Swal from 'sweetalert2';
import CommentInput from './CommentInput';
import Loading from './Loading';

function CommentBlock({ parentComment, inNews, fetchParentComments }) {
  const [childrenComments, setChildrenComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEditParent, setShowEditParent] = useState(false);
  const [showEditChild, setShowEditChild] = useState(false);
  const handleSubmit = async (comment) => {
    setShowChildren(true);
    setShowInput(false);

    try {
      if (inNews) {
        await commentApi.create({
          news_id: parentComment.news_id,
          content: comment,
          parent_id: parentComment.id,
        });
      } else {
        await commentApi.create({
          product_id: parentComment.product_id,
          content: comment,
          parent_id: parentComment.id,
        });
      }
      Swal.fire({
        title: 'Đã gửi!',
        text: 'Bình luận đã được gửi thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchComments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data: commentData } = await commentApi.getComments(
        `parent_id=${parentComment.id}&_sort=created_at`
      );
      setChildrenComments(commentData.rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const handleEdit = async (commentId, comment) => {
    if (commentId === parentComment.id) {
      setShowEditParent(false);
    } else {
      setShowEditChild(false);
    }

    try {
      await commentApi.update(commentId, {
        content: comment,
      });
      Swal.fire({
        title: 'Đã sửa!',
        text: 'Bình luận đã được cập nhật thành công.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
      if (parentComment?.id === commentId) {
        fetchParentComments?.();
      } else {
        fetchComments?.();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa bình luận',
        text: 'Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy',
      });

      if (result.isConfirmed) {
        setLoading(true);
        await commentApi.delete(commentId);
        setLoading(false);
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Bình luận đã được xóa thành công.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        if (parentComment?.id === commentId) {
          fetchParentComments?.();
        } else {
          fetchComments?.();
        }
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (!parentComment) return;

    fetchComments();
  }, [parentComment]);

  return (
    <div className="space-y-3">
      <CommentItem
        isParent
        comment={parentComment}
        handleReply={() => setShowInput((show) => !show)}
        handleDelete={() => handleDelete(parentComment.id)}
        handleEdit={() => setShowEditParent((show) => !show)}
      />
      {showEditParent && (
        <CommentInput
          value={parentComment.content}
          handleSubmit={(comment) => handleEdit(parentComment.id, comment)}
          type={'edit'}
          handleCancel={() => setShowEditParent(false)}
        />
      )}
      {childrenComments?.length > 0 && !showChildren && (
        <button
          onClick={() => setShowChildren(true)}
          className="ml-14 sm:ml-12 text-vinamilk-blue-light"
        >
          {childrenComments?.length} câu trả lời
        </button>
      )}
      {showInput && (
        <CommentInput
          handleSubmit={handleSubmit}
          type={'reply'}
          handleCancel={() => setShowInput(false)}
        />
      )}
      <div className="space-y-2">
        {showChildren &&
          (loading ? (
            <Loading />
          ) : (
            childrenComments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  handleDelete={() => handleDelete(comment.id)}
                  handleEdit={() => setShowEditChild((show) => !show)}
                />
                {showEditChild && (
                  <CommentInput
                    value={comment.content}
                    handleSubmit={(commentContent) => handleEdit(comment.id, commentContent)}
                    type={'editReply'}
                    handleCancel={() => setShowEditChild(false)}
                  />
                )}
              </div>
            ))
          ))}
      </div>
    </div>
  );
}

CommentBlock.propTypes = {
  parentComment: PropTypes.object.isRequired,
  inNews: PropTypes.bool,
  fetchParentComments: PropTypes.func,
};

export default CommentBlock;
