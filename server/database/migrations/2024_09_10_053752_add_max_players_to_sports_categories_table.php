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
        Schema::table('sports_categories', function (Blueprint $table) {
            $table->integer('min_Players')->nullable()->after('type'); // replace 'column_name' with the column after which you want to add Max_Players
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sports_categories', function (Blueprint $table) {
            $table->dropColumn('Max_Players');
        });
    }
};
