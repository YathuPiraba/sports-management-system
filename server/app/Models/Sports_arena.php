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
}
