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
        // Alter the 'match_date' column to change its type to 'date'
        Schema::table('matches', function (Blueprint $table) {
            $table->date('match_date')->change();  // Change match_date to store only the date
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Rollback the column change, revert to datetime
        Schema::table('matches', function (Blueprint $table) {
            $table->dateTime('match_date')->change();  // Revert match_date back to datetime
        });
    }
};
