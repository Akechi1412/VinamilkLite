import PropTypes from 'prop-types';
import EllipsisIcon from '../../assets/images/ellipsis.svg';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { contactApi } from '../../api';
import { Button, Input, Loading } from '../admin';
import { Overlay } from '../../components/common';
import CloseIcon from '../../assets/images/close-dark.svg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function ContactTable({ contactRows, handleMutate }) {
  const [loading, setLoading] = useState(false);
  const [actionsExpandedId, setActionsExpandedId] = useState(null);
  const [detailView, setDetailView] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [bodyError, setBodyError] = useState('');

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (subject.trim() === '') {
      setSubjectError('Tiêu đề là bắt buộc');
      return;
    } else {
      setSubjectError('');
    }
    if (body.trim() === '') {
      setBodyError('Nội dung là bắt buộc');
      return;
    } else {
      setBodyError('');
    }

    setLoading(true);
    try {
      await contactApi.response(detailView.id, {
        subject: subject,
        body: body,
      });
      setLoading(false);
      setSubject('');
      setBody('');
      handleMutate();
      Swal.fire({
        icon: 'success',
        title: 'Gửi phản hồi thành công!',
      });
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa liên hệ này',
      text: 'Bạn sẽ không thể hoàn tác lại',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok, xóa đi',
      cancelButtonText: 'Hủy',
    });
    if (result.isConfirmed) {
      setLoading(true);
      try {
        await contactApi.delete(id);
        handleMutate();
        setActionsExpandedId(null);
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
        });
      } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Something went wrong!';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    }
  };

  const handleChangeStatus = async (id, status) => {
    setLoading(true);
    try {
      await contactApi.update(id, { solved: status });
      setActionsExpandedId(null);
      setLoading(false);
      handleMutate();
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

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">ID</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Họ và tên</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Email</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Nội dung</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Tình trạng
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Ngày tạo</th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">
              Ngày cập nhật
            </th>
            <th className="bg-gray-50 text-gray-800 py-2 px-3 font-[400] text-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contactRows.map((contact) => (
            <tr key={contact.id}>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">{contact.id}</td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {contact.full_name}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {contact.email}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-10">
                <p className="line-clamp-2 overflow-hidden">{contact.content}</p>
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {contact.solved === 0 ? 'Chưa giải quyết' : 'Đã giải quyết'}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {contact.created_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100 whitespace-nowrap">
                {contact.updated_at}
              </td>
              <td className="py-2 px-3 border-b text-gray-600 border-b-gray-100">
                <div className="h-full relative flex justify-center items-center">
                  <div
                    onClick={() =>
                      setActionsExpandedId((id) => (contact.id === id ? null : contact.id))
                    }
                    className="p-2 cursor-pointer"
                  >
                    <img className="w-4 h-4" src={EllipsisIcon} alt="..." />
                  </div>
                  {actionsExpandedId === contact.id && (
                    <div className="absolute z-[1] bottom-0 -translate-x-full translate-y-1 left-0 min-w-[80px] rounded-md shadow-md bg-secondary py-2">
                      <ul className="overflow-y-auto text-nowrap">
                        <li>
                          {contact.solved === 0 ? (
                            <button
                              onClick={() => handleChangeStatus(contact.id, 1)}
                              className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-green-500 hover:bg-gray-50"
                            >
                              Đánh dấu đã xong
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeStatus(contact.id, 0)}
                              className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-yellow-500 hover:bg-gray-50"
                            >
                              Đánh dấu chưa xong
                            </button>
                          )}
                        </li>
                        <li>
                          <button
                            onClick={() => setDetailView(contact)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                          >
                            Xem chi tiết
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="w-full text-left text-[13px] py-1 px-3 text-gray-600 hover:text-red-500 hover:bg-gray-50"
                          >
                            Xóa
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detailView && (
        <Overlay handleClickOut={() => setDetailView(null)}>
          <div className="ml-auto bg-secondary min-h-full w-[600px] max-w-full p-6 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-2xl font-semibold">Chi tiết liên hệ</h4>
              <img
                onClick={() => setDetailView(null)}
                className="cursor-pointer w-5 h-5 object-cover"
                src={CloseIcon}
                alt="X"
              />
            </div>
            <div>
              <div className="mb-3">
                <label className="block text-gray-700 font-bold mb-1">Email:</label>
                <p className="text-gray-900">{detailView.email}</p>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-bold mb-1">Họ và tên:</label>
                <p className="text-gray-900">{detailView.full_name}</p>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-bold mb-1">Nội dung liên hệ:</label>
                <p className="text-gray-900">{detailView.content}</p>
              </div>
            </div>
            <h5 className="text-xl font-[500] mt-4">Phản hồi qua email</h5>
            <form method="post" action="" onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Tiêu đề*</label>
                <Input
                  placeholder="Nhập tiêu đề phản hồi*"
                  value={subject}
                  handleChange={(event) => setSubject(event.target.value)}
                  type="text"
                  name="subject"
                />
                {subjectError && <p className="text-red-600 mt-1 font-inter">{subjectError}</p>}
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-2">Nội dung*</p>
                <ReactQuill
                  theme="snow"
                  id="body"
                  value={body}
                  onChange={setBody}
                  modules={modules}
                />
                {bodyError && <p className="text-red-600 mt-1 font-inter">{bodyError}</p>}
              </div>
              <div className="mt-6 flex space-x-2">
                <div className="flex-1">
                  <Button title="Gửi" type="submit" />
                </div>
              </div>
            </form>
          </div>
        </Overlay>
      )}
      {loading && <Loading fullScreen />}
    </>
  );
}

ContactTable.propTypes = {
  contactRows: PropTypes.array.isRequired,
  handleMutate: PropTypes.func.isRequired,
};

export default ContactTable;
