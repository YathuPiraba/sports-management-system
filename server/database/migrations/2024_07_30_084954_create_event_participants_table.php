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
        Schema::create('event_participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_clubs_id');
            $table->unsignedBigInteger('member_sports_id');
            $table->date('participatedDate');
            $table->string('rank');
            $table->timestamps();

            $table->foreign('event_clubs_id')->references('id')->on('event_clubs')->onDelete('cascade');
            $table->foreign('member_sports_id')->references('id')->on('member_sports')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_participants');
    }
};
