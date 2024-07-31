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
        Schema::create('event_sports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sports_id');
            $table->unsignedBigInteger('event_id');
            $table->string('name');
            $table->date('event_date');
            $table->string('place');
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('sports_id')->references('id')->on('sports_categories')->onDelete('cascade');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_sports');
    }
};
