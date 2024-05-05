<?php

namespace App\Controllers;

use Core\Controller;

class NewsCategoryController extends Controller
{
    private $newsCatgoryModel;

    /**
     * NewsCatgoryController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->newsCatgoryModel = $this->model('newsCategory');
    }

    /**
     * Get news catgories.
     *
     * @return  string  The JSON response
     */
    public function getNewsCatgories()
    {
        $queryParams = $this->request->params();
        $newCategories = $this->newsCatgoryModel->getMultiple($queryParams);

        if ($newCategories === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $newCategories,
        );
    }

    /**
     * Get a news catgorie by ID.
     *
     * @param    int         $id The ID of the news catgorie to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $newscategory = $this->newsCatgoryModel->getById($id);

        if ($newscategory === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $newscategory
        );
    }

    /**
     * Create a new news catgorie.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $newsCatgoryData = $this->request->body();
        $validationResult = $this->request->validate($newsCatgoryData, [
            'name' => 'required|max:255',
            'slug' => 'required|max:255',
            'cate_order' => 'required|int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $result = $this->newsCatgoryModel->getBySlug($newsCatgoryData['slug']);
        if (!empty($result)) {
            return $this->response->status(400)->json(
                0,
                [],
                "Collection slug existed!"
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $newsCatgoryData['created_at'] = $datetime;
        $newsCatgoryData['updated_at'] = $datetime;

        $result = $this->newsCatgoryModel->create($newsCatgoryData);
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
            'News Catgorie created successfully.'
        );
    }

    /**
     * Update a news catgorie with some attributes.
     *
     * @param    int        $id The ID of the news catgorie to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $newsCatgoryData = $this->request->body();
        if (empty($newsCatgoryData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($newsCatgoryData, [
            'name' => 'min:1|max:255',
            'slug' => 'min:1|max:255',
            'cate_order' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $newsCatgoryData['updated_at'] = $datetime;

        $result = $this->newsCatgoryModel->update($newsCatgoryData, $id);
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
            'News Catgorie updated successfully.'
        );
    }

    /**
     * Delete a news catgorie.
     *
     * @param    int        $id The ID of the news catgorie to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->newsCatgoryModel->delete($id);

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
            'News Catgorie deleted successfully.'
        );
    }
}
