<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gs_division extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'divisionName',
        'divisionNo',
        'gs_Name',
        'contactNo',
    ];

    // Relationships
    public function clubs()
    {
        return $this->hasMany(Club::class, 'gs_id');
    }
}
