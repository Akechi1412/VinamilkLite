<?php

namespace App\Controllers;

use Core\Controller;
use Exception;
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
            'email' => 'required|email',
            'password' => 'required|password|min:8|max:20',
            'first_name' => 'required|alpha|min:2|max:30',
            'last_name' => 'required|alpha|min:2|max:30|'
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $_SESSION['user_data'] = $userData;

        if (!$this->sendOtpByEmail($userData['email'])) {
            return $this->response->status(500)->json(
                0,
                [],
                'Can not send OTP!'
            );
        }

        return $this->response->status(200)->json(
            1,
            [],
            'Valid registration data.'
        );
    }

    /**
     * Send OTP by Email.
     * 
     * @param   string  email
     * @return  bool  true is success
     */
    private function sendOtpByEmail($email)
    {
        $otp = generateOtp();
        try {
            $_SESSION['otp_info'] = [
                'email' => $email,
                'otp' => $otp,
                'created_at' => time()
            ];

            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $_ENV['MAIL_USERNAME'];
            $mail->Password = $_ENV['MAIL_APP_PASSWORD'];
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->setFrom($_ENV['MAIL_USERNAME'], $_ENV['MAIL_PASSWORD']);
            $mail->addAddress($email);
            $mail->isHTML(true);
            $subject = 'Vinamilk - Xác minh đăng ký';
            $subject_encoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
            $mail->Subject = $subject_encoded;
            $mail->Body =
                '<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        text-align: center;
                    }
                    .otp {
                        font-size: 24px;
                        font-weight: bold;
                        color: #0213AF;
                        margin: 20px 0;
                    }
                    .expiry {
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h1>Vinamilk xin chào,</h1>
                    <p>Cảm ơn bạn đã đăng ký tài khoản trên trang web của chúng tôi.<p/>
                    <p>Đây là mã OTP của bạn:</p>
                    <div class="otp">' . $otp . '</div>
                    <p class="expiry">Mã OTP này sẽ hết hạn sau 5 phút.</p>
                    <p>Vui lòng không chia sẻ mã OTP này với bất kỳ ai.</p>
                </div>
            </body>
            </html>';
            $mail->isHTML(true);
            $mail->send();

            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Resend OTP
     *  @return  string  json response
     */
    public function resendOtp()
    {
        $otpInfo = isset($_SESSION['otp_info']) ? $_SESSION['otp_info'] : null;

        if ($otpInfo !== null) {
            $savedEmail = isset($otpInfo['email']) ? $otpInfo['email'] : '';
            $createdAt = isset($otpInfo['created_at']) ? $otpInfo['created_at'] : 0;

            if (time() - $createdAt < 60) {
                return $this->response->status(400)->json(
                    0,
                    [],
                    'Each resending of the OTP code must be 1 minute apart!'
                );
            }

            $this->sendOtpByEmail($savedEmail);
            return $this->response->status(200)->json(
                1,
                [],
                'Resend OTP successfully'
            );
        }

        return $this->response->status(400)->json(
            0,
            [],
            'No OTP information has been saved'
        );
    }

    /**
     * Verify OTP
     *  @return  string  json response
     */
    public function verifyOtp()
    {
        $optData = $this->request->body();
        $validationResult = $this->request->validate($optData, [
            'otp' => 'required|otp',
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $inputOtp = $optData['otp'];
        $otpInfo = isset($_SESSION['otp_info']) ? $_SESSION['otp_info'] : null;
        $failedAttempts = isset($_SESSION['otp_failed_attempts']) ? $_SESSION['otp_failed_attempts'] : 0;

        if ($otpInfo !== null) {
            $savedEmail = isset($otpInfo['email']) ? $otpInfo['email'] : '';
            $savedOtp = isset($otpInfo['otp']) ? $otpInfo['otp'] : '';
            $createdAt = isset($otpInfo['created_at']) ? $otpInfo['created_at'] : 0;
            if (time() - $createdAt > 5 * 60) {
                $this->sendOtpByEmail($savedEmail);
                return $this->response->status(400)->json(
                    0,
                    [],
                    'OTP expired, resending new OTP...'
                );
            }
            if ($savedOtp === $inputOtp) {
                $_SESSION['otp_failed_attempts'] = 0;
                $userData = $_SESSION['user_data'];
                $userData['id'] = uniqid('user');
                $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);

                $datetime = date('Y-m-d H:i:s');
                $userData['created_at'] = $datetime;
                $userData['updated_at'] = $datetime;

                $result = $this->userModel->create($userData + ['role' => 'subscriber']);
                if ($result === false) {
                    return $this->response->status(500)->json(
                        0,
                        [],
                        'Something was wrong!'
                    );
                }

                unset($_SESSION['otp_failed_attempts']);
                unset($_SESSION['otp_info']);
                unset($_SESSION['user_data']);

                return $this->response->status(200)->json(
                    1,
                    [],
                    'Valid OTP, successful registration'
                );
            } else {
                $failedAttempts++;
                $_SESSION['otp_failed_attempts'] = $failedAttempts;

                if ($failedAttempts >= 3) {
                    unset($_SESSION['otp_failed_attempts']);
                    unset($_SESSION['otp_info']);
                    return $this->response->status(400)->json(
                        0,
                        [],
                        'Invalid OTP, failed attempts too many times!'
                    );
                }

                return $this->response->status(400)->json(
                    0,
                    [],
                    'Invalid OTP, failed attempts!'
                );
            }
        }

        return $this->response->status(400)->json(
            0,
            [],
            'No OTP information has been saved'
        );
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
        $userData = $this->request->body();
        if (empty($userData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($userData, [
            'avatar' => 'max:255',
            'first_name' => 'alpha|min:2|max:30',
            'last_name' => 'alpha|min:2|max:30',
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $userData['updated_at'] = $datetime;

        $result = $this->userModel->update($userData, $GLOBALS['userId']);
        if ($result === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            [],
            'Update profile successfully.'
        );
    }

    /**
     * Change password.
     * 
     * @return  string  json response
     */
    public function changePassword()
    {
        $userData = $this->request->body();
        $validationResult = $this->request->validate($userData, [
            'password' => 'required|password|min:8|max:20',
        ]);
        if (!$validationResult) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        unset($userData['current_password']);
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        $datetime = date('Y-m-d H:i:s');
        $userData['updated_at'] = $datetime;

        $result = $this->userModel->update($userData, $GLOBALS['userId']);
        if ($result === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            [],
            'Change password successfully.'
        );
    }
}
