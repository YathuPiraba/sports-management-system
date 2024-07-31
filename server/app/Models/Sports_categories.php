<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sports_Categories extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'number_of_members',
        'type',
        'description',
        'image'
    ];
}
