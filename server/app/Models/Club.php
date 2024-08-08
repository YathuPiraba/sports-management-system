<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'clubName',
        'gs_id',
        'address',
        'club_history',
        'contactNo',
        'is_verified',
    ];

    // Relationships
    public function gsDivision()
    {
        return $this->belongsTo(Gs_Division::class, 'gs_id');
    }
}
