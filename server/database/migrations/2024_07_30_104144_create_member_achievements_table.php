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
        Schema::create('member_achievements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('member_sport_id');
            $table->string('achievement');
            $table->date('achievement_date');
            $table->timestamps();

            $table->foreign('member_sport_id')->references('id')->on('member_sports')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_achievements');
    }
};
