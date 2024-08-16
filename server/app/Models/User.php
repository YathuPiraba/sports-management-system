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
        'password_reset_token',
        'password_reset_expires_at'
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

    public function clubMembers()
    {
        return $this->hasMany(Member::class, 'user_id');
    }

    public function safeAttributes()
    {
        return [
            'id' => $this->id,
            'userName' => $this->userName,
            'email' => $this->email,
            'image' => $this->image,
            'role_id' => $this->role_id,
            'is_verified' => $this->is_verified,
        ];
    }
}
