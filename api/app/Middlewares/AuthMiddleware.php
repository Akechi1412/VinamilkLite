<?php

namespace App\Middlewares;

use Core\Middleware;
use Exception;

class AuthMiddleware extends Middleware
{
    private $adminRight = false;
    private $passwordChange = false;
    private $userModel;
    private $accessTokenName;

    public function __construct($adminRight = false, $passwordChange = false)
    {
        parent::__construct();
        $this->adminRight = $adminRight;
        $this->passwordChange = $passwordChange;
        $this->userModel = $this->model('auth');
        $this->accessTokenName = 'access_token';
    }

    public function handle()
    {
        $accessToken = $this->request->getCookie($this->accessTokenName);
        if (!$accessToken) {
            $this->statusCode = 401;
            $this->message = 'Unauthorized!';
            return false;
        }

        try {
            $decodedPayload = validateJwtToken($accessToken, $_ENV['ACCESS_SECRET_KEY']);
            $userId = $decodedPayload['userId'];
            $GLOBALS['userId'] = $userId;
            $userRole = 'subscriber';
            $userData = $this->userModel->getById($userId);

            if ($this->adminRight) {
                if (isset($userData['role'])) {
                    $userRole = $userData['role'];
                }
                if ($userRole !== 'admin') {
                    $this->statusCode = 403;
                    $this->message = 'Forbidden!';
                    return false;
                }
            }

            $banExpired = $userData['ban_expired'];
            if ($banExpired !== null && strtotime($banExpired) > time()) {
                $this->response->setCookie($this->accessTokenName, '', time() - 3600);
                $this->statusCode = 401;
                $this->message = 'Your account is banned, expiration time is ' . $banExpired . '!';
                return false;
            }

            if ($this->passwordChange) {
                $bodyData = $this->request->body();
                $currentPassword = isset($bodyData['current_password']) ? $bodyData['current_password'] : null;
                if ($currentPassword === null) {
                    $this->statusCode = 400;
                    $this->message = 'Missing current password!';
                    return false;
                }
                if (!password_verify($currentPassword, $userData['password'])) {
                    $this->statusCode = 400;
                    $this->message = 'Current password is incorrect!';
                    return false;
                }
            }

            return true;
        } catch (Exception $error) {
            $this->statusCode = 401;
            $this->message = $error->getMessage();

            return false;
        }
    }
}
