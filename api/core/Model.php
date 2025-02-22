<?php

namespace Core;

use Core\Database;

class Model
{
    /**
     * Database.
     *
     * @var object
     */
    public $db;

    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = '';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = [];

    /**
     * Model constructor.
     */
    public function __construct()
    {
        $this->db = new Database();
    }

    /**
     * Model destructor.
     */
    public function __destruct()
    {
        $this->db->closeConnection();
    }

    /**
     * Get records from the table.
     *
     * @param   array   $params   
     * @return  mixed   Array of results if successful, false otherwise
     */
    public function getMultiple($params = [])
    {
        if (empty($params)) {
            $rows = $this->db->table($this->tableName)
                ->select($this->selectedFields)->execute();

            return ['rows' => $rows];
        }

        $hasPagination = false;
        $offset = 0;
        $limit = 10;
        if (isset($params['_page'])) {
            $hasPagination = true;
            $page = (int)$params['_page'];
            unset($params['_page']);
            if (isset($params['_per_page'])) {
                $limit = (int)$params['_per_page'];
                unset($params['_per_page']);
            }
            $offset = ($page - 1) * $limit;
        }

        $sortFields = [];
        if (isset($params['_sort'])) {
            $sortFields = explode(',', $params['_sort']);
            unset($params['_sort']);
        }

        if ($hasPagination) {
            $rows = $this->db->table($this->tableName)
                ->select($this->selectedFields)->where($params)
                ->orderBy($sortFields)->limit($offset, $limit)->execute();

            $countRows = $this->db->table($this->tableName)
                ->count()->where($params)->execute();
            $totalRows = !empty($countRows)  ?  $countRows[0]['totalRows'] : 0;

            return [
                'rows' => $rows,
                'pagination' => [
                    'page' => $page,
                    'perPage' => $limit,
                    'totalRows' => $totalRows,
                    'totalPages' => ceil($totalRows / $limit)
                ]
            ];
        } else {
            $rows = $this->db->table($this->tableName)
                ->select($this->selectedFields)->where($params)
                ->orderBy($sortFields)->execute();

            return ['rows' => $rows];
        }
    }

    /**
     * Get a record by its ID from the table.
     *
     * @param   string|int  $id The ID of the record to select
     * @return  mixed       Array of results if successful, false otherwise
     */
    public function getById($id)
    {
        $result = $this->db->table($this->tableName)
            ->select($this->selectedFields)
            ->where(['id' => $id])->execute();

        if (!empty($result)) {
            return $result[0];
        } else {
            return [];
        }
    }

    /**
     * Create a new record in the table.
     *
     * @param   array   $data The data to insert
     * @return  bool    True if successful, false otherwise
     */
    public function create(array $data)
    {
        return $this->db->table($this->tableName)
            ->insert($data)->execute();
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
        return $this->db->table($this->tableName)
            ->update($data)->where(['id' => $id])->execute();
    }

    /**
     * Update a record with all attributes in the table.
     *
     * @param   array       $data The data to update
     * @param   string|int  $id The ID of the record to update
     * @return  bool        True if successful, false otherwise
     */
    public function updateAll(array $data, mixed $id)
    {
        return $this->db->table($this->tableName)
            ->update($data)->where(['id' => $id])->execute();
    }

    /**
     * Delete a record in the table where the ID matches, 
     *
     * @param   string|int  $id The ID of the record to delete
     * @return  bool    True if successful, false otherwise
     */
    public function delete($id)
    {
        return $this->db->table($this->tableName)
            ->delete()->where(['id' => $id])->execute();
    }
}
