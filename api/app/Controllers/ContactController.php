<?php

namespace App\Controllers;

use Core\Controller;
use Exception;
use PHPMailer\PHPMailer\PHPMailer;

class ContactController extends Controller
{
    private $contactModel;

    /**
     * ContactController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->contactModel = $this->model('contact');
    }

    /**
     * Get contacts.
     *
     * @return  string  The JSON response
     */
    public function getContacts()
    {
        $queryParams = $this->request->params();
        $contacts = $this->contactModel->getMultiple($queryParams);

        if ($contacts === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $contacts,
        );
    }

    /**
     * Get a contact by ID.
     *
     * @param    int         $id The ID of the contact to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $contact = $this->contactModel->getById($id);

        if ($contact === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $contact
        );
    }

    /**
     * Create a new contact.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $contactData = $this->request->body();
        $validationResult = $this->request->validate($contactData, [
            'full_name' => 'required|alpha|min:2|max:50',
            'email' => 'required|email',
            'content' => 'required|max:10000',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $contactData['created_at'] = $datetime;
        $contactData['updated_at'] = $datetime;

        $result = $this->contactModel->create($contactData);
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
            'Contact created successfully.'
        );
    }

    /**
     * Update a contact with some attributes.
     *
     * @param    int        $id The ID of the contact to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $contactData = $this->request->body();
        if (empty($contactData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($contactData, [
            'solved' => 'int',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $contactData['updated_at'] = $datetime;

        $result = $this->contactModel->update($contactData, $id);
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
            'Contact updated successfully.'
        );
    }

    /**
     * Response contact by email.
     *
     * @return  string  The JSON response
     */
    public function response($id)
    {
        $contactData = $this->request->body();
        $validationResult = $this->request->validate($contactData, [
            'subject' => 'required',
            'body' => 'required',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $data = $this->contactModel->getById($id);

        if (empty($data)) {
            return $this->response->status(400)->json(
                0,
                [],
                'Contact does not not exist to response!'
            );
        }

        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $_ENV['MAIL_USERNAME'];
            $mail->Password = $_ENV['MAIL_APP_PASSWORD'];
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;
            $mail->setFrom($_ENV['MAIL_USERNAME'], $_ENV['MAIL_PASSWORD']);
            $mail->addAddress($data['email']);
            $mail->isHTML(true);
            $subject_encoded = '=?UTF-8?B?' . base64_encode($contactData['subject']) . '?=';
            $mail->Subject = $subject_encoded;
            $mail->Body = $contactData['body'];
            $mail->send();
        } catch (Exception $error) {
            throw $error;
        }

        $this->contactModel->update(['solved' => 1], $id);

        return $this->response->status(200)->json(
            1,
            [],
            'Send response successfully'
        );
    }

    /**
     * Delete a contact.
     *
     * @param    int        $id The ID of the contact to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->contactModel->delete($id);

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
            'Contact deleted successfully.'
        );
    }
}
