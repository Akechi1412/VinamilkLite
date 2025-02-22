<?php

namespace App\Controllers;

use Core\Controller;

class CommentController extends Controller
{
    private $commentModel;

    /**
     * commentController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->commentModel = $this->model('comment');
    }

    /**
     * Get comments.
     *
     * @return  string  The JSON response
     */
    public function getComments()
    {
        $queryParams = $this->request->params();
        $comment = $this->commentModel->getMultiple($queryParams);

        if ($comment === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $comment,
        );
    }

    /**
     * Get a comment by ID.
     *
     * @param    int         $id The ID of the comment to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $comment = $this->commentModel->getById($id);

        if ($comment === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $comment
        );
    }

    /**
     * Create a new comment.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $commentData = $this->request->body();
        $validationResult = $this->request->validate($commentData, [
            'product_id' => '',
            'news_id' => '',
            'content' => 'required',
            'parent_id' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        if (!isset(($commentData['product_id'])) xor isset($commentData['news_id'])) {
            return $this->response->status(400)->json(
                0,
                [],
                "Only one of product_id or news_id is required!"
            );
        }

        if (isset($commentData['parent_id'])) {
            $result = $this->commentModel->getById($commentData['parent_id']);
            if (empty($result)) {
                return $this->response->status(400)->json(
                    0,
                    [],
                    "parent_id is not existed!"
                );
            }
        }

        $commentData['user_id'] = $GLOBALS['userId'];
        $datetime = date('Y-m-d H:i:s');
        $commentData['created_at'] = $datetime;
        $commentData['updated_at'] = $datetime;

        $result = $this->commentModel->create($commentData);
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
            'Comment created successfully.'
        );
    }

    /**
     * Update a comment with some attributes.
     *
     * @param    int        $id The ID of the comment to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $commentData = $this->request->body();
        if (empty($commentData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($commentData, [
            'content' => 'required',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $comment = $this->commentModel->getById($id);
        if (!$comment) {
            return $this->response->status(404)->json(
                0,
                [],
                'Comment not found!'
            );
        }
        if (!$GLOBALS['isAdmin'] && $comment['user_id'] !== $GLOBALS['userId']) {
            return $this->response->status(403)->json(
                0,
                [],
                'You do not have permission to edit this comment!'
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $commentData['updated_at'] = $datetime;

        $result = $this->commentModel->update($commentData, $id);
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
            'Comment updated successfully.'
        );
    }

    /**
     * Delete a comment.
     *
     * @param    int        $id The ID of the comment to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $comment = $this->commentModel->getById($id);
        if (!$comment) {
            return $this->response->status(404)->json(
                0,
                [],
                'Comment not found!'
            );
        }
        if (!$GLOBALS['isAdmin'] && $comment['user_id'] !== $GLOBALS['userId']) {
            return $this->response->status(403)->json(
                0,
                [],
                'You do not have permission to delete this comment!'
            );
        }

        $result = $this->commentModel->delete($id);

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
            'Comment deleted successfully.'
        );
    }
}
