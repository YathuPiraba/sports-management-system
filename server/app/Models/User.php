<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'userName',
        'email',
        'password',
        'role_id',
        'is_verified',
        'image',
    ];

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function clubManagers()
    {
        return $this->hasMany(Club_Manager::class, 'user_id');
    }
}
