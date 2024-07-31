<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gs_Division extends Model
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

    public function members()
    {
        return $this->hasMany(Member::class, 'gs_id');
    }

    public function clubmanagers()
    {
        return $this->hasMany(Club_Manager::class, 'gs_id');
    }
}
