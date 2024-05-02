import { Button } from '../../components/common';
import { EmptyLayout } from '../../components/layout';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <EmptyLayout className="h-screen">
      <div className="bg-tertiary text-primary h-full">
        <div className="h-full container px-20 lg:px-16 md:px-12 sm:px-6">
          <div className="h-full flex items-center space-x-4 lg:flex-col lg:justify-center lg:items-start lg:space-x-0">
            <div className="flex-1 lg:flex flex-col justify-end">
              <h2 className="max-w-[300px] lg:max-w-full font-vsd-bold text-[5rem] sm:text-[3rem] uppercase">
                Trang không tìm thấy
              </h2>
            </div>
            <div className="flex-1">
              <h4 className="text-[2.5rem] sm:text-[2rem] font-vs-std mb-3">Lỗi 404!</h4>
              <p className="font-inter sm:text-base text-[1.125rem]">
                Trang bạn đang tìm kiếm không tồn tại.
              </p>
              <p className="font-inter sm:text-base text-[1.125rem]">
                Nó có thể đã được di chuyển hoặc xóa
              </p>
              <div className="w-[250px] mt-4">
                <Button handleClick={() => navigate('/', { replace: true })} title="Về trang chủ" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmptyLayout>
  );
}
export default NotFoundPage;
