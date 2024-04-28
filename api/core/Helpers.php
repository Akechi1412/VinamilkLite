<?php

use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\Key;

/**
 * The function is used to sanitize input data.
 *
 * @param   string  $data The input data to be sanitized.
 * @return  string  The sanitized data.
 */
function sanitize($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_COMPAT, 'UTF-8');

    return $data;
}

/**
 * The cleanUrl function is used to sanitize a URL, replacing spaces with hyphens.
 *
 * @param   string  $url The URL to be sanitized.
 * @return  string  The sanitized URL.
 */
function cleanUrl($url)
{
    return str_replace(['%20', ' '], '-', $url);
}

/**
 * Generate JSON web token.
 *
 * @param   string  $userId
 * @param   string  $secretKey
 * @param   int     $expireIn
 * @return  string  token
 */
function generateJwtToken($userId, $secretKey, $expireIn)
{
    $issuedAt = time();
    $expiredAt = $issuedAt + $expireIn;

    $payload = array(
        'iss' => 'VinamilkLite',
        'iat' => $issuedAt,
        'nbf' => $issuedAt,
        'exp' => $expiredAt,
        'userId' => $userId
    );

    return JWT::encode($payload, $secretKey, 'HS256');
}

/**
 * Validate JSON web token.
 *
 * @param   string  $jwt
 * @param   string  $secretKey
 * @return  array
 */
function validateJwtToken($jwt, $secretKey)
{
    try {
        return (array)JWT::decode($jwt, new Key($secretKey, 'HS256'));
    } catch (ExpiredException $e) {
        throw new Exception('Token expired');
    } catch (SignatureInvalidException $e) {
        throw new Exception('Invalid token signature');
    } catch (BeforeValidException $e) {
        throw new Exception('Token not valid yet');
    } catch (Exception $e) {
        throw new Exception('Invalid token');
    }
}

/**
 * Generate OTP.
 *
 * @param   int     $length
 * @return  string  OTP
 */
function  generateOtp($length = 6)
{
    $characters = '0123456789';
    $otp = '';
    $max = strlen($characters) - 1;
    for ($i = 0; $i < $length; $i++) {
        $otp .= $characters[rand(0, $max)];
    }
    return $otp;
}
