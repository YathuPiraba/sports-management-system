<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sports_Arena extends Model
{
    use HasFactory;

    protected $table = 'sports_arenas';

    protected $fillable = [
        'name',
        'location',
        'address',
        'image'
    ];

    public function clubSports()
    {
        return $this->hasMany(Club_Sports::class, 'sports_arena_id');
    }
}
