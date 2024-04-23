<?php

namespace Core;

use Exception;

class Request
{
    /**
     * Get params from request. 
     * 
     * @return  mixed
     */
    public function params($key = '')
    {
        if ($key != '') {
            return isset($_GET[$key]) ? $this->sanitize($_GET[$key]) : null;
        }

        return  $this->sanitize($_GET);
    }

    /**
     * Get body from request. 
     * 
     * @return  mixed
     */
    public function body($key = '')
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($key != '') {
            return isset($data[$key]) ? $this->sanitize($data[$key]) : [];
        }

        return $this->sanitize($data);
    }

    /**
     * Get value for server super global var.
     *
     * @param   string  $key
     * @return  string
     */
    public function server($key = '')
    {
        return isset($_SERVER[strtoupper($key)])
            ? $this->sanitize($_SERVER[strtoupper($key)])
            : $this->sanitize($_SERVER);
    }

    /**
     * Get request method.
     *
     * @return  string
     */
    public function getMethod()
    {
        return strtoupper($this->server('REQUEST_METHOD'));
    }

    /**
     *  Returns the client IP addresses.
     *
     * @return string
     */
    public function getClientIp()
    {
        return $this->server('REMOTE_ADDR');
    }

    /**
     *  Get server URI.
     *
     * @return string
     */
    public function getUri()
    {
        return $this->server('REQUEST_URI');
    }


    /**
     * Get header.
     *
     * @param   string  $key
     * @return  mixed
     */
    public function getHeader($key = '')
    {
        $headers = getallheaders();
        if ($key != '') {
            return isset($headers[$key]) ? $this->sanitize($headers[$key]) : null;
        }

        return $this->sanitize($headers);
    }

    /**
     * Get Cookie.
     *
     * @param   string  $key
     * @return  mixed
     */
    public function getCookie($key = '')
    {
        if ($key != '') {
            return isset($_COOKIE[$key]) ? $this->sanitize($_COOKIE[$key]) : null;
        }

        return  $this->sanitize($_COOKIE);
    }

    /**
     * Validate request data.
     *
     * @param   array       $requestData
     * @return  bool|string true if all rules are passed, a error message otherwise
     */
    public function validate(array $requestData)
    {
        $errors = [];
        
        // Kiểm tra trường email
        if (empty($requestData['email'])) {
            $errors['email'] = 'Email is required.';
        } elseif (!filter_var($requestData['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format.';
        } elseif (!preg_match('/@gmail\.com$/', $requestData['email'])) {
            $errors['email'] = 'Email must be a Gmail address.';
        }
    
        // Kiểm tra trường password
        if (empty($requestData['password'])) {
            $errors['password'] = 'Password is required.';
        } elseif (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/", $requestData['password'])) {
            $errors['password'] = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long.';
        }
    
        // Trả về dữ liệu JSON chứa thông tin về các lỗi nếu có
        header('Content-Type: application/json');
        echo json_encode($errors);
    }
    

    /**
     * The function is used to sanitize input data.
     *
     * @param   mixed   $data
     * @return  mixed
     */
    private function sanitize($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                unset($data[$key]);
                $data[$this->sanitize($key)] = $this->sanitize($value);
            }
        } else {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data, ENT_COMPAT, 'UTF-8');
        }

        return $data;
    }
}
// Khởi tạo một đối tượng request
$request = new Request();
var_dump($_POST); 
// Kiểm tra dữ liệu và trả về các lỗi (nếu có)
$requestData = $_POST; // Hoặc có thể là $_GET hoặc dữ liệu từ bất kỳ nguồn nào khác
$request->validate($requestData);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");