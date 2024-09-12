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
        Schema::table('notifications', function (Blueprint $table) {

            $table->unsignedBigInteger('recipient_id')->nullable()->change();

            // Adding foreign key columns
            $table->foreignId('event_sports_id')->nullable()->constrained('event_sports')->onDelete('cascade')->after('recipient_id');
            $table->foreignId('club_id')->nullable()->constrained('clubs')->onDelete('cascade')->after('event_sports_id');

            // Modifying existing columns
            $table->string('type', 50)->default('event_application')->change(); // Ensure default value for type
            $table->text('content')->nullable()->change(); // Make content nullable if needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->unsignedBigInteger('recipient_id')->nullable(false)->change();
            
            // Drop the new columns
            $table->dropForeign(['event_sports_id']);
            $table->dropColumn('event_sports_id');

            $table->dropForeign(['club_id']);
            $table->dropColumn('club_id');

            // Revert the modified columns
            $table->string('type', 50)->change(); // Revert to the original type
            $table->text('content')->nullable(false)->change(); // Revert to the original nullable state if needed
        });
    }
};
