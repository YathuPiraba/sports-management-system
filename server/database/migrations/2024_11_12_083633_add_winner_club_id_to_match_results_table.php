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
        Schema::table('match_results', function (Blueprint $table) {
            // Add nullable foreign key column for winner_club_id
            $table->foreignId('winner_club_id')
                ->nullable() // Make it nullable
                ->constrained('clubs') // Reference the 'clubs' table
                ->onDelete('set null'); // Set to null if the referenced club is deleted
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('match_results', function (Blueprint $table) {
            // Drop the foreign key and the column
            $table->dropForeign(['winner_club_id']);
            $table->dropColumn('winner_club_id');
        });
    }
};
