<?php

namespace App\Controllers;

use Core\Controller;
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class AuthController extends Controller
{
    private $userModel;
    private $accessTokenName = 'access_token';
    private $refreshTokenName = 'refresh_token';

    /**
     * AuthController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->userModel = $this->model('auth');
    }

    /**
     * User register.
     * 
     * @return  string  json response
     */
    public function register()
    {
        $userData = $this->request->body();
        $validationResult = $this->request->validate($userData, [
            'email' => 'required|email|min:5|max:100|unique:users',
            'password' => 'required|password|min:8|max:20',
            'first_name' => 'required|alpha|min:1|max:50',
            'last_name' => 'required|alpha|min:1|max:50|'
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $userData['id'] = uniqid('user');
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);

        $result = $this->userModel->create($userData + ['role' => 'subscriber']);
        if ($result === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(201)->json(
            1,
            [],
            'Register successfully.'
        );
    }
    public function generateOTP($length = 6) {
        $characters = '0123456789';
        $otp = '';
        $max = strlen($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $otp .= $characters[rand(0, $max)];
        }
        return $otp;
    }
    
    public function sendOTPByEmail()
    {
        $otp = $this->generateOTP();
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $email = $this->request->params('email');
        try {       
            session_start();
            
            $_SESSION['otp_email'] = [
                'email' => $email,
                'otp' => $otp,
                
                'created_at' => time()
                
            ];
            session_write_close();
            
           
            // Thiết lập máy chủ SMTP và gửi email
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Thay đổi bằng máy chủ SMTP của bạn
            $mail->SMTPAuth = true;
            $mail->Username = 'webvinamilklite@gmail.com'; // Thay đổi bằng email của bạn
            $mail->Password = 'wrzctoqwlpvgllbh'; // Thay đổi bằng mật khẩu của bạn
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->setFrom('webvinamilklite@gmail.com', 'vinamilklite232'); // Thay đổi bằng email và tên của bạn
            $mail->addAddress($email);
            $mail->isHTML(true);
            $subject = 'Xác minh đăng ký';
            $subject_encoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
            $mail->Subject = $subject_encoded;
            $mail->Body = 'Mã OTP của bạn là: ' . $otp;
            $mail->send();
    
            return true; // Gửi email thành công
             // Lưu OTP vào session
            
        } catch (Exception $e) {
           throw $e; // Gặp lỗi khi gửi email
        }
    }
    
    public function verifyOTP()
    {
        session_start();
        $inputOTP = $this->request->params('otp');
        $sessionData = isset($_SESSION['otp_email']) ? $_SESSION['otp_email'] : null;
        // Kiểm tra xem có biến đếm lần nhập sai OTP không
        $failedAttempts = isset($_SESSION['otp_failed_attempts']) ? $_SESSION['otp_failed_attempts'] : 0;

        // Lấy dữ liệu từ session
        var_dump($_SESSION);
        
        
        // Kiểm tra xem session có chứa dữ liệu về OTP không
        if ($sessionData !== null) {
            
            $savedOTP = isset($sessionData['otp']) ? $sessionData['otp'] : '';
            $createdAt = isset($sessionData['created_at']) ? $sessionData['created_at'] : 0;
            if (time() - $createdAt > 5 * 60) { // Nếu quá 5 phút
                // Gửi lại OTP mới và cập nhật session
                
                return false;
            }
            echo $savedOTP;
            
            
            // So sánh OTP nhập vào với OTP đã lưu
            if ($savedOTP === $inputOTP ) {
                
                $_SESSION['otp_failed_attempts'] = 0;
               
                // Xác thực thành công
                echo "Xác thực thành công!";
                
                // Reset biến đếm lần nhập sai
                return true;
            } else { 
                
                
                $failedAttempts++;
                echo $failedAttempts;
                $_SESSION['otp_failed_attempts'] = $failedAttempts;
                echo "Nhập sai rồi";
                
                if ($failedAttempts >= 3) {
                    
                    session_destroy();
                    
                }
                
                return false;
                
               
    }
    
    }
    
    }


    /**
     * User login.
     * 
     * @return  string  json response
     */
    public function login()
    {
        $userData = $this->request->body();
        $validationResult = $this->request->validate($userData, [
            'email' => 'required|email',
            'password' => 'required|password',
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $data = $this->userModel->getByEmail($userData['email']);
        if (empty($data)) {
            return $this->response->status(401)->json(
                0,
                [],
                'Email or password is incorrect!'
            );
        }
        $check = password_verify($userData['password'], $data['password']);
        if ($check) {
            $accessExpireIn = 60 * 60; // expire in 1 hour 
            $accessToken = generateJwtToken($data['id'], $_ENV['ACCESS_SECRET_KEY'], $accessExpireIn);
            $this->response->setCookie($this->accessTokenName, $accessToken, time() + $accessExpireIn);

            $refreshExpireIn = 24 * 60 * 60; // expire in 1 day 
            $refeshToken = generateJwtToken($data['id'], $_ENV['REFRESH_SECRET_KEY'], $refreshExpireIn);
            $this->response->setCookie($this->refreshTokenName, $refeshToken, time() + $refreshExpireIn);

            unset($data['id']);
            unset($data['password']);

            return $this->response->status(200)->json(
                1,
                ['profile' => $data],
                'Login successfully.'
            );
        } else {
            return $this->response->status(401)->json(
                0,
                [],
                'Email or password is incorrect!'
            );
        }
    }

    /**
     * User logout.
     * 
     * @return  mixed
     */
    public function logout()
    {
        $check = $this->response->setCookie($this->accessTokenName, '', time() - 3600);
        $this->response->setCookie($this->refreshTokenName, '', time() - 3600);
        if ($check) {
            return $this->response->status(200)->json(
                1,
                [],
                'Logout successfully.'
            );
        }

        return $this->response->status(204, false);
    }

    /**
     * Refresh.
     * 
     * @return  string  json response
     */
    public function refresh()
    {
        $refeshToken = $this->request->getCookie($this->refreshTokenName);
        if (!$refeshToken) {
            return $this->response->status(401)->json(
                0,
                [],
                'Unauthorized!'
            );
        }

        try {
            $decodedPayload = validateJwtToken($refeshToken, $_ENV['REFRESH_SECRET_KEY']);
            $userId = $decodedPayload['userId'];
            $accessExpireIn = 60 * 60; // expire in 1 hour 
            $accessToken = generateJwtToken($userId, $_ENV['ACCESS_SECRET_KEY'], $accessExpireIn);
            $this->response->setCookie($this->accessTokenName, $accessToken, time() + $accessExpireIn);

            $data = $this->userModel->getById($userId);
            unset($data['id']);
            unset($data['password']);

            return $this->response->status(200)->json(
                1,
                ['profile' => $data],
                'Refresh successfully.'
            );
        } catch (Exception $error) {
            return $this->response->status(401)->json(
                0,
                [],
                'Unauthorized!'
            );
        }
    }

    /**
     * Update profile.
     * 
     * @return  string  json response
     */
    public function updateProfile()
    {
        // todo
    }
}
