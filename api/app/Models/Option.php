<?php

namespace App\Models;

use Core\Model;

class Option extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'options';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['option_key', 'option_value'];

    /**
     * Get a option by its key from the table.
     *
     * @param   string  $key The key of the option to select
     * @return  mixed   Array of results if successful, false otherwise
     */
    public function getByKey($key)
    {
        return $this->db->table($this->tableName)
            ->select($this->selectedFields)->where(['option_key' => $key])->execute()[0];
    }

    /**
     * Update a option by key.
     *
     * @param   array   $data The data to update
     * @param   string  $id The key of the option to update
     * @return  bool    True if successful, false otherwise
     */
    public function updateByKey(array $data, string $key)
    {
        return $this->db->table($this->tableName)
            ->update($data)->where(['option_key' => $key])->execute();
    }
}
