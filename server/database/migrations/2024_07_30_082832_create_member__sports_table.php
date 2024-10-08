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
        Schema::create('member_sports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sports_id');
            $table->unsignedBigInteger('member_id');
            $table->timestamps();

            $table->foreign('sports_id')->references('id')->on('sports_categories')->onDelete('cascade');
            $table->foreign('member_id')->references('id')->on('members')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('member_sports');
    }
};
