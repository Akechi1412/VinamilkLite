<?php

namespace App\Models;

use Core\Model;

class News extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'news';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'title', 'slug', 'thumbnail', 'status', 'category_id', 'content', 'author_id', 'created_at', 'updated_at'];

    /**
     * Get a news by slug from the table.
     *
     * @param   string  $slug The slug of the news to select
     * @return  mixed   Array of results if successful, false otherwise
     */
    public function getBySlug($slug)
    {
        $result =  $this->db->table($this->tableName)
            ->select($this->selectedFields)
            ->where(['slug' => $slug])->execute();

        if (!empty($result)) {
            return $result[0];
        } else {
            return [];
        }
    }
}
