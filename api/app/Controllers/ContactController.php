<?php

namespace App\Controllers;

use Core\Controller;

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
        if (!$validationResult) {
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
     * Response contact by email.
     *
     * @return  string  The JSON response
     */
    public function response()
    {
        // todo
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
