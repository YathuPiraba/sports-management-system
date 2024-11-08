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
        Schema::dropIfExists('event_schedules');
        Schema::dropIfExists('event_rankings');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Re-create the event_schedules table
        Schema::create('event_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('schedule_type', 50);
            $table->dateTime('schedule_date');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Re-create the event_rankings table
        Schema::create('event_rankings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_sports_id')->constrained('event_sports')->onDelete('cascade');
            $table->foreignId('club_id')->constrained('clubs')->onDelete('cascade');
            $table->integer('rank')->nullable();
            $table->integer('points')->default(0);
            $table->timestamps();
        });
    }
};
