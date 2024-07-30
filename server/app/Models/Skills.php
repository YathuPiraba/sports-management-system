<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skills extends Model
{
    use HasFactory;

    protected $fillable = ['sports_id', 'skill'];

    /**
     * Get the sport category that the skill belongs to.
     */
    public function sportCategory()
    {
        return $this->belongsTo(Sports_categories::class, 'sports_id');
    }

    /**
     * The member sports that have this skill.
     */
    public function memberSports()
    {
        return $this->belongsToMany(Member_Sports::class, 'member_skills', 'skill_id', 'member_sport_id');
    }
}
