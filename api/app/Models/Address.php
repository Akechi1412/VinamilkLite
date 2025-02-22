<?php

namespace App\Models;

use Core\Model;
use Exception;

class Address extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'addresses';

    /**
     * Ward table name.
     *
     * @var string
     */
    private $wardTableName = 'wards';

    /**
     * District table name.
     *
     * @var string
     */
    private $districtTableName = 'districts';

    /**
     * Province table name.
     *
     * @var string
     */
    private $provinceTableName = 'provinces';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'user_id', 'ward_id', 'detail', 'phone', 'as_default', 'created_at', 'updated_at'];

    /**
     * Get a address by its ID from the table.
     *
     * @param   string|int  $id The ID of the address to select
     * @return  mixed       Array of results if successful, false otherwise
     */
    public function getById($id)
    {
        $result = $this->db->statement('select')
            ->sql('SELECT a.*, 
                w.name AS ward_name, 
                d.name AS district_name, 
                d.id AS district_id,
                p.name AS province_name,
                p.id AS province_id
                FROM addresses a
                JOIN wards w ON a.ward_id = w.id
                JOIN districts d ON w.district_id = d.id
                JOIN provinces p ON d.province_id = p.id
                WHERE a.id = ?')
            ->params(['id' => $id])->execute();

        if (!empty($result)) {
            return $result[0];
        } else {
            return [];
        }
    }

    /**
     * Get a addresses by user id from the table.
     *
     * @param   string  $id   The user_id of the address to select
     * @return  mixed   Array of results
     */
    public function getByUserId($userId)
    {
        $result =  $this->db->statement('select')
            ->sql('SELECT a.*, 
                w.name AS ward_name, 
                d.name AS district_name,
                d.id AS district_id, 
                p.name AS province_name,
                p.id AS province_id
                FROM addresses a
                JOIN wards w ON a.ward_id = w.id
                JOIN districts d ON w.district_id = d.id
                JOIN provinces p ON d.province_id = p.id')
            ->where(['user_id' => $userId])->execute();

        return $result;
    }

    /**
     * Get all provinces.
     *
     * @return  mixed   Array of results
     */
    public function getProvinces()
    {
        $result =  $this->db->table($this->provinceTableName)->select()->execute();

        return $result;
    }

    /**
     * Get all districts by province id.
     *
     * @param   int     $provinceId    The province_id of the districts to select
     * @return  mixed   Array of results
     */
    public function getDistrictsbyProvinceId($provinceId)
    {
        $result =  $this->db->table($this->districtTableName)
            ->select()->where(['province_id' => $provinceId])->execute();

        return $result;
    }

    /**
     * Get all wards by district id.
     *
     * @param   int     $districtId    The district_id of the wards to select
     * @return  mixed   Array of results
     */
    public function getWardsbyDistrictId($districtId)
    {
        $result =  $this->db->table($this->wardTableName)
            ->select()->where(['district_id' => $districtId])->execute();

        return $result;
    }

    /**
     * Check if user has default address.
     *
     * @param   int     $userId   The user_id of the address to select
     * @return  bool    True if has default address, false otherwise
     */
    public function hasDefault($userId)
    {
        $result =  $this->db->table($this->tableName)
            ->select()->where(['user_id' => $userId, 'as_default' => 1])->execute();
        if (!empty($result)) {
            echo 123;
            return false;
        }
        echo 124;
        return true;
    }

    /**
     * Create a new address.
     *
     * @param   array   $data The data to insert
     * @return  bool    True if successful, false otherwise
     */
    public function create(array $data)
    {
        if (!$this->hasDefault($GLOBALS['userId'])) {
            $data['as_default'] = 1;
        }
        if (!isset($data['as_default']) || !$data['as_default']) {
            return $this->db->table($this->tableName)
                ->insert($data)->execute();
        }

        try {
            $this->db->beginTransaction();
            $data['as_default'] = 1;
            $this->db->table($this->tableName)
                ->update(['as_default' => 0])
                ->where(['user_id' => $GLOBALS['userId']])->execute();
            $this->db->table($this->tableName)
                ->insert($data)->execute();
            $this->db->commitTransaction();
            return true;
        } catch (Exception $e) {
            throw $e;
            $this->db->rollbackTransaction();
            return false;
        }
    }

    /**
     * Update a record with some attributes in the table.
     *
     * @param   array       $data The data to update
     * @param   string|int  $id The ID of the record to update
     * @return  bool        True if successful, false otherwise
     */
    public function update(array $data, mixed $id)
    {
        if (!$this->hasDefault($GLOBALS['userId'])) {
            $data['as_default'] = 1;
        }

        if (!isset($data['as_default']) || !$data['as_default']) {
            return $this->db->table($this->tableName)
                ->update($data)->where(['id' => $id])->execute();
        }

        try {
            $this->db->beginTransaction();
            $data['as_default'] = 1;
            $this->db->table($this->tableName)
                ->update(['as_default' => 0])
                ->where(['user_id' => $GLOBALS['userId']])->execute();
            $this->db->table($this->tableName)
                ->update($data)->where(['id' => $id])->execute();
            $this->db->commitTransaction();
            return true;
        } catch (Exception $e) {
            throw $e;
            $this->db->rollbackTransaction();
            return false;
        }
    }
}
