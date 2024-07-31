<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    use HasFactory;
     protected $fillable = [
        'name',
        'start_date',
        'end_date'
     ];

         // Many-to-many relationship with Sports Categories
     public function sportsCategories()
     {
        return $this->belongsToMany(Sports_Category::class, 'event_sports', 'event_id', 'sports_category_id');
     }
}
