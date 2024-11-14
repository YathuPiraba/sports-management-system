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
        Schema::table('club_managers', function (Blueprint $table) {
            $table->string('gender')->after('lastName'); // Adjust the position if needed
        });

        Schema::table('members', function (Blueprint $table) {
            $table->string('gender')->after('lastName'); // Adjust the position if needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('club_managers', function (Blueprint $table) {
            $table->dropColumn('gender');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
