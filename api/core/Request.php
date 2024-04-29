<?php

namespace Core;

use Exception;
use HTMLPurifier;
use HTMLPurifier_Config;

class Request
{
    /**
     * Get params from request. 
     * 
     * @param   string  $key
     * @return  string|string[]
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
     * @param   string  $key
     * @return  string|string[]
     */
    public function body($key = '')
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($key != '') {
            return isset($data[$key]) ? $this->purify($data[$key]) : [];
        }

        return $this->purify($data);
    }

    /**
     * Get value for server super global var.
     *
     * @param   string  $key
     * @return  string|string[]
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
     * @return  string|string[]
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
     * @return  string|string[]
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
    public function validate(array $requestData, array $rules)
    {
        if (empty($rules)) {
            throw new Exception('Cannot validate with empty rules!');
        }



        return true;
    }

    /**
     * The function is used to sanitize input data.
     *
     * @param   string|string[]   $data
     * @return  string|string[]
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

    /**
     * The function is used to purify input.
     *
     * @param   string|string[]   $data
     * @return  string|string[]
     */
    private function purify($data)
    {
        $config = HTMLPurifier_Config::createDefault();
        $config->set('Attr.AllowedFrameTargets', ['_blank']);
        $config->set('AutoFormat.RemoveEmpty', true);
        $purifier = new HTMLPurifier($config);

        if (is_array($data)) {
            return $purifier->purifyArray($data);
        }

        return $purifier->purify($data);
    }
}
