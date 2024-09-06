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
        Schema::table('event_sports', function (Blueprint $table) {
            // Add new columns
            $table->date('start_date')->nullable()->after('place');
            $table->date('end_date')->nullable()->after('start_date');
            $table->date('apply_due_date')->nullable()->after('end_date');

            // Drop the existing 'event_date' column
            $table->dropColumn('event_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('event_sports', function (Blueprint $table) {
            // Revert the dropped column
            $table->date('event_date')->nullable()->after('place');

            // Drop the newly added columns
            $table->dropColumn(['start_date', 'end_date', 'apply_due_date']);
        });
    }
};
