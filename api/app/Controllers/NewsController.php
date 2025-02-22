<?php

namespace App\Controllers;

use Core\Controller;

class newsController extends Controller
{
    private $newsModel;

    /**
     * newsController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->newsModel = $this->model('news');
    }

    /**
     * Get news.
     *
     * @return  string  The JSON response
     */
    public function getNews()
    {
        $queryParams = $this->request->params();
        $news = $this->newsModel->getMultiple($queryParams);

        if ($news === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $news,
        );
    }

    /**
     * Get a news by ID.
     *
     * @param    int         $id The ID of the news to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $news = $this->newsModel->getById($id);

        if ($news === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $news
        );
    }

    /**
     * Create a new news.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $newsData = $this->request->body();
        $validationResult = $this->request->validate($newsData, [
            'title' => 'required|max:255',
            'slug' => 'required|max:255',
            'thumbnail' => 'min:1|max:255',
            'status' => 'news_status',
            'content' => '',
            'category_id' => 'int',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $result = $this->newsModel->getBySlug($newsData['slug']);
        if (!empty($result)) {
            return $this->response->status(400)->json(
                0,
                [],
                "news slug existed!"
            );
        }

        $newsData['id'] = uniqid('news');

        $newsData['author_id'] = $GLOBALS['userId'];
        $datetime = date('Y-m-d H:i:s');
        $newsData['created_at'] = $datetime;
        $newsData['updated_at'] = $datetime;

        $result = $this->newsModel->create($newsData);
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
            'news created successfully.'
        );
    }

    /**
     * Update a news with some attributes.
     *
     * @param    int        $id The ID of the news to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $newsData = $this->request->body();
        if (empty($newsData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($newsData, [
            'title' => 'min:1|max:255',
            'slug' => 'min:1|max:255',
            'thumbnail' => 'min:1|max:255',
            'status' => 'news_status',
            'content' => '',
            'category_id' => 'int',
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $newsData['updated_at'] = $datetime;

        $result = $this->newsModel->update($newsData, $id);
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
            'news updated successfully.'
        );
    }

    /**
     * Delete a news.
     *
     * @param    int        $id The ID of the news to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->newsModel->delete($id);

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
            'news deleted successfully.'
        );
    }
}
