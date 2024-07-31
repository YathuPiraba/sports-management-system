<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member_Sports extends Model
{
    use HasFactory;
    protected $fillable = [
        'club_id',
        'sports_id',
        'member_id',

    ];

    // Relationships
    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }

    public function sportsCategory()
    {
        return $this->belongsTo(Sports_Categories::class, 'sports_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
