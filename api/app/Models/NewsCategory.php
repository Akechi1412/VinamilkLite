<?php

namespace App\Models;

use Core\Model;

class NewsCategory extends Model
{
    /**
     * Table name.
     *
     * @var string
     */
    protected $tableName = 'news_categories';

    /**
     * The selected fields.
     * 
     * @var array
     * 
     */
    protected $selectedFields = ['id', 'name', 'slug', 'cate_order', 'created_at', 'updated_at'];

    /**
     * Get a news category by slug from the table.
     *
     * @param   string  $slug The slug of the news category to select
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
