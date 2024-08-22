<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member_Sports extends Model
{
    use HasFactory;
    protected $table = 'member_sports';

    protected $fillable = [
        'sports_id',
        'member_id',

    ];


    public function sportsCategory()
    {
        return $this->belongsTo(Sports_Categories::class, 'sports_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }


        // One-to-many relationship with MemberAchievement
    public function achievements()
    {
      return $this->hasMany(Member_Achievement::class);
    }

      // One-to-many relationship with Event participants
      public function events()
      {
        return $this->hasMany(Event_Participants::class);
      }

       // Many-to-many relationship with Skills
    public function skills()
    {
        return $this->belongsToMany(Skills::class, 'member_skills', 'member_sports_id', 'skill_id');
    }


}
