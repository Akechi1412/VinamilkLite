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
}
