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
            // Add new columns to the table
            $table->integer('participant_rank')->nullable()->after('participatedDate'); // Rank for the participant within the sport or event
            $table->foreignId('member_sports_id')->nullable()->change(); // Make the column nullable if needed
        });
    }

    public function down()
    {
        Schema::table('event_participants', function (Blueprint $table) {
            // Drop the new columns if we roll back the migration
            $table->dropColumn('participant_rank');
            // Remove nullable constraint if required
            $table->integer('member_sports_id')->change();
        });
    }
};
