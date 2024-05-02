<?php

namespace App\Controllers;

use Core\Controller;

class OptionController extends Controller
{
    private $optionModel;

    /**
     * OptionController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->optionModel = $this->model('option');
    }

    /**
     * Get options.
     *
     * @return  string  The JSON response
     */
    public function getOptions()
    {
        $options = $this->optionModel->getMultiple();

        if ($options === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $options,
        );
    }

    /**
     * Get a option by key.
     *
     * @param    int         $id The key of the option to retrieve
     * @return   string      The JSON response
     */
    public function getByKey($key)
    {
        $option = $this->optionModel->getByKey($key);

        if ($option === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $option
        );
    }

    /**
     * Update value of a option by key.
     *
     * @param    int        $key The key of the option to update
     * @return   string     The JSON response
     */
    public function update($key)
    {
        $optionData = $this->request->body();

        $result = $this->optionModel->updateByKey($optionData, $key);
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
            'Option updated successfully.'
        );
    }
}
