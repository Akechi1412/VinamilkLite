<?php

namespace App\Controllers;

use Core\Controller;

class CollectionController extends Controller
{
    private $collectionModel;

    /**
     * CollectionController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->collectionModel = $this->model('collection');
    }

    /**
     * Get collections.
     *
     * @return  string  The JSON response
     */
    public function getCollections()
    {
        $queryParams = $this->request->params();
        $collections = $this->collectionModel->getMultiple($queryParams);

        if ($collections === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $collections,
        );
    }

    /**
     * Get a collection by ID.
     *
     * @param    int         $id The ID of the collection to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $collection = $this->collectionModel->getById($id);

        if ($collection === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $collection
        );
    }

    /**
     * Create a new collection.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $collectionData = $this->request->body();
        $validationResult = $this->request->validate($collectionData, [
            'name' => 'required|max:255',
            'slug' => 'required|slug|max:255',
            'image' => 'max:255',
            'colection_order' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $collectionData['created_at'] = $datetime;
        $collectionData['updated_at'] = $datetime;

        $result = $this->collectionModel->create($collectionData);
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
            'Collection created successfully.'
        );
    }

    /**
     * Update a collection with some attributes.
     *
     * @param    int        $id The ID of the collection to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $collectionData = $this->request->body();
        if (empty($collectionData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($collectionData, [
            'name' => 'required|max:255',
            'slug' => 'required|slug|max:255',
            'image' => 'max:255',
            'colection_order' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $collectionData['updated_at'] = $datetime;

        $result = $this->collectionModel->update($collectionData, $id);
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
            'Collection updated successfully.'
        );
    }

    /**
     * Update a collection with all attributes.
     *
     * @param    int        $id The ID of the collection to update
     * @return   string     The JSON response
     */
    public function updateAll($id)
    {
        $collectionData = $this->request->body();
        $validationResult = $this->request->validate($collectionData, [
            'name' => 'required|max:255',
            'slug' => 'required|slug|max:255',
            'image' => 'max:255',
            'colection_order' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $collectionData['updated_at'] = $datetime;

        $result = $this->collectionModel->updateAll($collectionData, $id);
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
            'Collection updated successfully.'
        );
    }

    /**
     * Delete a collection.
     *
     * @param    int        $id The ID of the collection to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $result = $this->collectionModel->delete($id);

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
            'Collection deleted successfully.'
        );
    }
}
