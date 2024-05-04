<?php

namespace App\Controllers;

use Core\Controller;

class UserController extends Controller
{
    private $userModel;

    /**
     * UserController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->userModel = $this->model('user');
    }

    /**
     * Get users.
     *
     * @return  string  The JSON response
     */
    public function getUsers()
    {
        $queryParams = $this->request->params();
        $users = $this->userModel->getMultiple($queryParams);

        if ($users === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $users,
        );
    }

    /**
     * Get a user by ID.
     *
     * @param    int         $id The ID of the user to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $user = $this->userModel->getById($id);

        if ($user === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $user
        );
    }

    /**
     * Create a new user.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $userData = $this->request->body();
        $validationResult = $this->request->validate($userData, [
            'email' => 'required|email',
            'password' => 'required|password|min:8|max:20',
            'first_name' => 'required|alpha|min:2|max:30',
            'last_name' => 'required|alpha|min:2|max:30|',
            'role' => 'role',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $result = $this->userModel->getByEmail($userData['email']);
        if (!empty($result)) {
            return $this->response->status(400)->json(
                0,
                [],
                'Email existed!'
            );
        }

        $userData['id'] = uniqid('user');
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);

        $datetime = date('Y-m-d H:i:s');
        $userData['created_at'] = $datetime;
        $userData['updated_at'] = $datetime;

        $result = $this->userModel->create($userData);
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
            'User created successfully.'
        );
    }

    /**
     * Update a user with some attributes.
     *
     * @param    int        $id The ID of the user to update
     * @return   string     The JSON response
     */
    public function update($id)
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
            'email' => 'email',
            'password' => 'password|min:8|max:20',
            'first_name' => 'alpha|min:2|max:30',
            'last_name' => 'alpha|min:2|max:30|',
            'role' => 'role'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        if (isset($userData['password'])) {
            $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        }
        if (isset($userData['ban_expired'])) {
            $userData['ban_expired'] = date('Y-m-d H:i:s', time() + $userData['ban_expired']);
        }

        $datetime = date('Y-m-d H:i:s');
        $userData['updated_at'] = $datetime;

        $result = $this->userModel->update($userData, $id);
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
            'User updated successfully.'
        );
    }

    /**
     * Delete a user.
     *
     * @param    int        $id The ID of the user to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->userModel->delete($id);

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
            'User deleted successfully.'
        );
    }
}
