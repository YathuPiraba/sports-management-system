<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'club_id',
        'gs_id',
        'manager_id',
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
    public function manager()
    {
        return $this->belongsTo(Club_Manager::class, 'manager_id');
    }

      // Many-to-many relationship with Sports
      public function sports()
      {
          return $this->belongsToMany(Sport::class, 'member_sports');
      }
}
