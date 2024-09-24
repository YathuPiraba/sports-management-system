<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club_Manager extends Model
{
    use HasFactory;

    protected $table = 'club_managers';

    protected $fillable = [
        'user_id',
        'club_id',
        'gs_id',
        'firstName',
        'lastName',
        'date_of_birth',
        'age',
        'address',
        'nic',
        'contactNo',
        'whatsappNo',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }

    public function gsDivision()
    {
        return $this->belongsTo(Gs_Division::class, 'gs_id');
    }
}
