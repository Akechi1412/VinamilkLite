<?php

namespace App\Controllers;

use Core\Controller;

class AddressController extends Controller
{
    private $addressModel;

    /**
     * addressController constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->addressModel = $this->model('address');
    }

    /**
     * Get all provinces.
     *
     * @return  string  The JSON response
     */
    public function getProvinces()
    {
        $provinces = $this->addressModel->getProvinces();

        if ($provinces === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $provinces,
        );
    }

    /**
     * Get all districts by province id.
     *
     * @param   int     $provinceId    The province_id of the districts to select
     * @return  string  The JSON response
     */
    public function getDistricts($provinceId)
    {
        $districts = $this->addressModel->getDistrictsbyProvinceId($provinceId);

        if ($districts === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $districts,
        );
    }

    /**
     * Get all wards by district id.
     *
     * @param   int     $districtId    The district_id of the wards to select
     * @return  string  The JSON response
     */
    public function getWards($districtId)
    {
        $wards = $this->addressModel->getWardsbyDistrictId($districtId);

        if ($wards === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $wards,
        );
    }

    /**
     * Get addresses.
     *
     * @return  string  The JSON response
     */
    public function getAddresses()
    {
        $queryParams = $this->request->params();
        $addresses = $this->addressModel->getMultiple($queryParams);

        if ($addresses === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $addresses,
        );
    }

    /**
     * Get a address by ID.
     *
     * @param    int         $id The ID of the address to retrieve
     * @return   string      The JSON response
     */
    public function getById($id)
    {
        $address = $this->addressModel->getById($id);

        if ($address === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $address
        );
    }

    /**
     * Get user addresses.
     *
     * @return   string      The JSON response
     */
    public function getUserAddresses()
    {
        $userId = $GLOBALS['userId'];
        $addresses = $this->addressModel->getByUserId($userId);

        if ($addresses === false) {
            return $this->response->status(500)->json(
                0,
                [],
                'Something was wrong!'
            );
        }

        return $this->response->status(200)->json(
            1,
            $addresses
        );
    }

    /**
     * Create a new address.
     *
     * @return  string  The JSON response
     */
    public function create()
    {
        $addressData = $this->request->body();
        $validationResult = $this->request->validate($addressData, [
            'ward_id' => 'required|int',
            'detail' => 'required|max:255',
            'phone' => 'required|phone',
            'as_default' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $addressData['user_id'] = $GLOBALS['userId'];
        $datetime = date('Y-m-d H:i:s');
        $addressData['created_at'] = $datetime;
        $addressData['updated_at'] = $datetime;

        $result = $this->addressModel->create($addressData);
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
            'address created successfully.'
        );
    }

    /**
     * Update a address with some attributes.
     *
     * @param    int        $id The ID of the address to update
     * @return   string     The JSON response
     */
    public function update($id)
    {
        $addressData = $this->request->body();
        if (empty($addressData)) {
            return $this->response->status(400)->json(
                0,
                [],
                'No data to update!'
            );
        }
        $validationResult = $this->request->validate($addressData, [
            'ward_id' => 'int',
            'detail' => 'max:255',
            'phone' => 'phone',
            'as_default' => 'int'
        ]);
        if ($validationResult !== true) {
            return $this->response->status(400)->json(
                0,
                [],
                $validationResult
            );
        }

        $address = $this->addressModel->getById($id);
        if (!$address) {
            return $this->response->status(404)->json(
                0,
                [],
                'Address not found!'
            );
        }
        if (!$GLOBALS['isAdmin'] && $address['user_id'] !== $GLOBALS['userId']) {
            return $this->response->status(403)->json(
                0,
                [],
                'You do not have permission to edit this address!'
            );
        }

        $datetime = date('Y-m-d H:i:s');
        $addressData['updated_at'] = $datetime;

        $result = $this->addressModel->update($addressData, $id);
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
            'address updated successfully.'
        );
    }

    /**
     * Delete a address.
     *
     * @param    int        $id The ID of the address to delete
     * @return   string     The JSON response
     */
    public function delete($id)
    {
        $address = $this->addressModel->getById($id);
        if (!$address) {
            return $this->response->status(404)->json(
                0,
                [],
                'Address not found!'
            );
        }
        if (!$GLOBALS['isAdmin'] && $address['user_id'] !== $GLOBALS['userId']) {
            return $this->response->status(403)->json(
                0,
                [],
                'You do not have permission to delete this address!'
            );
        }

        $result = $this->addressModel->delete($id);
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
            'address deleted successfully.'
        );
    }
}
