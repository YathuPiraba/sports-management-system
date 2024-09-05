<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_sports_id')->constrained('event_sports')->onDelete('cascade');
            $table->foreignId('home_club_id')->constrained('clubs')->onDelete('cascade');
            $table->foreignId('away_club_id')->constrained('clubs')->onDelete('cascade');
            $table->dateTime('match_date');
            $table->string('venue', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('matches');
    }
    
};
