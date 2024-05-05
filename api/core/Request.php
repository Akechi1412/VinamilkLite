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
        if (array_diff_key($requestData, $rules)) {
            return 'Some fields are incorrect';
        }

        foreach ($rules as $field => $rule) {
            $ruleList = explode('|', $rule);

            if (!isset($requestData[$field])) {
                if (in_array('required', $ruleList)) {
                    return "The $field field is required.";
                } else continue;
            }


            foreach ($ruleList as $singleRule) {
                $error = $this->applyRule($singleRule, $field, $requestData);
                if ($error !== true) {
                    return $error;
                }
            }
        }

        return true;
    }

    private function applyRule($rule, $field, $requestData)
    {
        $value = $requestData[$field] ?? null;

        if ($rule === 'required') {
            if ($value === null || $value === '') {
                return "The $field field is required.";
            }
        } elseif ($rule === 'email') {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return "The $field field must be a valid email address.";
            }
        } elseif ($rule === 'password') {
            if (!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/', $value)) {
                return "The $field field must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
            }
        } elseif ($rule === 'alpha') {
            if (!preg_match('/^[\p{L}\s]+$/u', $value)) {
                return "The $field field must contain only alphabetic characters.";
            }
        } elseif (strpos($rule, 'min:') === 0) {
            $minLength = (int) substr($rule, 4);
            if (mb_strlen($value) < $minLength) {
                return "The $field field must be at least $minLength characters long.";
            }
        } elseif (strpos($rule, 'max:') === 0) {
            $maxLength = (int) substr($rule, 4);
            if (mb_strlen($value) > $maxLength) {
                return "The $field field may not be greater than $maxLength characters.";
            }
        } elseif ($rule === 'int') {
            if (filter_var($value, FILTER_VALIDATE_INT) === false) {
                return "The $field field must be an integer.";
            }
        } elseif ($rule === 'float') {
            if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
                return "The $field field must be an float.";
            }
        } elseif ($rule === 'slug') {
            if (!preg_match('/^[a-zA-Z0-9-]+$/', $value)) {
                return "The $field field must be a valid slug.";
            }
        } elseif ($rule === 'role') {
            $allowedRoles = ['subscriber', 'admin'];
            if (!in_array($value, $allowedRoles)) {
                return "The $field field must be either 'subscriber' or 'admin'.";
            }
        } elseif ($rule === 'news_status') {
            $allowedStatus = ['hidden', 'published'];
            if (!in_array($value, $allowedStatus)) {
                return "The $field field must be either 'hidden' or 'published'.";
            }
        } elseif (strpos($rule, 'gte:') === 0) {
            $minValue = (int) substr($rule, 4);
            if ($value < $minValue) {
                return "The value of $field field may not be greater than $minValue.";
            }
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
        $config->set('HTML.Doctype', 'HTML 4.01 Transitional');
        $config->set('HTML.Allowed', '
            div[style|class], 
            span[style|class], 
            p[style|class], 
            br, 
            ul, 
            ol, 
            li, 
            h1, 
            h2, 
            blockquote, 
            pre, 
            a[href|target|rel], 
            img[src|alt|width|height], 
            b, 
            i, 
            u, 
            s,
            em,
            strong,
        ');

        $config->set('CSS.AllowedProperties', 'font-weight, font-style, text-decoration, text-align, list-style-type, indent');
        $config->set('URI.AllowedSchemes', array('data' => true));
        $def = $config->getHTMLDefinition(true);
        $def->addAttribute('a', 'href', 'URI');
        $def->addAttribute('a', 'rel', 'Text');
        $def->addAttribute('a', 'target', 'Text');
        $purifier = new HTMLPurifier($config);

        if (is_array($data)) {
            return $purifier->purifyArray($data);
        }

        return $purifier->purify($data);
    }
}
