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
        Schema::table('event_participants', function (Blueprint $table) {
            $table->date('participatedDate')->nullable()->change();
            $table->integer('participant_rank')->nullable()->change();
            $table->integer('rank')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event_participants', function (Blueprint $table) {
            $table->date('participatedDate')->nullable(false)->change();
            $table->integer('participant_rank')->nullable(false)->change();
            $table->integer('rank')->nullable(false)->change();
        });
    }
};
