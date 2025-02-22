<?php

namespace App\Models;

use Core\Model;

class User extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'users';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'email', 'first_name', 'last_name', 'role', 'avatar', 'ban_expired', 'created_at', 'updated_at'];

    /**
     * The safe fields.
     * 
     * @var array
     * 
     */
    protected $safeFields = ['first_name', 'last_name', 'avatar'];

    /**
     * Get public info of a user by id from the table.
     *
     * @param   string  $id The id of the user to select
     * @return  mixed   Array of results if successful, false otherwise
     */
    public function getPublicInfo($id)
    {
        $result =  $this->db->table($this->tableName)
            ->select($this->safeFields)
            ->where(['id' => $id])->execute();

        if (!empty($result)) {
            return $result[0];
        } else {
            return [];
        }
    }
}
